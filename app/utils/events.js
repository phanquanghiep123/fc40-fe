/* eslint-disable func-names */
/* eslint-disable object-shorthand */
export default {
  events: {},
  dispatch: function(name, ...args) {
    if (this.events[name]) {
      this.events[name].forEach(listener => {
        if (listener) {
          listener(...args);
        }
      });
    }
  },
  subscribe: function(name, listener) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(listener);
  },
  unsubscribe: function(name, listener) {
    if (this.events[name]) {
      this.events[name].forEach((event, i) => {
        if (event === listener || event.toString() === listener.toString()) {
          this.events[name].splice(i, 1);
        }
      });
    }
  },
  destroy: function(name) {
    if (this.events[name]) {
      delete this.events[name];
    }
  },
};
