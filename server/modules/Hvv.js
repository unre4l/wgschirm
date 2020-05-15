const WgschirmModule = require('../WgschirmModule');
const axios = require('axios');
const dateFormat = require('dateformat');
const CryptoJS = require('crypto-js');

class Hvv extends WgschirmModule {
    constructor(config, notifiyFunc) {
        super(config, notifiyFunc);

        this.name = 'Hvv';
        this.timeOffset = this.config.timeOffset || 30;
        this.num = this.config.num || 20;
    }

    async preparePublish() {
      const data = {
        meta: {
          timestamp: new Date().getTime(),
        },
        body: {},
      };
      try {
        const response = await axios(this.hvvApiCall());
        if(Object.prototype.hasOwnProperty.call(response.data, 'departures')){
          data.body = response.data.departures;
        }
      } catch (error) {
        data.error = `${error.code}: ${error.message}`;
      }
      return data;
    }

    hvvApiCall() {
      const now = new Date()
      const body = JSON.stringify({
        version: 31,
        station: { id: 'Master:80953', type: 'STATION' },
        time: {
          date: dateFormat(now, 'dd.mm.yyyy'),
          time: dateFormat(now, 'HH:MM:ss')
        },
        maxTimeOffset: this.timeOffset,
        maxList: this.num,
        allStationsInChangingNode: true,
        useRealtime: true,
        returnFilters: true,
        serviceTypes: ['SBAHN'],
        filter: [
            {
                serviceID: 'ZVU-DB:S1_ZVU-DB_S-ZVU', // L:N_B
                stationIDs: ['Master:80951', 'Master:11951'] // Master:80951 = Reeperbahn, Master:11951 = Dammtor
            },
            { serviceID: 'ZVU-DB:S11_ZVU-DB_S-ZVU', stationIDs: ['Master:80951', 'Master:11951'] },
            { serviceID: 'ZVU-DB:S2_ZVU-DB_S-ZVU', stationIDs: ['Master:80951', 'Master:11951'] },
            { serviceID: 'ZVU-DB:S21_ZVU-DB_S-ZVU', stationIDs: ['Master:80951', 'Master:11951'] },
            { serviceID: 'ZVU-DB:S31_ZVU-DB_S-ZVU', stationIDs: ['Master:80951', 'Master:11951'] },
            { serviceID: 'ZVU-DB:S3_ZVU-DB_S-ZVU', stationIDs: ['Master:80951', 'Master:11951'] }
        ]
      });
      const hash = CryptoJS.HmacSHA1(body, this.config.secret);
      return {
          url: '/gti/public/departureList',
          method: 'post',
          baseURL: this.config.apiUrl,
          headers: {
              'geofox-auth-signature': hash.toString(CryptoJS.enc.Base64),
              'geofox-auth-user': this.config.apiUser,
              'geofox-auth-type': 'HmacSHA1',
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8'
          },
          data: body,
      }
    }
}

module.exports = Hvv


        // try {
        //     let now = new Date()
        //     let bus = {
        //         station: { id: 'Master:80065', type: 'STATION' },
        //         time: { date: dateFormat(now, 'dd.mm.yyyy'), time: dateFormat(now, 'HH:MM:ss') },
        //         maxTimeOffset: 60*12,
        //         maxList: 4,
        //         useRealtime: true,
        //         returnFilters: true,
        //         serviceTypes: ['METROBUS'],
        //         filter: [{ serviceID: 'VHH:2_VHH', stationIDs: ['Master:80105'] }]
        //     }

        //     let body = JSON.stringify(bus);
        //     let hash = CryptoJS.HmacSHA1(body, this.config.secret);
        //     let signature = hash.toString(CryptoJS.enc.Base64);

        //     let requestOptions = {
        //         url: '/gti/public/departureList',
        //         method: 'post',
        //         baseURL: this.config.apiUrl,
        //         headers: {
        //             'geofox-auth-signature': signature,
        //             'geofox-auth-user': this.config.apiUser,
        //             'geofox-auth-type': 'HmacSHA1',
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json;charset=UTF-8'
        //         },
        //         data: body
        //     }

        //     response = await axios(requestOptions)
        // } catch (err) {
        //     res.error = 'Hvv nicht erreichbar. 2'
        //     return res
        // }
