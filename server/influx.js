
const config = require(process.env.WGSCHIRM_CONFIG);
const Influx = require('influx')
const instance = new Influx.InfluxDB(config.server.influx)
Object.freeze(instance);
module.exports = instance;
