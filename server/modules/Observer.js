const WgschirmModule = require('../WgschirmModule');
const axios = require('axios');

class Observer extends WgschirmModule {
    constructor(config, notifiyFunc, wgschirm) {
        super(config, notifiyFunc);

        this.name = 'Obersver';
        this.wgschirm = wgschirm;
      }

      async preparePublish() {
        const calls = await this.wgschirm.getApiCalls();
        return {
          connections: Object.keys(this.wgschirm.connections).length,
          'server-uptime': `${parseInt(process.uptime())}s`,
          'drain-events': this.wgschirm.observe.drainEvents,
          ...calls
        };
    }
}

module.exports = Observer
