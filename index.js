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

app.put('/add/plant', function (req,res) {
    const username = jwt.verify(req.body.token,secret).data
    const names = data[username].plants.map(el => el.name)

    if (names.includes(req.body.plant.name)) {
        res.status(400).json({message:"Name already exists"})
    } else {
        data[username].plants.push(req.body.plant)
        writeJson()
        res.status(200).json({message:"Plant added"})
    }
})
app.get('/get/plants/*', function (req,res) {
    const username = req.url.split("/")[3]
    console.log(username)
    if (jwt.verify(req.headers.token,secret).data == username) res.status(200).json(data[username].plants)
})
app.get('/get/plant/*/*', function (req,res) {
    const username = req.url.split("/")[3]
    const name = req.url.split("/")[4]
    const names = data[username].plants.map(el => el.name)
    const index = names.indexOf(name)

    if (jwt.verify(req.headers.token,secret).data == username) res.status(200).json(data[username].plants[index])
})
app.delete('/get/plant/*/*', function (req,res) {
    const username = req.url.split("/")[3]
    const name = req.url.split("/")[4]
    const names = data[username].plants.map(el => el.name)
    const index = names.indexOf(name)

    data[username].plants.splice(index,1)
    writeJson()

    if (jwt.verify(req.headers.token,secret).data == username) res.status(200).json({message: "Deleted successfully",plants: data[username].plants})
})

app.put('/put/plant/*', function (req,res) {
    const device_id = req.url.split("/")[3]
    const device_password = req.body.authorization



    const names = data[username].plants.map(el => el.name)
    const index = names.indexOf(name)

    if (jwt.verify(req.headers.token,secret).data == username) res.status(200).json(data[username].plants[index])
})


app.listen(3000)

function writeJson(input = data,file = "data") {
    fs.writeFile(`./data/${file}.json`, JSON.stringify(input), function writeJSON(err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(input));
        console.log('writing to ' + file);
    });
}