const WgschirmModule = require('../WgschirmModule');
const Cron = require('cron').CronJob;
const moment = require('moment');
const Alea = require('alea');

const SCHEDULE_NOTIFY = '10 10 * * 0'; // jeden Sonntag um 10:10

class Cleaning extends WgschirmModule {
  constructor(config, notifiyFunc) {
    super(config, notifiyFunc);
    this.name = 'Cleaning';
    this.data = null;
    this.notifier = null;

    if(config.notifier){
      const Notifier = require(`../utils/${config.notifier.name}`);
      this.notifier = new Notifier(config.notifier);
      this.notifyCron = new Cron(SCHEDULE_NOTIFY, this.sendNotification, null, true, 'Europe/Berlin', this);
      console.log('notifier starten');
      console.log(this.notifier);
      console.log(new Date(this.notifyCron.nextDates()));
    }
  }
  start(){
    super.start();
    this.updateSchedules();
  }

  stop(){
    super.stop();
    // this.notifyCron.stop();
  }

  sendNotification(send = true){
    if(!this.notifier){
      console.log('notifier nit initialisiert');
      return;
    }
    console.log(`notifier ist da`);

    this.updateSchedules();
    let schedule = Object.values(this.data.body.schedules).find(schedule => schedule.active);
    delete schedule.active;

    Object.entries(schedule).forEach(([task, name]) => {
      const identifier = this.config.workforce[name]; // identifier == Phonenumber

      let message = `Hello ${name}, kleiner Reminder: Heute ist dein letzter Tag `;
      if(task === 'Müll'){
        message += `um den Müll wegzubringen. `;
      }else if(task === 'Bad'){
        message += `um das Bad putzen. `;
      }else{
        message += `um die Küche putzen. `;
      }
      message += `Schaue auf den Plan, was nächste Woche ansteht :)`;

      if(send){
        this.notifier.send(identifier, message);
      }
    })
  }

  updateSchedules(){
    console.log('----------------------------------------------------------------');
    console.log(this.config.workforce);
    this.data = {
      meta: {
        nextTick: this.scheduler ? new Date(this.scheduler.nextDates()).getTime() : 'not startet',
      },
      body: this.getSchedulesForCurrentSeed(),
    };
  }

  getKnownSchedule(seed, mutation) {
    const { tasks, workforce } = this.config;
    let names = Object.keys(workforce);
    const prng = new Alea(seed);
    let j, x, i;
    for (i = names.length - 1; i > 0; i--) {
        j = Math.floor(prng() * (i+1));
        x = names[i];
        names[i] = names[j];
        names[j] = x;
    }

    const data = {};
    tasks.forEach((task, i) => {
      let index = (mutation + i) % names.length;
      data[task] = names[index]
    })

    return data;
  }

  getSchedulesForCurrentSeed() {
    const { tasks, workforce, duration } = this.config;
    let names = Object.keys(workforce);
    const week = moment(new Date()).startOf('isoWeek').diff([1970, 1, 1], 'weeks');
    const mutation = (Math.floor(week / duration) % names.length);
    const seed = Math.floor(week / (names.length * duration));

    const data = {
      mutation,
      seed,
      schedules: {},
      previous: this.getKnownSchedule(seed-1, 3),
    };

    let k = mutation;
    for (let i = 0; i < names.length; i++) {
      const m = (mutation+i)%names.length
      data.schedules[m] = this.getKnownSchedule(seed, m);
      data.schedules[m].active = m === mutation;
    }

    return data;
  }

  async preparePublish() {
    this.updateSchedules();
    return this.data;
  }
}

module.exports = Cleaning
