

<template>
  <div class="observer no-flex">
    <div v-for="(value, key, i) in observed" :key="i">
      <p>{{ prettyKey(key) }}
        <template v-if="typeof value === 'object'">
          <span v-for="(item, j) in value" :key="j">
            <span v-if="j === 0">{{ item }} </span>
            <span v-if="j === 1 && item">({{ item }})</span>
          </span>
        </template>
        <template v-else>
          <span v-if="typeof value === 'string'">
            {{ prettySeconds(value) }}</span>
          <span v-else>{{ value }}</span>
        </template>
      </p>
    </div>
  </div>
</template>

<script>
import { prettySeconds } from '../utils';

export default {
  data() {
    return {
      observed: {},
    };
  },

  mounted() {
    this.subscribe('Obersver', (data) => {
      this.observed = data;
    });
  },

  methods: {
    prettyKey(key) {
      const bla = key.replace(/-/g, ' ');
      switch (bla) {
        case 'connections':
          return 'cons';
        case 'server uptime':
          return 'server';
        case 'connection uptime':
          return 'con';
        default:
          return bla;
      }
    },
    prettySeconds,
  },
};
</script>

<style lang="sass" scoped>
  @import '~bulma/sass/utilities/_all'

  .observer
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: flex-start
    background: #f4f4f4

    > *
      flex-grow: 1
      text-align: center
      font-size: 10px
      line-height: 1.125
      width: 50%

      +tablet
        width: auto

</style>
