const redisPath = process.env.NODE_ENV === 'production' ? 'redis' : 'redis-mock';
const redis = require(redisPath);
const {promisify} = require('util');

class Cache {
  constructor() {
    this.redis = redis.createClient();

    this.get = promisify(this.redis.get).bind(this.redis);
    this.setex = promisify(this.redis.setex).bind(this.redis);
    this.incr = promisify(this.redis.incr).bind(this.redis);
    this.incr = promisify(this.redis.incr).bind(this.redis);
  }
}

module.exports = Cache;
