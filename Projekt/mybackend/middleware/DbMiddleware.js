const PostgresMiddleware = require('./PostgresMiddleware');
const RedisMiddleware = require('./RedisMiddleware');

DbMiddleware = function() 
{
    const pgClient = new PostgresMiddleware();
    const redisClient = new RedisMiddleware();

    const keySufix = 'computer';
    const ttl = 5 * 60 * 100;

    /**
     * Lista wszystkich komputerów
     * @param {function} callbackFunc 
     */
    this.getComputers = (callbackFunc) => {
        pgClient.getRows('computers', callbackFunc);
    }

    /**
     * Zwraca konkretny komputer
     * Pierw sprawdza w Cache, jak nie ma to szuka w PG i umieszcza w Cache
     * @param {int} id computer_id
     * @param {function} callbackFunc
     */
    this.getComputer = (id, callbackFunc) => {
        const key = `${keySufix}:${id}`;
        redisClient.getQueryCache(key, (error, result) => {
            if (error || !result) 
            {   // when cant find obj in Cache
                pgClient.getRowById('computers', id, (pgError, pgResult) => {

                    // store object into Cache
                    if (!pgError)
                        redisClient.setQueryCache(key, ttl, pgResult,
                            () => console.log(`Dodano do Redis: ${key}`)
                        );

                    console.log(`Odczytano z Postgres: ${key}`);
                    callbackFunc(pgError, pgResult);
                });
            }
            else {
                console.log(`Odczytano z Redis: ${key}`);
                return callbackFunc(error, result);
            }
        });
    }
    
    /**
     * Tworzy nowy komputer.
     * Zapisuje encje w PG oraz dodatkowo umieszcza w Cache
     * @param {object} entObject
     * @param {function} callbackFunc 
     */
    this.createComputer = (entObject, callbackFunc) =>
    {
        // insert into postgresss
        pgClient.insertRow('computers', entObject, 
            (pgError, pgResult) => {
                
                const key = `${keySufix}:${pgResult.id}`;
                console.log(`Dodano do Postgres: ${key}`);
                
                // add the generated id
                const entObjectWithID = {
                    'id': pgResult.id,
                    ...entObject
                }

                // insert into Cache
                redisClient.setQueryCache(key, ttl, entObjectWithID,
                    () => {
                        callbackFunc(pgError, pgResult) // passed callBack function with postgres result
                        console.log(`Dodano do Redis: ${key}`);
                    }
                );
        });
    }

    /**
     * Usuwa konkretny komputer - czyszczenie PG i Cache
     * @param {int} id computer_id
     * @param {function} callbackFunc 
     */
    this.deleteComputer = (id, callbackFunc) => {
        
        // cache
        const key = `${keySufix}:${id}`;
        redisClient.removeQueryCache(key, (error, result) => {
            if (result) {
                console.log(`Usunięto z Redis: ${key}`);
            }
        });

        // postgres
        pgClient.deleteRow('computers', id, 
            (error, result) => {
                if (!error)
                    console.log(`Usunięto z Postgres: ${key}`);
                callbackFunc(error, result);
            }
        );
    }

    /**
     * Aktualizuje komputer, usuwa wpis z Cache
     * @param {object} entObject 
     * @param {function} callbackFunc 
     */
    this.updateComputer = (entObject, callbackFunc) => {
        const key = `${keySufix}:${entObject.id}`;
        pgClient.updateRow('computers', entObject, (error, result) => {
            if (!error) {
                console.log(`Zaktualizowano w Postgres: ${key}`);
                
                // remove from Cache
                redisClient.removeQueryCache(key, (error) => {
                    if (!error) console.log(`Usunięto z Redis: ${key}`);
                });
            }
            callbackFunc(error, result);
        });
    }
}

module.exports = DbMiddleware