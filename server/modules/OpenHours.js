const WgschirmModule = require('../WgschirmModule');
const axios = require('axios');

class OpenHours extends WgschirmModule {
    constructor(config, notifiyFunc) {
        super(config, notifiyFunc);

        this.name = 'OpenHours';
        this.places = config.places;
    }

    toUrl(palce) {
        return 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+ palce + '&key=' + this.config.GOOGLE_PLACES_API_KEY
    }

    legitData(data){
      return Object.prototype.hasOwnProperty.call(data, 'result') &&
        Object.prototype.hasOwnProperty.call(data.result, 'opening_hours');
    }

    hasError(data){
      return Object.prototype.hasOwnProperty.call(data, 'error_message');
    }

    async preparePublish() {
        const data = {
          meta: {
            timestamp: new Date().getTime(),
          },
          body: {},
        };
        await Promise.all(Object.entries(this.places).map(async ([name, id]) => {
          try {
            const response = await axios.get(this.toUrl(id));
            if(this.hasError(response.data)){
              data.error = response.data.error_message;
            }else{
              data.body[name] = this.legitData(response.data)
                ? response.data.result.opening_hours.periods : null;
            }
          }catch(error){
            data.error = `${error.code}: ${error.message}`;
          }
        }));
        return data;
    }
}

module.exports = OpenHours
