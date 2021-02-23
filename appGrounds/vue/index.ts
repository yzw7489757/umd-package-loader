import Vue from 'vue';
import Vuex from 'vuex';
import App from './index.vue';

Vue.use(Vuex);
let instance;

const store = new Vuex.Store({
  state: {
    time: ''
  },
  mutations: {
    CHANGE_STATE(state, time) {
      state.time = time;
    }
  },
  actions: {
    CHANGE_TIME (context, action) {
      context.commit("CHANGE_STATE", action.data)
    }
  },
  modules: {}
})

export function render (mountNode: HTMLElement) {
  instance = new Vue({
    // router,
    store,
    render: h => h(App)
  }).$mount(mountNode)
}

export function update(props: { time: string }) {
  store.dispatch({
    type: "CHANGE_TIME",
    data: props.time
  })
}

export function unmount() {
  instance.$destory();
  instance = null;
}