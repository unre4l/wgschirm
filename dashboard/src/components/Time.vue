
<template>
  <div class="time no-flex">
    <div>{{ date }}</div>
    <div class="current-time">{{ time }}</div>
    <div><span class="time-label">week no.</span> {{ weekno }}</div>
  </div>
</template>

<script>
import dateformat from 'dateformat';

dateformat.i18n.dayNames = [
  'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa',
  'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag',
];
dateformat.i18n.monthNames = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

const FORMAT_DATE = 'dddd, d. mmmm yyyy';
const FORMAT_TIME = 'HH:MM:ss';
const FORMAT_WEEK_NO = 'W';
const UPDATE_INTERVAL = 1000;

export default {
  data() {
    return {
      now: new Date(),
    };
  },

  computed: {
    date() {
      return dateformat(this.now, FORMAT_DATE);
    },
    time() {
      return dateformat(this.now, FORMAT_TIME);
    },
    weekno() {
      return dateformat(this.now, FORMAT_WEEK_NO);
    },
  },

  mounted() {
    this.interval = setInterval(() => {
      this.now = new Date();
    }, UPDATE_INTERVAL);
  },

  beforeDestroy: () => {
    clearInterval(this.interval);
  },
};
</script>

<style lang="sass" scoped>
  .time
    display: flex
    flex-direction: row
    margin-bottom: -10px
    padding-top: 10px
    position: relative
    z-index: 10
    align-items: baseline

    > *
      flex-grow: 1
      display: inline-block
      text-align: center
      padding: 10px 15px
      vertical-align: top
      font-size: 1.2rem
      line-height: 1

  .current-time
    font-size: 1.75rem

  .time-label
    font-size: .75rem;
    font-style: italic
</style>
