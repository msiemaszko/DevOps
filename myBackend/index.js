const express = require("express");
const redis = require("redis");
const cors = require("cors");
// const bodyParser = require("body-parser"); - body parser już jest wbudowany  w expressa

const PORT = 5000;
const app = express()

app.use(cors());
app.use(express.json());

// === Redist
const redisClient = redis.createClient({
    host: "myredis",
    port: 6379,
    // retry_strategy: () => 1000 // co ile ma ponawiać...
})

redisClient
    .on('connect', () => {
        console.log('Connected to Redis server');
})


// === Postgres
const { Pool } = require('pg');
const pgClient = new Pool({
    user: "postgres",
    password: "1qaz2wsx",
    database: "postgres",
    host: "mypostgres",
    port: 5432
});

pgClient
    .on('connect', () => {
        console.log('Connected to Postgres server');
        
    })
    .on('error', () => {
        console.log('Postgres not connected');
    })
;

pgClient
    .query('CREATE TABLE IF NOT EXISTS numbers (number INT)')
    .catch( (err) => {
        console.log(err);
    })
;


// === API
app.get("/", (request, respose) => {
    respose.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
})

// // definiowanie endPointu
// app.get('/hello', (req, res) => {
//     res.send("Hello World from express server")
// });