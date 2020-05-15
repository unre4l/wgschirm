// const influx = require('./influx.js')
const Cron = require('cron').CronJob;

const SECOND = 1000;
const TIMEZONE = 'Europe/Berlin';

class WgschirmModule {
  constructor(config, notifyFunc) {
    this.config = config;
    this.notfiy = notifyFunc;

    this.timer = null;
    this.scheduler = null;

    this.timezone = TIMEZONE;
    this.dontPublish = true;
  }

  pause(){
    this.dontPublish = true;
  }

  continue(){
    this.dontPublish = false;
  }

  start() {
    this.stop();

    if(this.config.schedule && this.config.interval){
      return;
    }

    if(this.config.schedule){
      this.scheduler = new Cron(this.config.schedule, this.publish(), null, true, TIMEZONE);
    }

    if(this.config.interval){
      this.timer = setInterval(() => this.publish(), this.config.interval * SECOND);
    }
  }

  getDataLifetime(){
    let lifetime = null;
    if(this.config.interval){
      lifetime = this.config.interval;

    }else{
      const diff = new Date(this.scheduler.nextDates()).getTime() - new Date().getTime();
      lifetime = Math.floor(diff / 1000);
    }

    return lifetime;
  }

  publish() {
    console.log(`${this.name} publish: ${this.dontPublish}`);

    if(this.dontPublish){
      return;
    }

    this.preparePublish().then(data => {
      this.notfiy(this.name, data, this.getDataLifetime());
    }).catch(error => {
      console.log(`${this.name} Error: ${error}`);
    });
  }

  async preparePublish() {
    throw new Error('no preparePublish method implemented!');
  }

  stop() {
    if(this.timer) {
      clearInterval(this.timer);
    }

    if(this.scheduler) {
      this.scheduler.stop();
    }
  }
}

module.exports = WgschirmModule
