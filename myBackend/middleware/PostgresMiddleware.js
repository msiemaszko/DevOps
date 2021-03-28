const { Client } = require("pg");

PostgresMiddleware = function (postgresHOST, postgresPORT) {

    // create Pool/Client
    pgClient = new Client({
        user: "postgres",
        password: "1qaz2wsx",
        database: "postgres",
        host: postgresHOST,
        port: postgresPORT
    });

    // init connection
    // pgClient
    //     .on('connect', () => {
    //         console.log(`Connected to Postgres server at ${postgresHOST}:${postgresPORT}`);

    //     })
    //     .on('error', () => {
    //         console.log('Postgres not connected');
    //     })

    //     .query(`
    //         CREATE TABLE IF NOT EXISTS computers (
    //             id SERIAL,
    //             type varchar, 
    //             name varchar, 
    //             CONSTRAINT computers_pk PRIMARY KEY(id)
    //         )`
    //     )

    //     .catch((err) => {
    //         console.log(err);
    //     })
    //     ;

    let sqlCreate = `
        CREATE TABLE IF NOT EXISTS computers (
            id SERIAL,
            type varchar, 
            name varchar, 
            CONSTRAINT computers_pk PRIMARY KEY(id)
        )`;
    
    pgClient
        .connect()
        .then(() => console.log(`Connected to Postgres server at ${postgresHOST}:${postgresPORT}`))
        .then(() => pgClient.query(sqlCreate))
        .catch(e => console.log(e))
    //     .finally(() => pgClient.end())


    function pgQuery(sqlText, parametrs, callbackFunc) {
        pgClient.query(sqlText, parametrs, (error, result) => {
            if (error) {
                throw error
            }
            callbackFunc(null, result);
        });
    }

    this.getRowById = function (tableName, id, callbackFunc) {
        pgQuery(`SELECT * FROM ${tableName} WHERE id = $1`, [id],
            (error, result) => callbackFunc(error, result.rows[0])
        );
    }

    this.getRows = function (tableName, callbackFunc) {
        pgQuery(`SELECT * FROM ${tableName}`, [],
            (error, result) => callbackFunc(error, result.rows)
        );
    }

    this.insertRow = function (tableName, entObject, callbackFunc) {
        let keyValueJson = jsonToKeyValueString(entObject);
        let sqlText = `INSERT INTO ${tableName} (${keyValueJson['keys']}) VALUES (${keyValueJson['values']}) RETURNING id`;
        pgQuery(sqlText, [],
            (error, result) => callbackFunc(error, result.rows[0])
        );
    }

    function jsonToKeyValueString(jsonObject) {
        var keys = '';
        var values = '';
        for (var key in jsonObject) {
            keys += `${key},`;
            values += `'${jsonObject[key]}',`;
        }
        return {
            "keys": keys.slice(0, -1),
            "values": values.slice(0, -1)
        }
    }
}

module.exports = PostgresMiddleware;