
<template>
  <div class="putzplan no-flex">
    <h4>Putzplan ({{ seed }}@{{ mutation }})</h4>
    <table>
      <thead>
        <tr>
          <td>Bad</td>
          <td>Küche</td>
          <td>Müll</td>
        </tr>
      </thead>
      <tbody>
        <tr class="previous-seed">
          <td>{{ previous['Bad'] }}</td>
          <td>{{ previous['Küche'] }}</td>
          <td>{{ previous['Müll'] }}</td>
        </tr>
        <tr v-for="(value, index) in schedules" :key="index" :class="{'active': value.active}">
          <td>{{ value['Bad'] }}</td>
          <td>{{ value['Küche'] }}</td>
          <td>{{ value['Müll'] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      schedules: null,
      seed: -1,
      mutation: -1,
      previous: {
        'Bad': null,
        'Küche': null,
        'Müll': null,
      },
    }
  },

  mounted () {
    this.subscribe('Cleaning', (data) => {

      this.schedules = data.body.schedules;
      this.mutation = data.body.mutation;
      this.seed = data.body.seed;
      this.previous = data.body.previous;
    });
  },
}
</script>

<style lang="sass">
@import '../../node_modules/bulma/sass/utilities/_all'

.putzplan
  bottom: 0
  width: 100%
  left: 0
  padding: 20px
  position: static

  h4
    margin: 0 0 15px

  table
    width: 100%

    td
      text-align: center

  thead td
    font-weight: bold

  .previous-seed td
    color: #ccc

  .active
    font-weight: bold
    background: #d0f0c1

</style>

