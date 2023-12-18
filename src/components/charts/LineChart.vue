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
  title: {
    type: String,
    default: '',
  },
  hideTitle: {
    type: Boolean,
    default: false,
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
    default: '',
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
    height: 400,
  });

  chart
    // .theme({ type: 'academy' })
    .line()
    .data(props.data)
    .encode('x', props.x)
    .encode('y', props.y)

    .axis('x', {
      title: props.xAxis,
      line: true,
      // arrow: true,
    })
    .axis('y', {
      title: props.yAxis,
      // line: true,
      // arrow: true,
      // Grid
      // gridLineDash: null,
      // gridStroke: 'red',
      // gridStrokeWidth: 5,
      // gridAreaFill: '#eee',
      // lineStroke: 'red',
      // tickLineWidth: 2,
      // tickStroke: 'red',
      // gridLineDash: null,
      // gridStroke: 'black',
      // gridStrokeWidth: 5,
      // gridAreaFill: '#eee',
    });
  // .scale('color', { palette: 'accent' }); // 指定色板

  if (props.color) {
    chart.encode('color', props.color);
  }

  if (!props.hideTitle) {
    chart.title({
      title: props.title,
      style: {
        titleFontSize: 14,
      },
    });
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
