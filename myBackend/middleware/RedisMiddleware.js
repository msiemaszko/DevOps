const redis = require("redis");

RedisMiddleware = function(redisHOST, redisPORT) {

    redisClient = redis.createClient({
        host: redisHOST,
        port: redisPORT,
        // retry_strategy: () => 1000 // co ile ma ponawiać...
    });
    
    redisClient
        .on('connect', () => {
            console.log(`Connected to Redis server at ${redisHOST}:${redisPORT}`);
        })
        .on('error', (err) => {
            console.log("Error " + err);
        })

    this.getQueryCache = function(key, next) {
        redisClient.get(/* 'postgres:' + */ key, function (err, result) {
            // console.log('error:', err, 'result:', result);
            if (err || !result) return next(err);
            return next(null, JSON.parse(result));
        });
    }

    this.setQueryCache = function (key, ttl, data, next) {
        redisClient.setex(/* 'postgres:' + */ key, ttl, JSON.stringify(data), function (err, result) {
            if (err || !result) return next(err);
            return next(null, result);
        });
    }
}

module.exports = RedisMiddleware