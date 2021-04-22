const { Pool } = require('pg');
const postgresHOST = process.env.PG_HOST;
const postgresPORT = process.env.PG_PORT;

PostgresMiddleware = function() {
    
    const connData = {
        host: postgresHOST,
        port: postgresPORT,
        database: process.env.PG_DB,
        user: process.env.PG_USER,
        password: process.env.PG_PASS
    };

    const sqlCreate = `
        CREATE TABLE IF NOT EXISTS computers (
            id SERIAL,
            type varchar, 
            name varchar, 
            CONSTRAINT computers_pk PRIMARY KEY(id)
        )`;

    
    const pgQuery = (sqlText, parametrs, callbackFunc) => {
        // przy każym zapytaniu nowe połączenie - czy to dobre rozwiazanie?
        let clinet = new Pool(connData);
        clinet
            .connect()
            // .then(() => console.log(`Connected to Postgres server at ${postgresHOST}:${postgresPORT}`))
            .then(() => clinet.query(sqlText, parametrs, (error, result) => {
                if (error) {
                    throw error
                }
                callbackFunc(null, result);
            }))
            .catch(e => console.log(e))
            .finally(() => clinet.end())
    }

    // Create DB if not exists.
    pgQuery(sqlCreate, [], () => {
        console.log(`Connected to Postgres server at ${postgresHOST}:${postgresPORT}`)
    })

    this.getRows = function(tableName, callbackFunc) {
        pgQuery(`SELECT * FROM ${tableName} ORDER BY 1`, [],
            (error, result) => callbackFunc(error, result.rows)
        );
    }

    this.getRowById = function (tableName, id, callbackFunc) {
        pgQuery(`SELECT * FROM ${tableName} WHERE id = $1`, [id],
            (error, result) => callbackFunc(error, result.rows[0])
        );
    }

    this.insertRow = function(tableName, entObject, callbackFunc) {
        let keyValueJson = jsonToKeyValueString(entObject);
        let sqlText = `INSERT INTO ${tableName} (${keyValueJson['keys']}) VALUES (${keyValueJson['values']}) RETURNING id`;
        pgQuery(sqlText, [], 
            (error, result) => callbackFunc(error, result.rows[0])
        );
    }

    this.deleteRow = function(tableName, rowId, callbackFunc) {
        pgQuery(`DELETE FROM ${tableName} WHERE id = $1`, [rowId],
            (error, result) => callbackFunc(error, result.rows[0])
        );
    }

    this.updateRow = function (tableName, entObject, callbackFunc) {
        const sqlText = `UPDATE ${tableName} SET type = $1, name = $2 WHERE id = $3`;
        pgQuery(sqlText, [entObject.type, entObject.name, entObject.id],
            (error, result) => callbackFunc(error, result.rows[0])
        );
    }
    
    const jsonToKeyValueString = jsonObject => {
        let keys = '';
        let values = '';
        for (let key in jsonObject) {
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