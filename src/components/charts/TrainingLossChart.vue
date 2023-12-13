<script lang="ts" setup>
import { Chart } from '@/plugins/g2';

const container = 'container-train-loss';

onMounted(() => {
  const chart = new Chart({
    container,
    autoFit: true,
  });

  chart
    .line()
    .data({
      type: 'fetch',
      value: './train.json',
    })
    .encode('x', 'current_steps')
    .encode('y', 'loss')
    .encode('color', 'Symbol')
    .axis('x', { title: 'Step' })
    .axis('y', { title: 'Training Loss' });

  chart.render();

  onUnmounted(() => {
    chart.destroy();
  });
});
</script>

<template>
  <div :id="container" />
</template>
