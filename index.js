const express = require('express')
const data = require('./data/data.json')
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")
const fs = require('fs')

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
    console.log(req.cookies)
    const token = req.cookies.token
    // console.log(jwt.verify(token,secret))
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
app.post('/login', function (req, res) {
    const details = req.body

    if (details.token !== undefined) {
        if (verify(details.token)) {
            res.status(200).json({message:"Authorized",token:details.token})  
        } else {
            res.status(401).json({message:'Token Invalid'})
        }
        return
    }
    if (!Object.keys(data).includes(details.username)) {
        res.status(401).json({message:'Username is not registered'})
        return
    }
    if (data[details.username].password == details.password) {
        const token = jwt.sign({
            data: details.username
          }, secret, { expiresIn: 60*60 });

        console.log(token)

        res.status(200).json({message:"Authorized",token:token})        
    } else {
        res.status(401).json({message:"Password incorrect"})
    }
})

// ADD A PLANT TO A USER'S DB
app.put('/add/plant/*', function (req,res) {
    const username = req.url.split("/")[3]

    // TEMP CODE
    const names = data[username].plants.map(el => el.name)

    // CHECK IF NAME ALREADY EXISTS AND DO NOT ADD IF IT DOES
    if (names.includes(req.body.plant.name)) {

        // RETURNS STATUS 400
        res.status(400).json({message:"Name already exists"})
    } else {

        // TEMO CODE TO ADD PLANT TO DB (REPLACE WITH YOUR CODE)
        data[username].plants.push(req.body.plant)
        writeJson()
        // END OF TEMP CODE

        // RETURNS STATUS 200
        res.status(200).json({message:"Plant added"})
    }
})

// GET ALL PLANTS IN USER'S DB
app.get('/get/plants/*', function (req,res) {
    const username = req.url.split("/")[3]

    // TEMP CODE (COMMENT OUT WHEN DONE)
    const plants_data = data[username].plants
    //END OF TEMP CODE



    // YOUR CODE RETURNING LIST OF ALL PLANTS

    // const plants_data = 
    //

    if (jwt.verify(req.headers.token,secret).data == username) res.status(200).json(plants_data)
})


// GET LATEST DATA FOR PLANT
app.get('/get/plant/*/*', function (req,res) {
    const username = req.url.split("/")[3]
    const plant_name = req.url.split("/")[4]


    // TEMP CODE COMMENT OUT WHEN USING YOURS
    const names = data[username].plants.map(el => el.name)
    const index = names.indexOf(plant_name)

    const plant_data = data[username].plants[index]
    // END OF TEMP CODE


    // YOUR CODE SETTING THE VALUE OF PLANT_DATA TO JSON FORMATTED LATEST PLANT DATA (FORMAT IN /PUT/PLANT)

    // const plant_data = 
    //

    if (jwt.verify(req.headers.token,secret).data == username) res.status(200).json(plant_data)
})


// DELETE PLANT FROM USER'S DB
app.delete('/get/plant/*/*', function (req,res) {
    const username = req.url.split("/")[3]
    const plant_name = req.url.split("/")[4]


    //TEMP CODE (COMMENT OUT WHEN ADDED DB)
    const names = data[username].plants.map(el => el.name)
    const index = names.indexOf(plant_name)

    data[username].plants.splice(index,1)
    writeJson()

    const plants_data = data[username].plants
    // END OF TEMP CODE



    // SET VALUE OF PLANTs_DATA TO USER'S NEW PLANT LIST (WITHOUT DELETED PLANT)
    
    // const plants_data = 
    //

    if (jwt.verify(req.headers.token,secret).data == username) res.status(200).json({message: "Deleted successfully",plants: plants_data})
})


// STORE PI DATA TO DB
app.put('/put/plant/*', function (req,res) {
    const device_id = req.url.split("/")[3]
    const device_password = req.body.authorization
    const json_data = req.body

    console.log(json_data)

    // JSON DATA FORMAT
    // {
    //     temperature: 24.16087158203124,
    //     humidity: 16.75,
    //     moisture: 0,
    //     light: { '450': 30, '500': 45, '550': 60, '570': 45, '600': 50, '650': 45 }
    // }


    // STORE THE DATA ON THE DB



    res.status(200).json({message: "Received"})

})

console.log(8080)

app.listen(8080)

function writeJson(input = data,file = "data") {
    fs.writeFile(`./data/${file}.json`, JSON.stringify(input), function writeJSON(err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(input));
        console.log('writing to ' + file);
    });
}
