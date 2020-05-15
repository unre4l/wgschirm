const path = require('path');
const fs = require('fs');
const Cache = require('./Cache');

const TWO_DAYS = 2*24*60*60;

class Wgschirm {
  constructor() {
    this.connections = {};
    this.modules = {};
    this.cache = new Cache();

    this.observe = {
      drainEvents: 0,
    }
  }

  observedDrainEvent(){
    this.observe.drainEvents += 1;
  }

  removeConnection(key) {
    delete this.connections[key];

    if(Object.keys(this.connections).length === 0){
      this.pauseModules();
    }
  }

  addConnection(con) {
    this.connections[con.wgschirm.id] = con;
    this.notifiy(con.wgschirm.id);

    if(Object.keys(this.connections).length === 1){
      this.continueModules();
    }
  }

  continueModules(){
    Object.values(this.modules).forEach(module => module.continue());
    console.log('continue modules');
  }

  pauseModules(){
    Object.values(this.modules).forEach(module => module.pause());
    console.log('pause modules');
  }

  notifiyAll(type, data, lifetime) {
    try{
      if(type === 'Obersver'){
        Object.entries(this.connections).forEach(([key, con]) => {
          data['connection-uptime'] = this.getConUptime(key);
          con.sse(type, JSON.stringify(data));
        });
      }else{
        const dataAsString = JSON.stringify(data).replace(/\\n/g, '');
        this.cache.setex(type, lifetime, dataAsString);
        this.cache.incr(`${this.getTodayCounterPrefix()}${type}`);
        Object.entries(this.connections).forEach(([key, con]) => {
          con.sse(type, dataAsString);
        });
      }
    }catch(error){
      console.log(error);
      console.log("data")
      console.log(data);
    }
  }

  notifiy(key) {
    Object.values(this.modules).forEach(async module => {
      let data = null;
      try{
        const type = module.name;

        if(type !== 'Obersver'){
          data = await this.cache.get(type);
          if(data){
            this.connections[key].sse(type, data, 1000);
            return;
          }
        }

        data = await module.preparePublish();
        if(type === 'Obersver'){
          data['connection-uptime'] = this.getConUptime(key);
          this.connections[key].sse(type, JSON.stringify(data));
        }else{
          const dataAsString = JSON.stringify(data).replace(/\\n/g, '');
          this.cache.setex(type, module.getDataLifetime(), dataAsString);
          this.cache.incr(`${this.getTodayCounterPrefix()}${type}`);
          if(Object.prototype.hasOwnProperty.call(this.connections[key], 'sse')){
            this.connections[key].sse(type, dataAsString);
          }
        }
      }catch(error){
        console.log(error);
      }
    });
  }

  getConUptime(key){
   const seconds = Math.floor((new Date().getTime() - this.connections[key].wgschirm.time)/1000);
   return `${seconds}s`;
  }

  async getApiCalls(){
    const calls = {};

    await Promise.all(Object.keys(this.modules).map(async module => {
      if(module === 'Observer' || module === 'Cleaning'){
        return false; // no pretty i know
      }

      const today = await this.cache.get(`${this.getTodayCounterPrefix()}${module}`);;
      const yesterday = await this.cache.get(`${this.getYesterdayCounterPrefix()}${module}`);;

      const ModuleAsKey = module.replace(/^\w/, c => c.toLocaleLowerCase());
      return calls[`${ModuleAsKey}-calls`] = [today, yesterday];
    }));

    return calls;
  }

  loadModules(modules){
    this.loadObserver();

    Object.entries(modules).forEach(([module, config]) => {
      const modulePath = path.resolve(`modules/${module}.js`);

      if(fs.statSync(modulePath).isFile()){
        this.modules[module] = new (require(modulePath))(config, this.notifiyAll.bind(this));
        this.modules[module].start();

        this.cache.setex(`${this.getTodayCounterPrefix()}${module}`, TWO_DAYS, 0);
        console.log(`load ${module} module`);
      }
    });
  }

  loadObserver(){
    this.modules.Observer = new (require(path.resolve(`modules/Observer.js`)))({interval: 7}, this.notifiyAll.bind(this), this);
    this.modules.Observer.start();
  }

  getTodayCounterPrefix(){
    const day = new Date().getDay();
    return `ApiCnt${day}$`
  }

  getYesterdayCounterPrefix(){
    const d = new Date();
    const day = new Date(d.setDate(d.getDate() - 1)).getDay();
    return `ApiCnt${day}$`
  }
}

module.exports = Wgschirm;
