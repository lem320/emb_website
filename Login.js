var mysql = require('mysql');

// Connecting to aws without specific database
function connect_aws() {
    var con = mysql.createConnection({
        host: "plant-sql-db.cxiwggxylha8.us-east-1.rds.amazonaws.com",
        port: 3306,
        user: "admin",
        password: "password"
    });
    return con;
};

// Connecting to aws with specific database
function connect_db(database_name) {
    var con = mysql.createConnection({
        host: "plant-sql-db.cxiwggxylha8.us-east-1.rds.amazonaws.com",
        port: 3306,
        user: "admin",
        password: "password",
        database: database_name
    });
    return con;
};

function create_db(con, database_name) {
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `CREATE DATABASE IF NOT EXISTS ${database_name}`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Database Created");
        });
        con.end();
    });
};

function create_table(con, sql) {
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table Created");
        });
        con.end();
    });
};

function insert_table(con, sql) {
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table Created");
        });
        con.end();
    });
};

function delete_anything(con, sql) {
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Deleted");
        });
        con.end();
    });
}

//--------------------------------------------------
//Database Creations

//Login in database -> fixed name
function create_user_db() {
    var con = connect_aws();

    create_db(con, 'Login');

};

//Pi info database -> fixed name
function create_pi_id_db() {
    var con = connect_aws();

    create_db(con, 'pi_id');
};

//Plant database -> variable name
function create_plant_db(database_name) {
    var con = connect_aws();

    create_db(con, database_name)
};


//----------------------------------------

//Database Tables

//Login Table -> struct {user, password}
function create_login_table() {
    var con = connect_db('Login');

    var sql = `CREATE TABLE IF NOT EXISTS Users (user VARCHAR(128) NOT NULL, pass VARCHAR(128) NOT NULL)`;

    create_table(con, sql);
};

// Pi info table -> struct {pi_id, password}

function create_pi_id_table() {
    var con = connect_db('pi_id');

    var sql = `CREATE TABLE IF NOT EXISTS pi_info (id VARCHAR(128) NOT NULL, pass VARCHAR(128) NOT NULL)`;

    create_table(con, sql);
};

// Plant info table -> struct {temp, hum, mois, l1, l2, l3, l4, l5, l6}

function create_plant_table(database_name, pi_id) {
    var con = connect_db(database_name);

    var sql = `CREATE TABLE IF NOT EXISTS ${pi_id} (temperature FLOAT NOT NULL, humidity FLOAT NOT NULL, moisture FLOAT NOT NULL, light450 FLOAT NOT NULL, light500 FLOAT NOT NULL, light550 FLOAT NOT NULL, light570 FLOAT NOT NULL, light600 FLOAT NOT NULL, light650 FLOAT NOT NULL, time TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`;

    create_table(con, sql);
};

//-----------------------------------------------

// Adding new "users" to the databases

// New login -> pass in the chosen username and password

function create_user(user, pass) {
    var con = connect_db('Login');

    var sql = `INSERT INTO Users (user, pass) VALUES ("${user}", "${pass}")`;

    insert_table(con, sql);
};

// Pi id -> pass in pi id and password

function create_pi(pi, pass) {
    var con = connect_db('pi_id');

    var sql = `INSERT INTO Users (id, pass) VALUES ("${pi}", "${pass}")`;

    insert_table(con, sql);
};

//Need to change the inputs depending on how to send in to function
// database = username, pi_id = pi_id, rest = values

function plant_info(database_name, pi_id, tempval, humval, moisval, l450, l500, l550, l570, l600, l650) {
    var con = connect_db(database_name);

    var sql = `INSERT INTO ${pi_id} (temperature, humidity, moisture, light450, light500, light550, light570, light600, light650, time) VALUES (${tempval}, ${humval}, ${moisval}, ${l450}, ${l500}, ${l550}, ${l570}, ${l600}, ${l650}, CURRENT_TIMESTAMP())`;

    insert_table(con, sql)
};

//---------------------------------------

// THis need to be adjusted to be able to get the result from the select query and neatening
function check_login(user, pass) {
    var con = connect_db('Login');

    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `SELECT * FROM Users WHERE user='${user}'`;
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        con.end();
    });
};

//Same here
function check_pi(pi, pass) {
    var con = connect_db('pi_id');

    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `SELECT * FROM Users WHERE user='${pi}'`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            return result
        });
        con.end();
    });

};

//Same with a plant one



// This should delete entire database
function delete_db(database_name) {
    var con = connect_aws();

    var sql = `DROP DATABASE ${database_name}`;

    delete_anything(con, sql);
};

function delete_db(database_name, table_name) {
    var con = connect_db(database_name);

    var sql = `DROP TABLE ${table_name}`;

    delete_anything(con, sql);
};

function delete_items(database_name, table_name, condition) {
    var con = connect_db(database_name);

    var sql = `DELETE FROM ${table_name} WHERE ${condition}`;

    delete_anything(con, sql);
}