const express = require('express')
const data = require('./data/data.json')
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")
const fs = require('fs')
const{process} = require('./processing.js')

const {
    create_login_db,
    create_pi_id_db,
    create_user_db,
    create_login_table,
    pi_id_table,
    plant_table,
    create_user,
    create_pi,
    set_pi_plant,
    plant_info,
    get_users,
    get_pi,
    plant_type,
    check_pi,
    get_plants,
    delete_db,
    delete_table,
    delete_items,
    getResult
} = require('./Login.js')

const app = express()
app.use(express.json());
app.use(cookieParser())
const secret = "ioteam"

app.get('/html/index.css', function (req, res) {
    res.sendFile('html/index.css', {root: __dirname })
})
app.get('/html/dashboard.css', function (req, res) {
    res.sendFile('html/dashboard.css', {root: __dirname })
})

app.get('/html/index.js', function (req, res) {
    res.sendFile('html/index.js', {root: __dirname })
})
app.get('/html/dashboard.js', function (req, res) {
    res.sendFile('html/dashboard.js', {root: __dirname })
})
app.get('/images/Basil.png', function (req, res) {
    res.sendFile('images/Basil.png', {root: __dirname })
})
app.get('/images/Mint.png', function (req, res) {
    res.sendFile('images/Mint.png', {root: __dirname })
})
app.get('/images/leaf.jpeg', function (req, res) {
    res.sendFile('images/leaf.jpeg', {root: __dirname })
})
app.get('/images/temp.png', function (req, res) {
    res.sendFile('images/temp.png', {root: __dirname })
})
app.get('/images/humidity.png', function (req, res) {
    res.sendFile('images/humidity.png', {root: __dirname })
})
app.get('/images/light.png', function (req, res) {
    res.sendFile('images/light.png', {root: __dirname })
})
app.get('/images/moist.png', function (req, res) {
    res.sendFile('images/moist.png', {root: __dirname })
})

function verify(token) {
    try {
        jwt.verify(token,secret)
        return true
    } catch (e) {
        return false
    }
}

// RETURNS DASHBOARD HTML (DON'T CHANGE)
app.get('/dashboard', function (req, res) {
    const token = req.cookies.token
    if (verify(token)) {
        res.sendFile('html/dashboard.html', {root: __dirname })
    } else {
        res.redirect('/')
    }
})

app.get('/', function (req, res) {
    res.sendFile('html/index.html', {root: __dirname })
})

// CHECK LOGIN IS VALID AND RETURN A TOKEN (PROBABLY BEST WE DO THIS TOGETHER)
app.post('/login', async function (req, res) {
    const details = req.body

    // if (details.token !== undefined) {
    //     if (verify(details.token)) {
    //         res.status(200).json({message:"Authorized",token:details.token})  
    //     } else {
    //         res.status(401).json({message:'Token Invalid'})
    //     }
    //     return
    // }
    // if (!Object.keys(data).includes(details.username)) {
    //     res.status(401).json({message:'Username is not registered'})
    //     return
    // }
    // if (data[details.username].password == details.password) {
    //     const token = jwt.sign({
    //         data: details.username
    //       }, secret, { expiresIn: 60*60 });


    //     res.status(200).json({message:"Authorized",token:token})        
    // } else {
    //     res.status(401).json({message:"Password incorrect"})
    // }

    if (details.token !== undefined) {
        if (verify(details.token)) {
            res.status(200).json({ message: "Authorized", token: details.token })
        } else {
            res.status(401).json({ message: 'Token Invalid' })
        }
        return
    }
    const raw_login = await get_users();
    const passwords = raw_login.map(el => el.pass);
    const usernames = raw_login.map(el => el.user);

    if (!usernames.includes(details.username)) {
        res.status(401).json({ message: 'Username is not registered' })
        return
    }
    
    if (usernames.includes(details.username) && (passwords[usernames.indexOf(details.username)] == details.password)) {
        const token = jwt.sign({
            data: details.username
        }, secret, { expiresIn: 60 * 60 });


        res.status(200).json({ message: "Authorized", token: token })
    } else {
        res.status(401).json({ message: "Password incorrect" })
    }
})

// ADD A PLANT TO A USER'S DB
app.put('/add/plant/*', async function (req,res) {
    const username = req.url.split("/")[3]

    // // TEMP CODE
    // const names = data[username].plants.map(el => el.name)

    // // CHECK IF NAME ALREADY EXISTS AND DO NOT ADD IF IT DOES
    // if (names.includes(req.body.plant.name)) {

    //     // RETURNS STATUS 400
    //     res.status(400).json({message:"Name already exists"})
    // } else {

    //     // TEMO CODE TO ADD PLANT TO DB (REPLACE WITH YOUR CODE)
    //     data[username].plants.push(req.body.plant)
    //     writeJson()
    //     // END OF TEMP CODE

    //     // RETURNS STATUS 200
    //     res.status(200).json({message:"Plant added"})
    // }

    try {
        const raw_names = await check_pi(username)
        let eachel = `Tables_in_${username}`
        const names = raw_names.map(el => el[eachel])
        const name = req.body.plant.name

        if (names.includes(name)) {
            res.status(400).json({ message: "Name already exists" })
        } else {
            set_pi_plant(req.body.plant.deviceId, req.body.plant.devicePass, name, req.body.plant.type,username) // 
            plant_table(username, req.body.plant.deviceId)
            res.status(200).json({ message: "Plant added" })

        }
    } catch (e) {
        res.status(400).json({ message: `Error: ${e}` })
    }
})

