const PostgresMiddleware = require('./PostgresMiddleware');
const RedisMiddleware = require('./RedisMiddleware');

DbMiddleware = function (HOST_PORTS) 
{
    let pgClient = new PostgresMiddleware(HOST_PORTS['POSTGRES']['HOST'], HOST_PORTS['POSTGRES']['PORT']);
    let redisClient = new RedisMiddleware(HOST_PORTS['REDIS']['HOST'], HOST_PORTS['REDIS']['PORT']);
    // console.log('DB Middleware Loaded.');

    let keySufix = 'computer';
    let ttl = 5 * 60 * 100;

    this.getComputers = function (callbackFunc) {
        pgClient.getRows('computers', callbackFunc);
    }

    this.getComputer = function(id, callbackFunc) {
        let key = `${keySufix}:${id}`;
        redisClient.getQueryCache(key, (error, result) => {
            if (error || !result) 
            {   // jeżeli nie znalazło wartości w cache
                pgClient.getRowById('computers', id, callbackFunc);
                console.log(`Odczytano z Postgres: ${key}`);
            }
            else {
                console.log(`Odczytano z Redis: ${key}`);
                return callbackFunc(error, result);
            }
        });
    }
    

    this.putComputer = function (entObject, callbackFunc) 
    {
        // insert into postgresss
        pgClient.insertRow('computers', entObject,
            (error, result) => {
                
                let key = `${keySufix}:${result.id}`;
                console.log(`Dodano do Postgres: ${key}`);
                
                // add the generated id
                let entObjectWithID = {
                    'id': result.id,
                    ...entObject
                }

                // insert into redist
                redisClient.setQueryCache(key, ttl, entObjectWithID,
                    () => callbackFunc(error, result) // passed callBack function with postgres result
                );
                console.log(`Dodano do Redis: ${key}`);
            }
        )
    }
}

module.exports = DbMiddleware