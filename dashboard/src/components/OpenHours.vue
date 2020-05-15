
<template>
  <div class="openhours">
    <div v-for="item in openhours" :key="item.name">
      <p class="heading">{{ item.name }}</p>
      <p v-if="item.isOpen">💤</p>
      <p v-if="!item.isOpen">
        <span v-if="item.mins < 15">😢</span>
        <span v-else-if="item.mins < 20">🏃💨💨</span>
        <span v-else-if="item.mins < 30">🏃💨</span>
        <span v-else>👍</span>
      </p>
    </div>
  </div>
</template>

<script>
import dateformat from 'dateformat';
import moment from 'moment';

const DAYS_PER_WEEK = 7;
const MINUTE = 60 * 1000;

export default {
  data() {
    return {
      data: null,
      openhours: [],
      date: new Date(),
      timer: null,
    };
  },

  watch: {
    date() {
      this.calcMinutesLeft();
    },
  },
  mounted() {
    this.subscribe('OpenHours', (data) => {
      this.data = data.body;
      this.calcNextOpeningAndClosing();
    });
    this.timer = setInterval(() => {
      this.date = new Date();
    }, MINUTE);
  },
  methods: {
    calcNextOpeningAndClosing() {
      const now = new Date();
      const today = parseInt(dateformat(now, 'N'), 10);
      const currentTime = dateformat(now, 'HHMM');

      const openHourItems = [];
      Object.entries(this.data).forEach(([name, times]) => {
        if (!Array.isArray(times)) {
          console.log(`${name} has no times`);
          return;
        }

        let nextClose = null;
        let nextOpen = null;
        let searchDay = today;
        let iterateCount = 0;

        while (!nextClose || !nextOpen) {
          // eslint-disable-next-line
          times.forEach((zeit) => {
            if (!nextOpen && parseInt(zeit.open.day, 10) === searchDay
            && ((searchDay === today && zeit.open.time > currentTime) || searchDay !== today)) {
              nextOpen = zeit.open;
            }
            if (!nextClose && parseInt(zeit.close.day, 10) === searchDay
            && ((searchDay === today && zeit.close.time > currentTime) || searchDay !== today)) {
              nextClose = zeit.close;
            }
          });

          iterateCount += 1;
          searchDay = (today + iterateCount) % DAYS_PER_WEEK;

          if (iterateCount > DAYS_PER_WEEK) {
            break;
          }
        }

        if (!nextClose || !nextOpen) {
          console.log(`${name} has no matching opening or closing time`);
          return;
        }

        const nextCloseTimeAsDate = moment(nextClose.time, 'HHmm').add((parseInt(nextClose.day, 10) - today) * 24, 'hours');
        const nextOpenTimeAsDate = moment(nextOpen.time, 'HHmm').add((parseInt(nextOpen.day, 10) - today) * 24, 'hours');

        openHourItems.push({
          name,
          open: nextOpenTimeAsDate,
          close: nextCloseTimeAsDate,
          mins: '-',
          isOpen: false,
        });
      });


      this.openhours = openHourItems;
      this.calcMinutesLeft();
    },
    calcMinutesLeft() {
      this.openhours.forEach((item, i) => {
        let mins = null;
        const currentTimeAsDate = moment(dateformat(this.date, 'HHMM'), 'HHmm');
        if (item.open.isBefore(item.close)) {
          mins = moment.duration(Math.abs(item.open.diff(currentTimeAsDate))).asMinutes();
          item.isOpen = true;
        } else {
          mins = moment.duration(Math.abs(item.close.diff(currentTimeAsDate))).asMinutes();
          item.isOpen = false;
        }
        item.mins = mins;
        this.$set(this.openhours, i, item);
      });
    },
  },
};
</script>

<style lang="sass">
  @import '~bulma/sass/utilities/_all'

  .openhours
    display: flex
    flex-direction: row
    flex-wrap: wrap

    > *
      padding: 15px
      flex-grow: 1
      text-align: center
      font-size: 1.75rem
      line-height: 1.125
      +mobile
        width: 50%
      +tablet
        width: auto

</style>
