const WgschirmModule = require('../WgschirmModule');
const axios = require('axios');
const _ = require('lodash');

class Weather extends WgschirmModule {
    constructor(config, notifiyFunc) {
        super(config, notifiyFunc);

        this.name = 'Weather';
        this.url = this.toUrl()
        this.filter = ['time', 'temperature', 'precipProbability', 'precipIntensity', 'ozone', 'humidity', 'windSpeed', 'windGust']
    }

    toUrl(){
      let url = `https://api.darksky.net/forecast/${this.config.key}/${this.config.lat},${this.config.lng}?`;
      Object.entries(this.config.options).forEach((entry, i) => {
        url += `${i !== 0 ? '&' : ''}${entry[0]}=${Array.isArray(entry[1]) ? entry[1].join(',') : entry[1] }`
      })
      return url;
    }

    async preparePublish() {
      const data = {
        meta: {
          timestamp: new Date().getTime(),
        },
        body: {},
      };
      try {
          const response = await axios.get(this.url);
          const responseData = response.data.hourly.data.map(item => _.pick(item, this.filter))
          const selectedData = responseData.filter((e,i) => i % 2 === 0).splice(0, 18);
          data.body = {
            labels: selectedData.map(item => item.time * 1000),
            temp: selectedData.map(item => item.temperature),
            rain: selectedData.map(item => item.precipProbability),
            rainIntensity: selectedData.map(item => item.precipIntensity),
            ozone: selectedData.map(item => Math.round(item.ozone)),
            hum: selectedData.map(item => item.humidity),
            windspeed: selectedData.map(item => item.windSpeed),
            windgust: selectedData.map(item => item.windGust),
          };
      } catch (error) {
        data.error = `${error.code}: ${error.message}`;
      }
      return data;
    }
}

module.exports = Weather
