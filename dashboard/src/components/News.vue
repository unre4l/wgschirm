
<template>
  <div class="news ">
    <div>
      <div v-for="(row, i) in rows" :key="i" class="col">
        <div v-if="i === 2">
          <Putzplan />
        </div>
        <div v-for="news in row" :key="news.guid" class="news-item">
          <div :class="getColor(news.guid)" class="news-body">
            <div class="news-date">
              <div class="readableTime">{{ timeAgo(news.guid) }}</div>
            </div>
            <h3>{{ news.title }}</h3>
            <p>{{ news.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Putzplan from './Putzplan.vue';
import { prettySeconds } from '../utils';

export default {
  components: {
    Putzplan,
  },
  data() {
    return {
      data: null,
      colorToId: {},
      now: new Date(),
      rows: [[], [], []],
    };
  },
  computed: {
  },

  created() {
    setInterval(() => {
      this.now = new Date();
    }, 60000);
  },

  mounted() {
    this.subscribe('News', (data) => {
      const rows = [[], [], []];
      data.body.forEach((item, i) => {
        const j = i >= 2 ? i + 1 : i;
        rows[j % 3].push(item);
      });
      this.rows = rows;
    });
  },

  updated() {
  },

  methods: {
    getColor(id) {
      if (!Object.prototype.hasOwnProperty.call(this.colorToId, id)) {
        this.colorToId[id] = `color-${Math.floor(Math.random() * 5) + 1}`;
      }
      return this.colorToId[id];
    },
    timeAgo(id) {
      let time = null;
      this.rows.forEach(row => row.forEach((news) => {
        if (news.guid === id) {
          // eslint-disable-next-line
          time = news.time;
        }
      }));

      const secs = (this.now - time) / 1000;
      return prettySeconds(secs, true);
    },
    prettyTimeAgo(n) {
      const r = n.hoursAgo ? `${n.hoursAgo}h ` : '';
      return `${r}${n.minsAgo}m`;
    },
  },
};
</script>

<style lang="sass" scoped>
@import "~bulma/bulma"

.col
  width: 33.3333%
  float: left
  display: flex
  flex-direction: column
  flex-grow: 1

  > *
    flex-grow: 1
    display: flex
    align-items: center

// .grid
//   &-item,
//   &-sizer
//     width: 100%
//     +tablet
//       width: 33.333333%
//   &-item,
//     &--2
//       width: 100%
//       +tablet
//         width: 66.666666%


// $colors: #ECD078 #D95B43 #C02942 #542437 #53777A
// @each $color in $colors
//     $i: index($colors, $color)
//     .color-#{$i}
//         background-color: $color

.stamp
  position: absolute
  right: 0
  top: 0
  padding: 10px
  width: 100%
  +tablet
    width: 33%

.news
    position: relative
    padding: 10px
    width: 100%
    display: flex
    flex: 1 1 auto
    overflow: hidden

    &::after
      content: ''
      display: block
      width: 100%
      height: 250px
      background: linear-gradient(transparent 0%, white 80%);
      position: absolute
      bottom: 0
      left: 0

    > div
      dislpay: flex

    h3
      font-size: 1.1rem
      font-weight: 600
      line-height: 1.2
      margin-bottom: 0.5rem
      margin-bottom: 10px

    &-item
      position: relative
      display: flex
      align-items: stretch

    &-body
      // box-shadow: 2px 2px 5px rgba(0,0,0,.2)
      margin: 10px
      padding: 24px
      border-radius: 10px
      background: white
      border-radius: 8px
      // box-shadow: 2px 2px 5px rgba(0,0,0,.1)

    &-date
      margin: 0 auto 10px
      display: inline-block
      background: #FEE368
      border-radius: 20px
      padding: 5px 12px
      line-height: 1

    h3,
    p
      text-align: left


</style>
