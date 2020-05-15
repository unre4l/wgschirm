/* eslint-disable */
export default {
  install(Vue, url) {
    if (!url) {
      throw new Error('[vue-sse] cannot find url');
    }
    const eventSource = new EventSource(url);
    Vue.prototype.subscribe = (type, handler) => {
      eventSource.addEventListener(type, (e) => {
        handler(JSON.parse(e.data));
      });
    }
    Vue.prototype.sseError = (handler) => {
      eventSource.onerror = handler;
    }
  },
};
