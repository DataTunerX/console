<script lang="ts" setup>
import { ProcessedEvalMetrics, ProcessedTrainMetrics } from '@/api/finetune-metrics';
import { Chart } from '@/plugins/g2';

const props = defineProps({
  container: {
    type: String,
    required: true,
  },
  data: {
    type: Array as PropType<ProcessedTrainMetrics[]> | PropType<ProcessedEvalMetrics[]>,
    required: true,
  },
  x: {
    type: String,
    default: 'current_steps',
  },
  y: {
    type: String,
    required: true,
  },
  xAxis: {
    type: String,
    default: 'Step',
  },
  yAxis: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
});

onMounted(() => {
  const chart = new Chart({
    container: props.container,
    autoFit: true,
  });

  chart
    .line()
    .data(props.data)
    .encode('x', props.x)
    .encode('y', props.y)

    .axis('x', { title: props.xAxis })
    .axis('y', { title: props.yAxis });

  if (props.color) {
    chart.encode('color', props.color);
  }

  chart.render();

  onUnmounted(() => {
    chart.destroy();
  });
});
</script>

<template>
  <div :id="container" />
</template>
