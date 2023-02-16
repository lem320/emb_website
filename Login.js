// const { json } = require('body-parser');
var mysql = require('mysql');
// const { resolve } = require('path');

// Connecting to aws without specific database
async function connect_aws() {

    var con = mysql.createConnection({
        host: "plant-db.cxiwggxylha8.us-east-1.rds.amazonaws.com",
        port: 3306,
        user: "ioteam",
        password: "raspberrypi"
    });
    return con;
};


// Connecting to aws with specific database
async function connect_db(database_name) {
    
    var con = mysql.createConnection({
        host: "plant-db.cxiwggxylha8.us-east-1.rds.amazonaws.com",
        port: 3306,
        user: "ioteam",
        password: "raspberrypi",
        database: database_name
    });
    return con;
};

async function create_db(con, database_name) {
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = `CREATE DATABASE IF NOT EXISTS ${database_name}`;
            con.query(sql, function (err, result) {
                con.end();
                if (err) reject(err);
                console.log("Database Created");
                resolve(result);
            });

        });
    })
};

//create_db(connect_aws(), "hi")

function create_table(con, sql) {
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            con.query(sql, function (err, result) {
                con.end();
                if (err) reject(err);
                console.log("Table Created");
                resolve(result);
            });
        });
    })

};

function insert_table(con, sql) {
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            con.query(sql, function (err, result) {
                con.end();
                if (err) reject(err);
                console.log("Table Created");
                resolve(result);
            });
        });
    })

};

function delete_anything(con, sql) {
    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            con.query(sql, function (err, result) {
                con.end();
                if (err) reject(err);
                console.log("Deleted");
                resolve(result);
            });
        });
    })
};

//--------------------------------------------------
//Database Creations

//Login in database -> fixed name
async function create_login_db() {
    var con = await connect_aws();

    await create_db(con, 'Login');

};

// create_login_db();

//Pi info database -> fixed name
async function create_pi_id_db() {
    var con = await connect_aws();

    await create_db(con, 'pi_id');
};

//create_pi_id_db();

//Plant database -> variable name
async function create_user_db(database_name) {
    var con = await connect_aws();

    await create_db(con, database_name)
};

//create_user_db("babs");
//----------------------------------------

//Database Tables

//Login Table -> struct {user, password}
async function create_login_table() {
    var con = await connect_db('Login');

    var sql = `CREATE TABLE IF NOT EXISTS Users (user VARCHAR(128) NOT NULL, pass VARCHAR(128) NOT NULL)`;

    await create_table(con, sql);
};

//create_login_table();
// Pi info table -> struct {pi_id, password}

async function pi_id_table() {
    var con = await connect_db('pi_id');

    var sql = `CREATE TABLE IF NOT EXISTS pi_info (id VARCHAR(128) NOT NULL, pass VARCHAR(128) NOT NULL, plantname VARCHAR(128), planttype VARCHAR(128), username VARCHAR(128))`;

    await create_table(con, sql);
};

//pi_id_table();
// Plant info table -> struct {temp, hum, mois, l1, l2, l3, l4, l5, l6}

async function plant_table(database_name, pi_id) {
    var con = await connect_db(database_name);

    var sql = `CREATE TABLE IF NOT EXISTS ${pi_id} (temperature FLOAT NOT NULL, humidity FLOAT NOT NULL, lastmoistured FLOAT NOT NULL, moisture FLOAT NOT NULL, light450 FLOAT NOT NULL, light500 FLOAT NOT NULL, light550 FLOAT NOT NULL, light570 FLOAT NOT NULL, light600 FLOAT NOT NULL, light650 FLOAT NOT NULL, time TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`;

    await create_table(con, sql);
};
//plant_table("testusername", "pi1");
//-----------------------------------------------

// Adding new "users" to the databases

// New login -> pass in the chosen username and password

async function create_user(user, pass) {
    var con = await connect_db('Login');

    var sql = `INSERT INTO Users (user, pass) VALUES ("${user}", "${pass}")`;

    await insert_table(con, sql);
};

//create_user("testusername", "pass");

// Pi id -> pass in pi id and password

async function create_pi(pi, pass) {
    var con = await connect_db('pi_id');

    var sql = `INSERT INTO pi_info (id, pass, plantname, planttype, username) VALUES ("${pi}", "${pass}", NULL, NULL, NULL)`;

    await insert_table(con, sql);
};

//create_pi("123", "yeet");

async function set_pi_plant(pi, pass, plantname, planttype, username) {
    var con = await connect_db('pi_id');

    var sql = `UPDATE pi_info SET plantname="${plantname}", planttype="${planttype}", username="${username}" WHERE id="${pi}" AND pass="${pass}"`;

    await insert_table(con, sql);
};

