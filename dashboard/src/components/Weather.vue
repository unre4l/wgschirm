<template>
  <div class="chart">
    <div class="chart-container">
      <div v-if="errorMsg !== null" class="errorMsg">
        <span class="errorText">{{ errorMsg }}</span>
      </div>
      <WeatherChart
        :styles="{height: '350px'}"
        :chart-data="weather"
        :options="weatherOptions"
        class="chart"
      />
    </div>
  </div>
</template>

<script>
import merge from 'deepmerge';
import { Line, mixins } from 'vue-chartjs';
import ChartJsPluginDataLabels from 'chartjs-plugin-datalabels';

export default {
  components: {
    WeatherChart: {
      components: {
        ChartJsPluginDataLabels,
      },
      extends: Line,
      mixins: [mixins.reactiveProp],
      props: ['options'],
      mounted() {
        this.renderChart(this.chartData, this.options);
      },
    },
  },

  data() {
    const defaultAxis = {
      gridLines: {
        tickMarkLength: 0, display: false, drawOnChartArea: false, drawBorder: false,
      },
      ticks: { display: false },
    };
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      events: [],
      legend: { display: false },
      layout: { padding: { top: 20 } },
      elements: { point: { radius: 0 } },
      scales: {
        xAxes: [],
        yAxes: [],
      },
    };

    const weatherOptions = merge(defaultOptions, {
      scales: {
        xAxes: [merge(defaultAxis, {
          id: 'hour',
          type: 'time',
          bounds: 'data',
          time: {
            unit: 'hour',
            displayFormats: {
              hour: 'H:00',
            },
            stepSize: 2,
            minUnit: 'hour',
          },
          gridLines: {
            display: true,
            tickMarkLength: 5,
          },
          ticks: {
            display: true,
            padding: 15,
            minRotation: 40,
            fontSize: 15,
            callback: (value, i, values) => (i === 0 || i === values.length - 1 ? '' : `${value}`),
          },
        })],
        yAxes: [
          merge(defaultAxis, { id: 'ozone', ticks: { min: 150 } }),
          merge(defaultAxis, { id: 'temp', ticks: { suggestedMin: 0, suggestedMax: 40 } }),
          merge(defaultAxis, { id: 'rain', ticks: { min: 0, max: 0.65 } }),
          merge(defaultAxis, { id: 'rainIntensity', ticks: { min: 0, suggestedMax: 2 } }),
          merge(defaultAxis, { id: 'hum', ticks: { min: -0.5, max: 2 } }),
          merge(defaultAxis, { id: 'windspeed', ticks: { min: 0, max: 40 } }),
        ],
      },
    });

    return {
      weather: null,
      ozone: null,
      errorMsg: null,
      weatherOptions,
    };
  },

  mounted() {
    this.subscribe('Weather', (e) => {
      const data = e.body;
      this.weather = {
        labels: data.labels,
        datasets: [
          {
            yAxisID: 'hum',
            xAxisID: 'hour',
            borderColor: 'rgba(110, 216, 199,0.6)',
            fill: false,
            borderWidth: 1,
            data: data.hum,
            datalabels: {
              align: 'top',
              offset: 3,
              // backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 5,
              padding: 2,
              color: '#6ed8c7',
              formatter: (v, c) => this.formatDataLabel(v, c, '%', true, true),
            },
          },
          {
            yAxisID: 'rainIntensity',
            xAxisID: 'hour',
            borderWidth: 2,
            borderColor: 'rgba(24,120,240,1)',
            backgroundColor: 'rgba(24,120,240,0.6)',
            data: data.rainIntensity,
            datalabels: {
              align: 'top',
              offset: 3,
              color: '#fff',
              borderRadius: 5,
              padding: 2,
              backgroundColor: 'rgba(24,120,240,1)',
              formatter: (v, c) => this.formatDataLabel(v, c, 'mm/h', false, false),
            },
          },
          {
            yAxisID: 'rain',
            xAxisID: 'hour',
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0)',
            backgroundColor: 'rgba(24,120,240,0.3)',
            data: data.rain,
            datalabels: {
              align: 'top',
              offset: 3,
              color: '#fff',
              borderRadius: 5,
              padding: 2,
              backgroundColor: 'rgba(24,120,240,1)',
              formatter: (v, c) => this.formatDataLabel(v, c, '%', false, true),
            },
          },
          {
            yAxisID: 'temp',
            xAxisID: 'hour',
            borderColor: 'rgb(255,204,0,1)',
            backgroundColor: 'rgba(255,204,0,0.3)',
            borderWidth: 3,
            data: data.temp,
            datalabels: {
              align: 'top',
              offset: 3,
              font: { size: 16, weight: 'bold' },
              color: 'rgba(255,204,0,1)',

              formatter(value, c) {
                const maxI = c.dataset.data.length - 1;
                const i = c.dataIndex;
                return i === 0 || i === maxI || i % 3 !== 0 ? null : `${Math.round(value)} °C`;
              },
            },
          },
          {
            yAxisID: 'ozone',
            xAxisID: 'hour',
            borderColor: 'rgb(255, 222, 158)',
            fill: false,
            data: data.ozone,
            datalabels: {
              align: 'top',
              offset: 3,
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 5,
              padding: 2,
              color: 'rgb(255, 222, 158)',
              formatter(v, c) {
                const targetI = Math.floor(c.dataset.data.length / 2) - 1;
                const i = c.dataIndex;
                return i === targetI ? v : null;
              },
            },
          },
        ],
      };
    });
  },

  beforeDestroy() {
  },

  methods: {
    formatDataLabel(v, c, unit, calcMin, isPercentage) {
      const values = c.dataset.data.slice(1, -1);
      const i = c.dataIndex;
      const max = Math.max(...values);
      const maxI = values.indexOf(max) + 1;

      let min = -1;
      let minI = -1;
      if (calcMin) {
        min = Math.min(...values);
        minI = values.indexOf(min) + 1;
      }

      return (v === max && i === maxI) || (v === min && i === minI)
        ? `${isPercentage ? Math.round(v * 100) : v}${isPercentage ? '' : ' '}${unit}` : null;
    },

    error(error) {
      this.errorMsg = error;
    },

  },
};
</script>

<style lang="sass" scoped>
.chart
  width: 100%
  overflow: hidden

  &-container
    position: relative
    margin: 0 -10px 0 -3px

.errorMsg
  position: absolute
  top: 0
  width: 100%
  height: 100%
  left: 0
  background: rgba(255,255,255,.5)
  text-align: center

  .errorText
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)

</style>
