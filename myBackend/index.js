const express = require('express');
const cors = require('cors');

const API_PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json()); 

const DbMiddleware = require('./middleware/DbMiddleware');
const myDb = new DbMiddleware();


// === API 
app.listen(API_PORT, () => {
    console.log(`API listening on port ${API_PORT}`);
});


// API GET: /hello
app.get('/hello', (request, respose) => {
    respose
        .status(200).send('Hello World!');
});


// API GET: /computer - pobierz wszystkie komputery
app.get('/computer', (request, response) => {
    console.log(`\nRequest from ${getUserFromRequest(request)} - GET (All):`);
    
    myDb.getComputers((error, rows) => {
        if (!error) {
            // console.table(rows);
            console.log(`Returned ${rows.length} rows.`);
            response.status(200).json(rows);
        } else 
            response.status(500).send('something went wrong while getting computers list...');
    })
});


// API GET: /computer/id - pobierz konkretny komputer (id)
app.get('/computer/:id', (request, response) => {

    const id = parseInt(request.params.id);
    console.log(`\nRequest from ${getUserFromRequest(request)} - GET (id: ${id})`);
    
    myDb.getComputer(id, (error, result) => {
        if (result && !error)
            response.status(200).json(result);
        else
            response.status(500).send(`something went wrong while getting computer: ${id}`);
    });
});


// API POST: /computer - dodaj nowy komputer (object)
app.post('/computer', (request, respose) => {
    
    console.log(`\nRequest from ${getUserFromRequest(request)} - POST (Create)`);
    console.log(request.body);
    const newComputer = {
        'type' : request.body.type,
        'name' : request.body.name
    }

    myDb.createComputer(newComputer, (error, result) => {
        if (!error && result) {
            // wyciągnij dodany obiekt i odeślij go w odpowiedzi
            myDb.getComputer(result.id, (getError, getResult) => {
                const restResponse = {
                    status: 'success',
                    data: getResult
                }
                if (!getError) respose.status(200).json(restResponse);
                else
                    respose.status(500).send('creation successful, but cant send back a new computer.');
            });
        }
        else
            response.status(500).send('something went wrong while creating a new computer...');
    });
});


// API DELETE: /computer/id - usuń konkretny komputer (id)
app.delete('/computer/:id', (request, response) => {

    const id = parseInt(request.params.id);
    console.log(`\nRequest from ${getUserFromRequest(request)} - DELETE (id: ${id})`);

    myDb.deleteComputer(id, (error, result) => {
        if (!error) response.status(200).send('ok');
        else
            response.status(500).send(`something went wrong while deleting computer id ${id}`);
    });
});


// API PUT: /computer - aktualizuj konkretny komputer (object)
app.put('/computer', (request, response) => {
    
    const computerEnt = request.body;
    console.log(`\nRequest from ${getUserFromRequest(request)} - PUT (id: ${computerEnt.id})`);

    myDb.updateComputer(computerEnt, (error, result) => {
        if (!error) response.status(200).send('ok');
        else
            response.status(404).send(`something went wrong while updating computer: ${computerEnt.id}`);
        // TODO: errorcode!
    });
});

const getUserFromRequest = request => { return request.headers['user-agent'].substring(0, 11); }