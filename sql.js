var mysql = require('mysql');

class Database {
    constructor(connection, database_name) {
        this.connection = mysql.createConnection(connection);
    }

    connect_database(information) {
        this.connection.connect(information)
    }

    create_db(database_name) {
        return new Promise((resolve, reject) => {
            this.connect_database(function (err) {
                if (err) throw err;
                console.log("Connected!");
                var sql = `CREATE DATABASE IF NOT EXISTS ${database_name}`;
                this.connect_database.query(sql, function (err, result) {
                    this.connect_database.end();
                    if (err) reject(err);
                    console.log("Database Created");
                    resolve(result);
                });

            });
        })
    };


}

//const hi = new Database()

//hi.create_db('whass');

connect_db(database_name) {

    var con = mysql.createConnection({
        host: "plant-db.cxiwggxylha8.us-east-1.rds.amazonaws.com",
        port: 3306,
        user: "ioteam",
        password: "raspberrypi",
        database: database_name
    });
};

connect_db(None);