var mysql = require('mysql');

class Database_Top {
    constructor(connection) {
        this.connection = mysql.createConnection({
            host: "plant-db.cxiwggxylha8.us-east-1.rds.amazonaws.com",
            port: 3306,
            user: "ioteam",
            password: "raspberrypi"
        });
    }

    query_aws(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });
    };

    create_db(database_name) {
        var sql = `CREATE DATABASE IF NOT EXISTS ${database_name}`;
        return this.query_db(sql);
    };
};

class Database {
    constructor(database_name) {
        this.connection = mysql.createConnection({
            host: "plant-db.cxiwggxylha8.us-east-1.rds.amazonaws.com",
            port: 3306,
            user: "ioteam",
            password: "raspberrypi",
            database: database_name
        })
    }

    query_db(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, function (err, result) {
                if (err) reject(err);
                resolve(result);
                console.log(result);
            });
            this.connection.end();
        });
    };

}

async function create_login_db() {
    const log_db = new Database_Top();
    return await log_db.create_db("Login");
}

async function create_pi_db() {
    const pi_db = new Database_Top();
    return await pi_db.create_db("pi_id");
}

async function create_plant_db(database_name) {
    const plant_db = new Database_Top();
    return await plant_db.create_db(database_name);
}

async function create_login_table() {
    const login = new Database('Login');
    var sql = `CREATE TABLE IF NOT EXISTS Users (user VARCHAR(128) NOT NULL, pass VARCHAR(128) NOT NULL)`;
    return await login.query_db(sql);
};

async function create_pi_table() {
    const pi = new Database('pi_id')
    var sql = `CREATE TABLE IF NOT EXISTS pi_info (id VARCHAR(128) NOT NULL, pass VARCHAR(128) NOT NULL, plantname VARCHAR(128), planttype VARCHAR(128), username VARCHAR(128))`;
    return await pi.query_db(sql);
};

async function create_plant_table(database_name, pi_id) {
    const plant = new Database(database_name);
    var sql = `CREATE TABLE IF NOT EXISTS ${pi_id} (temperature FLOAT NOT NULL, humidity FLOAT NOT NULL, lastmoistured FLOAT NOT NULL, moisture FLOAT NOT NULL, light450 FLOAT NOT NULL, light500 FLOAT NOT NULL, light550 FLOAT NOT NULL, light570 FLOAT NOT NULL, light600 FLOAT NOT NULL, light650 FLOAT NOT NULL, time TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`;
    return await plant.query_db(sql);
};

async function add_user(username, pass) {
    const user = new Database('Login');
    var sql = `INSERT INTO Users (user, pass) VALUES ("${username}", "${pass}")`;
    return await user.query_db(sql);
};

async function add_pi(pi, pass) {
    var device = new Database('pi_id');
    var sql = `INSERT INTO pi_info (id, pass, plantname, planttype, username) VALUES ("${pi}", "${pass}", NULL, NULL, NULL)`;
    return await device.query_db(sql);
};

async function set_plant(pi, pass, plantname, planttype, username) {
    var plant = new Database('pi_id');
    var sql = `UPDATE pi_info SET plantname="${plantname}", planttype="${planttype}", username="${username}" WHERE id="${pi}" AND pass="${pass}"`;
    return await plant.query_db(sql);
}

async function add_plant_info(database_name, pi_id, jsondata) {
    var info = new Database(database_name);
    var sql = `INSERT INTO ${pi_id} (temperature, humidity, lastmoistured, moisture, light450, light500, light550, light570, light600, light650, time) VALUES (${jsondata.temperature}, ${jsondata.humidity}, ${jsondata.last_moistured}, ${jsondata.moisture}, ${jsondata.light['450']}, ${jsondata.light['500']}, ${jsondata.light['550']}, ${jsondata.light['570']}, ${jsondata.light['600']}, ${jsondata.light['650']}, CURRENT_TIMESTAMP())`;
    return await info.query_db(sql)
};

async function get_users() {
    var users = new Database('Login');
    var sql = `SELECT user, pass FROM Users`;
    return await users.query_db(sql);
}

async function get_pis() {
    var pis = new Database('pi_id');
    var sql = `SELECT id, pass, plantname, planttype, username FROM pi_info`;
    return await pis.query_db(sql);
}

async function get_plants(pi_id) {
    var device = new Database(pi_id);
    var sql = `SHOW TABLES`;
    return await device.query_db(sql);
}

async function plant_type(pi_id) {
    var type = new Database("pi_id");
    var sql = `SELECT planttype FROM pi_info WHERE id = "${pi_id}"`;
    return await type.query_db(sql);
}

async function recent_data(database_name, pi_id) {
    var data = new Database(database_name);
    var sql = `SELECT * FROM ${pi_id} WHERE time = (SELECT MAX(time))`;
    return await data.query_db(sql);
}

async function delete_db(database_name) {
    var db = new Database_Top();
    var sql = `DROP DATABASE ${database_name}`;
    return await db.query_db(sql);
}

async function delete_table(database_name, table_name) {
    var db = new Database(database_name);
    var sql = `DROP TABLE ${table_name}`;
    return await db.query_db(sql);
}

async function delete_items(database_name, table_name, condition) {
    var db = new Database(database_name);
    var sql = `DELETE FROM ${table_name} WHERE ${condition}`;
    return await db.query_db(sql);
}

module.exports = {
    create_login_db,
    create_pi_db,
    create_plant_db,
    create_login_table,
    create_pi_table,
    create_plant_table,
    add_user,
    add_pi,
    set_plant,
    add_plant_info,
    get_users,
    get_pis,
    get_plants,
    plant_type,
    recent_data,
    delete_db,
    delete_table,
    delete_items
}