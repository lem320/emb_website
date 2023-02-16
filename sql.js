var mysql = require('mysql');

class Database {
    constructor(connection) {
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
