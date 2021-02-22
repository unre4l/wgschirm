<template>
  <div id="app">
    <Time />
    <Weather />
    <Crypto />
    <Hvv />
    <OpenHours />
    <News />
    <Observer />
  </div>
</template>

<script>
import Observer from './components/Observer.vue';
import Time from './components/Time.vue';
import Weather from './components/Weather.vue';
import Crypto from './components/Crypto.vue';
import Hvv from './components/Hvv.vue';
import News from './components/News.vue';
import OpenHours from './components/OpenHours.vue';

const RELOAD_TIMEOUT = 10000;

export default {
  name: 'App',
  components: {
    Time,
    Weather,
    Observer,
    Crypto,
    Hvv,
    News,
    OpenHours,
  },
  data() {
    return {
      reloadState: false,
    };
  },

  mounted() {
    // only reload every 10s on error
    this.sseError((error) => {
      if (!this.reloadState) {
        this.reloadState = true;
        setTimeout(() => {
          window.location.reload();
        }, RELOAD_TIMEOUT);
      }
    });
  },
};
</script>

<style lang="sass">
@import "~bulma/bulma"
@import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700');

// mixin for wall mounted dashboard monitor in standard 1080p and 1200p resolution
=wall-only
  @media only screen and (min-width: 1080px) and (max-width: 1200px)
    @content

.no-flex
  flex: none

html
  +wall-only
    overflow: hidden

body
  background: #f4f4f4
  margin: 0
  padding: 0
  font-family: 'Roboto', sans-serif !important;
  overflow: hidden;

#app
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  max-width: 1200px
  margin: 0 auto
  position: relative
  overflow: hidden
  background: white
  display: flex
  flex-direction: column
  height: 1920px
  overflow-y: hidden

  +wall-only
    overflow: hidden

  > *:last-child
    flex-grow: 1

</style>