// GET ALL PLANTS IN USER'S DB
app.get('/get/plants/*',async function (req,res) {
    const username = req.url.split("/")[3]

    // // TEMP CODE (COMMENT OUT WHEN DONE)
    // const plants_data = data[username].plants
    // //END OF TEMP CODE



    // // YOUR CODE RETURNING LIST OF ALL PLANTS

    // // const plants_data = 
    // //

    // if (jwt.verify(req.headers.token,secret).data == username) res.status(200).json(plants_data)

    const raw_names = await check_pi(username)
    const name = `Tables_in_${username}`;
    const ids = raw_names.map(el => el[name])

    const pis = await get_pi()
    const pi_ids = pis.map(el => el.id)

    let arr = []
    for (let i=0; i<pi_ids.length; i++) {
        if (ids.includes(pi_ids[i])) arr.push(pis[i])
    }

    res.status(200).json(arr)
})


// GET LATEST DATA FOR PLANT
app.get('/get/plant/*/*',async function (req,res) {
    const username = req.url.split("/")[3]
    const plant_id = req.url.split("/")[4]


    // // TEMP CODE COMMENT OUT WHEN USING YOURS
    // const names = data[username].plants.map(el => el.name)
    // const index = names.indexOf(plant_name)

    // let plant_data = data[username].plants[index]
    // let latest = plant_data.data[Object.keys(plant_data.data)[0]]
    // latest.type = plant_data.type
    // latest.processed = process(latest)


    // // END OF TEMP CODE


    // // YOUR CODE SETTING THE VALUE OF PLANT_DATA TO JSON FORMATTED LATEST PLANT DATA (FORMAT IN /PUT/PLANT)

    // // const plant_data = 
    // //

    

    // if (jwt.verify(req.headers.token,secret).data == username) res.status(200).json(latest)

    const plant_data_all = await get_plants(username, plant_id)
    const plant_data = plant_data_all[plant_data_all.length-1]

    console.log(plant_data)
    const pi_data = await plant_type(plant_id)


    const data = {
        type: pi_data[0].planttype,
        temperature: plant_data[0].temperature,
        humidity: plant_data[0].humidity,
        last_moistured: plant_data[0].lastmoistured,
        moisture: plant_data[0].moisture,
        light: {
            '450': plant_data.light450,
            '500': plant_data.light500,
            '550': plant_data.light550,
            '570': plant_data.light570,
            '600': plant_data.light600,
            '650': plant_data.light650
        }
    }

    data.processed = process(data)

    if (plant_data.includes(undefined)) {
        res.status(400).json({ message: "No Data" })
    } else {
        res.status(200).json(data)
    }
})


// DELETE PLANT FROM USER'S DB
app.delete('/get/plant/*/*',async function (req,res) {
    const username = req.url.split("/")[3]
    const plant_id = req.url.split("/")[4]

    await delete_table(username, plant_id);
    await set_pi_plant(req.body.plant.deviceId, req.body.plant.devicePass, null, null, null) // 
    // if (jwt.verify(req.headers.token,secret).data == username) res.status(200).json({message: "Deleted successfully",plants: plants_data})

})


// STORE PI DATA TO DB
app.put('/put/plant/*',async function (req,res) {
    // const device_id = req.url.split("/")[3]
    // const device_password = req.body.authorization
    // const json_data = req.body


    // // JSON DATA FORMAT
    // // {
    // //     temperature: 24.16087158203124,
    // //     humidity: 16.75,
    // //     moisture: 0,
    // //     light: { '450': 30, '500': 45, '550': 60, '570': 45, '600': 50, '650': 45 }
    // // }


    // // STORE THE DATA ON THE DB





    // res.status(200).json({message: "Received"})

    // const username = "luke" //need this to access the plant database, don't know where from
    const device_id = req.url.split("/")[3]
    const device_password = req.headers.authorization

    // const json_data = { // change to data from pi
    //     temperature: 24.16087158203124,
    //     humidity: 16.75,
    //     moisture: 0,
    //     lastmoistured: 123,
    //     light: { '450': 30, '500': 45, '550': 60, '570': 45, '600': 50, '650': 45 }
    // }

    const pi_data = await get_pi();
    const ids = pi_data.map(el => el.id);
    const passes = pi_data.map(el => el.pass);

    const obj = pi_data[ids.indexOf(device_id)]
    const username = obj.username

    if (ids.includes(device_id) && (passes[ids.indexOf(device_id)] == device_password)) {
        plant_info(username, device_id, req.body); // 
        res.status(200).json({ message: `Inserted Data into ${username}.${device_id}` })

    } else {
        res.status(400).json({ message: `Incorrect Password or Format of data` })
    }

})

console.log(8080)

app.listen(8080)

function writeJson(input = data,file = "data") {
    fs.writeFile(`./data/${file}.json`, JSON.stringify(input), function writeJSON(err) {
        if (err) return console.log(err);
    });
}
