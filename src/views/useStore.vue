<template>
  <div>
    <span>{{ counter.double }}</span>
    <button @click="addCount">
      click
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useCounterStore from '../stores/count';

export default defineComponent({
  setup() {
    const counter = useCounterStore();

    const addCount = () => {
      counter.increment();
    };

    return {
      counter,
      addCount,
    };
  },
});
</script>
