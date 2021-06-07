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
        CREATE TABLE IF NOT EXISTS test (
            id SERIAL,
            uuid varchar
        )`;

    
    this.pgQuery = (sqlText, parametrs, callbackFunc) => {
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
    this.pgQuery(sqlCreate, [], () => {
        console.log(`Connected to Postgres server at ${postgresHOST}:${postgresPORT}`)
    })
}

module.exports = PostgresMiddleware;