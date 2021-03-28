const express = require("express");
const cors = require("cors");

const HOST_PORTS = {
    'API': {
        'PORT' : 5000
    },
    'REDIS' : {
        // 'HOST': 'localhost',
        'HOST': 'myredis',
        'PORT': 6379
    },
    'POSTGRES': {
        // 'HOST': 'localhost',
        'HOST': 'mypostgres',
        'PORT': 5432
    }
}

const app = express()
app.use(cors());
app.use(express.json());

const DbMiddleware = require('./middleware/DbMiddleware');
const myDb = new DbMiddleware(HOST_PORTS);


// === API
app.listen(HOST_PORTS['API']['PORT'], () => {
    console.log(`API listening on port ${HOST_PORTS['API']['PORT']}`);
})


// GET: /hello
app.get("/hello", (request, respose) => {
    respose
        .status(200)
        .send("Hello World!");
});


// GET: /computers - wszystkie komputery
app.get('/computers', (request, response) => {
    console.log(`\nZapytanie od ${request.headers['user-agent']} - FindAll:`);
    
    myDb.getComputers((error, rows) => {
        if (!error) {
            console.table(rows);
            response.status(200).json(rows);
        } else {
            console.log('error:', error, ', result:', result);
            response.status(500).send('Bład pobierania komputerów');
        }
    });
});


// GET: /computers/id - konkretny komputer
app.get('/computers/:id', (request, response) => {
    let id = parseInt(request.params.id);
    console.log(`\nZapytanie od ${request.headers['user-agent']} - Find(id: ${id})`);
    
    myDb.getComputer(id, (error, result) => {
        console.log('error:', error, ', result:', result);
        if (result) {
            response.status(200).json(result);
        } else {
            response.status(500).send("Nie znaleziono komputera o wskazanym ID");
        }
    });
});


// POST: /computer
app.post('/computer', (request, respose) => {
    
    console.log(`\nZapytanie od ${request.headers['user-agent']} - PUT`);
    console.log(request.body);
    let newComputer = {
        'type' : request.body.type,
        'name' : request.body.name
    }

    myDb.putComputer(newComputer, (error, result) => {
        console.log('error:', error, ', result:', result);
        let responsText = `Dodano do bazy komputer, id: ${result.id}`;
        respose.status(200).send(responsText);
    });
});


/*
    // pgClient.getRows('computers',
    //     (rows) => {
    //         console.log(rows);
    //         response.status(200).json(rows);
    // });

    // DBreadAll(pgClient, 'computers', (rows) => {
    //     console.log(rows);
    //     response.status(200).json(rows);
    // })

// app.post('/computer', (request, respose) => {
//         // pgClient.insertRow('computers', newComputer, 
//     //     (result) => {
//     //         let responsText = `Dodano do bazy komputer, id: ${result.id}`;
//     //         console.log(responsText);
//     //         respose.status(200).send(responsText);
//     //     })
// })

const getComputers_ = (request, response) => {
    pgClient.query('SELECT * FROM computers', (error, results) => {
        if (error) {
            throw error
        }
        // console.log("Request:"); console.log(request);
        console.log("Result.rows: "); console.log(results.rows);
        response.status(200).json(results.rows);
    })
}
app.get('/computers_', getComputers_);


// app.get('/computers', (request, response) => {
//     DBreadAll(pgClient, 'computers', (rows) => {
//         console.log(rows);
//         response.status(200).json(rows);
//     })
// });


// function DBreadAll(DBclient, tableName, callback) {
//     DBclient.query(`SELECT * FROM ${tableName}`, (error, result) => {
//         if (error) {
//             throw error
//         }
//         callback(result.rows);
//     })
// }

*/