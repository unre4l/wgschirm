const axios = require('axios');

class Notifier {
  constructor(config) {
    this.config = config;
  }

  buildUrl(number, msg) {
    const { user, secret, type } = this.config;
    const alias = 'wgschirm';
    const debug = 0;
    const details = 1;
    return `https://gateway.sms77.io/api/sms?u=${user}&p=${secret}&to=${number}&text=${msg}&from=${alias}&=return_msg_id=1&label=${user}&debug=${debug}&type=${type}&details=${details}`;
  }

  send(identifier, message) {
    console.log('send sms');
    console.log(`${identifier} <-> ${message}`);
    axios.get(this.buildUrl(identifier, message));
  }
}

module.exports = Notifier
