import Vue from "vue";
import VueSSE from "./vue-sse.js";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(VueSSE, "/events"); // http://localhost:9999/events while developing on localhost

new Vue({
  render: h => h(App)
}).$mount("#app");
