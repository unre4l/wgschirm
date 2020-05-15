const WgschirmModule = require('../WgschirmModule');

const dateFormat = require('dateformat');
const Parser = require("rss-parser");
const _ = require('lodash');

dateFormat.i18n.dayNames = [
    'Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam',
    'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'
];
class News extends WgschirmModule {
    constructor(config, notifiyFunc) {
        super(config, notifiyFunc);

        this.name = 'News';
        this.parser = new Parser({
            customFields: {
                item: ["title", "updated", "summary"],
            }
        });

        this.url = 'http://www.tagesschau.de/xml/rss2';
    }

    async preparePublish() {
      const data = {
        meta: {
          timestamp: new Date().getTime(),
        },
        body: [],
      };
      try {
        const feed = await this.parser.parseURL(this.url);
        const items = feed.items.map(item => {
            item.time = new Date(item.pubDate).getTime();
            ['link', 'pubDate', 'content:encoded', 'isoDate', 'contentSnippet'].forEach(k => {
              delete item[k];
            });
            return item;
        }).sort((a,b) => {
          return b.time - a.time;
        }).slice(0, this.config.nums);
        data.body = items;
      }catch(error){
        data.error = `${error.code}: ${error.message}`;
      }
      return data;
    }
}

module.exports = News
