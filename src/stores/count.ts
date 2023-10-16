import { defineStore, acceptHMRUpdate } from 'pinia';

const useCounterStore = defineStore('id', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count += 1;
    },
  },
});

// this is for webpack 5.x
if (import.meta.webpackHot) {
  import.meta.webpackHot?.accept(acceptHMRUpdate(useCounterStore, import.meta.webpackHot));
}

// this one is for Vite and other bundlers
// if (import.meta.hot) {
//   import.meta.hot?.accept(acceptHMRUpdate(useCounterStore, import.meta.hot))
// }

export default useCounterStore;