//Need to change the inputs depending on how to send in to function
// database = username, pi_id = pi_id, rest = values

async function plant_info(database_name, pi_id, jsondata) {
    var con = await connect_db(database_name);

    var list = Object.entries(jsondata);
    var light = Object.entries(list[4][1]);
    var sql = `INSERT INTO ${pi_id} (temperature, humidity, moisture, lastmoistured, light450, light500, light550, light570, light600, light650, time) VALUES (${list[0][1]}, ${list[1][1]}, ${list[2][1]}, ${list[3][1]}, ${light[0][1]}, ${light[1][1]}, ${light[2][1]}, ${light[3][1]}, ${light[4][1]}, ${light[5][1]}, CURRENT_TIMESTAMP())`;

    await insert_table(con, sql)
};


//---------------------------------------


// THis need to be adjusted to be able to get the result from the select query and neatening

async function get_users() {
    var con = await connect_db('Login')

    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) reject(err)

            var sql = `SELECT user, pass FROM Users`;
            con.query(sql, function (err, result) {
                con.end();
                if (err) reject(err);
                resolve(result);
            });
        });
    });
}

// get_users()

async function get_pi() {
    var con = await connect_db('pi_id')

    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) reject(err)

            var sql = `SELECT id, pass, plantname, planttype, username FROM pi_info`;
            con.query(sql, function (err, result) {
                con.end();
                if (err) reject(err);
                resolve(result);
            });
        });
    });
};

// async function get_dbs() {
//     var con = await connect_aws()

//     return new Promise((resolve, reject) => {
//         con.connect(function (err) {
//             if (err) reject(err)

//             var sql = `SELECT name FROM master.sys.databases`;
//             con.query(sql, function (err, result) {
//                 con.end();
//                 if (err) reject(err);
//                 resolve(result);
//             });
//         });
//     });
// };


//Same heres
async function check_pi(pi) {
    var con = await connect_db(pi);

    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) reject(err);
            console.log("Connected!");

            var sql = `SHOW TABLES`;
            con.query(sql, function (err, result) {
                con.end();
                if (err) reject(err);
                resolve(result);
            });
        });
    });

};

async function main() {
    // console.log(await get_users())

    // await create_user_db("luke")

    // await delete_table("pi_id","pi_info")
    // await pi_id_table()
    // await create_pi("pi2", "1234")
    // await create_pi("pi3", "1234")
    // await create_pi("pi4", "1234")
    // console.log(await check_pi("luke"))
    // console.log(await get_pi())

    // set_pi_plant("pi1", "1234", "Basil", "Basil","luke")

    // await create_user_db("luke")
    // await create_pi_id_db()

    // await set_pi_plant("pi2", "1234", null, null, null) 
}
// main()

async function plant_type(pi) {
    var con = await connect_db('pi_id');

    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) reject(err);
            console.log("Connected!");

            var sql = `SELECT planttype FROM pi_info WHERE id = "${pi}"`;
            con.query(sql, function (err, result) {
                con.end();
                if (err) reject(err);
                resolve(result);
            });
        });
    });

};

//Same with a plant one
async function get_plants(database_name, pi_id) {
    var con = await connect_db(database_name);

    return new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");

            var sql = `SELECT * FROM ${pi_id} WHERE time = (SELECT MAX(time))`;
            con.query(sql, function (err, result) {
                con.end();
                if (err) reject(err);
                resolve(result);
            });
        });
    })
};

//get_plants("testusername", "pi1");

// This should delete entire database
async function delete_db(database_name) {
    var con = await connect_aws();

    var sql = `DROP DATABASE ${database_name}`;

    await delete_anything(con, sql);
};

async function delete_table(database_name, table_name) {
    var con = await connect_db(database_name);

    var sql = `DROP TABLE ${table_name}`;

    await delete_anything(con, sql);
};

async function delete_items(database_name, table_name, condition) {
    var con = await connect_db(database_name);

    var sql = `DELETE FROM ${table_name} WHERE ${condition}`;

    await delete_anything(con, sql);    
}
//delete_table("testusername", "yo")
//delete_items("testusername", "yo", "moisture = 0")

module.exports = {
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
    delete_items
}
//delete_db("Login")
//delete_db("pi_id")
//create_pi_id_db()
//create_user_db("babs")
//create_pi_id_table()
//create_pi("pi", "pass")
//set_pi_plant("pi", "pass", "basil1", "basil")
//delete_db("testusername")
//create_user("pi", "pass")


/*let jsondata = {
    temperature: 24.16087158203124,
    humidity: 16.75,
    moisture: 0,
    lastmoistured: 123,
    light: { '450': 30, '500': 45, '550': 60, '570': 45, '600': 50, '650': 45 }
}*/

//plant_info("testusername", "yo", jsondata);
