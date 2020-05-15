const WgschirmModule = require('../WgschirmModule');
const axios = require('axios');

class Coins extends WgschirmModule {
    constructor(config, notifiyFunc) {
        super(config, notifiyFunc);

        this.name = 'Coins';
        this.coins = {
            btceur: 'Bitcoin',
            etheur: 'Etherium',
            xrpeur: 'Ripple',
            ltceur: 'Litecoin',
            bcheur: 'BitcoinCash',
        }
    }

    toUrl(coin) {
      return `https://www.bitstamp.net/api/v2/ticker/${coin}`;
    }

    async preparePublish() {
      const data = {
        meta: {
          timestamp: new Date().getTime(),
        },
        body: {},
      };
      await Promise.all(Object.keys(this.coins).map(async coin => {
        try {
          const response = await axios.get(this.toUrl(coin));
          data.body[coin] = response.data.last;
        }catch(error){
          data.error = `${error.code}: ${error.message}`;
        }
      }));
      return data;
    }
}

module.exports = Coins
