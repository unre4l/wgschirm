
<template>
  <div class="coins">
    <div v-for="(value, key, index) in data" :key="index">
      <p class="heading">{{ key }}</p>
      <p>{{ value }}</p>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
    name: 'Crypto',

    data () {
        return {
            data: null,
        }
    },

    mounted () {
      this.subscribe('Coins', (data) => {
        this.data = data.body;
      });
    },

    beforeDestroy: function() {
        // // this.$herold.unregister(this, 'coins')
    },

    methods: {
        update(data) {
            this.data = data
        }
    }
}
</script>

<style lang="sass" scoped>
  @import '~bulma/sass/utilities/_all'

  .coins
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: flex-start

    > *
      padding: 15px
      flex-grow: 1
      text-align: center
      font-size: 1.75rem
      line-height: 1.125
      width: 50%
      +tablet
        width: auto
</style>

