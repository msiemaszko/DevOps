
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cors = require('cors');
const PostgresMiddleware = require('./middleware/PostgresMiddleware');

const appPort = 5000;
const app = express();
app.use(cors());
app.use(express.json());

const appId = uuidv4();
const pgClient = new PostgresMiddleware();


app.get('/hello', (request, respose) => {
    respose
        .status(200).send('Hello World!');
});

app.get('/api', (request, response) => {

    pgClient.pgQuery("SELECT * FROM test", [], (error, selectResult) => {
        response.json(selectResult.rows).status(200);
    })

    pgClient.pgQuery(`INSERT INTO test (uuid) VALUES ('${appId}')`, [], () => { });

})

app.listen(appPort, err => {
    console.log(`App listening on port ${appPort}`);
});