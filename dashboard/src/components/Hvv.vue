
<template>
  <div class="hvv">
    <div class="hvv-timeline">
      <div is="transition-group" name="bahnen">
        <div
          v-for="(s, index) in fahrten"
          :key="s.serviceId || index"
          :data-id="s.serviceId"
          :style="getOffset(s.actualTimeLeft)"
          :class="{['stack-'+s.stack]: s.stack}"
          class="hvv-item"
        >
          <div v-if="!s.cancelled" class="hvv-item-ref">
            <div class="hvv-item-body">
              <img :src="icon(s)" alt="">
              <span class="linie" v-text="prettyStation(s.line.direction)" />
            </div>
            <div class="time-left" v-html="timeLeft(s.actualTimeLeft)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {

  data() {
    return {
      timeLineTick: 30,
      fahrten: {},
    };
  },
  mounted() {
    this.subscribe('Hvv', (data) => {
      const timeLeftMap = {};
      const fahrten = data.body;

      if (!Array.isArray(fahrten)) {
        return;
      }

      fahrten.forEach((fahrt, i) => {
        fahrt.cancelled = fahrt.cancelled || false;

        if (fahrt.cancelled) {
          return;
        }

        // calc stack
        const timeleft = fahrt.timeOffset + fahrt.delay;
        if (Object.prototype.hasOwnProperty.call(timeLeftMap, timeleft)) {
          timeLeftMap[timeleft] += 1;
        } else {
          timeLeftMap[timeleft] = 0;
        }
        fahrt.stack = timeLeftMap[timeleft];

        // calc actualTimeLeft
        let timeLeft = Object.prototype.hasOwnProperty.call(fahrt, 'delay') ? fahrt.timeOffset + fahrt.delay : fahrt.timeOffset;
        if (timeLeft > 0) {
          timeLeft -= 1;
        }
        fahrt.actualTimeLeft = timeLeft;

        // determin min label
        fahrt.stackMinLabel = !!Object.prototype.hasOwnProperty.call(timeLeftMap, timeleft + 1);
      });

      this.fahrten = fahrten;
    });
  },
  methods: {
    getOffset(mins) {
      return `left: ${mins * this.timeLineTick}px`;
    },
    icon(t) {
      if (t.line.type.simpleType === 'BUS') return `https://www.geofox.de/icon_service/line?height=18&lineKey=VHH:${t.line.name}_VHH`;
      if (t.line.type.simpleType === 'TRAIN') return `https://www.geofox.de/icon_service/line?height=18&lineKey=ZVU-DB:${t.line.name}_ZVU-DB_S-ZVU`;

      return `https://www.geofox.de/icon_service/line?height=18&lineKey=ZVU-DB:${t.line.name}_ZVU-DB_S-ZVU`;
    },
    timeLeft(t) {
      return t === 0 ? '<b>jetzt</b>' : `<b>${t}</b> <span class="mins">mins</span>`;
    },
    prettyStation(s) {
      if (s === 'Poppenbüttel / Hamburg Airport (Flughafen)') return 'Poppenbüttel';
      if (s === 'Hamburg Airport (Flughafen)') return 'Airport';
      if (s === 'Schenefeld, Achterndiek') return 'Schenefeld';

      return s;
    },
  },
};
</script>

<style lang="sass">
.bahnen-enter-active,
.bahnen-leave-active
    transition: all 1s !important

.bahnen-enter,
  transform: translateX(100vw)
.bahnen-leave-to
  transform: translateX(-250px)

.hvv
  padding: 15px
  overflow: hidden

  &-item
    width: 10px
    height: 10px
    border-radius: 20px
    position: absolute
    bottom: -4px
    right: 0
    background: white
    border: 2px solid black
    transition: left 1s
    white-space: nowrap

    .time-left
      position: absolute
      bottom: 0px
      padding: 5px
      transform: translate(-40%, 100%)
      white-space: nowrap

      .mins
        font-size: .75rem

        [class^=stack-] &
          display: block

    &-ref
      position: relative
      height: 10px
      width: 10px

    &-body
      white-space: nowrap
      transform: translate(-100%, -100%) rotate(-40deg)
      position: relative
      transition: transform 1s

      .stack-1 &
        transform: translate(-100%, -200%) rotate(-40deg)

      .stack-2 &
        transform: translate(-100%, -300%) rotate(-40deg)

      .stack-4 &
        transform: translate(-100%, -400%) rotate(-40deg)

      img
        vertical-align: center
        display: inline-block
        width: auto
        height: 17px
        max-width: none
        vertical-align: middle

      .linie
        vertical-align: middle

  &-timeline
    position: relative
    margin: 0 auto
    height: 150px
    margin-bottom: 35px
    width: 900px

    &::after
      content: '🡑'
      color: red
      display: inline
      font-weight:
      position: absolute
      left: 0
      bottom: 0
      line-height: 1
      font-size: 20px
      transform: translate(0, 22px)

    &::before
      content: ''
      height: 2px
      background: black
      position: absolute
      bottom: 0
      left: -200px
      right: -200px

</style>
