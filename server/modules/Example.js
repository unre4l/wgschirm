const WgschirmModule = require('../WgschirmModule');

class Example extends WgschirmModule {
    constructor(config, notifiyFunc) {
        super(config, notifiyFunc);

        this.name = 'Example';
    }

    async preparePublish() {
      return {
        meta: {
          timestamp: new Date().getTime(),
        },
        body: 'Hello from Example!',
      };
    }
}

module.exports = Example
