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
  height: {
    type: Number,
    default: 400,
  },
});

onMounted(() => {
  const chart = new Chart({
    container: props.container,
    autoFit: true,
    margin: 0,
  });

  chart
    .line()
    .data(props.data)
    .encode('x', props.x)
    .encode('y', props.y)

    .axis('x', {
      title: props.xAxis,
      line: true,
    })
    .axis('y', {
      title: props.yAxis,
    })
    .tooltip({
      title: (d) => `${props.xAxis} ${d[props.x]}`,
    });

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

  watch(() => props.data, () => {
    nextTick(() => {
      chart.render();
      chart.changeData(props.data);
    });
  });

  chart.render();

  onUnmounted(() => {
    chart.destroy();
  });
});

const hasData = computed(() => props.data.length > 0);

</script>

<template>
  <div
    v-show="hasData"
    :id="container"
    :style="{ height: `${height}px` }"
  />
  <dao-empty
    v-show="!hasData"
    :style="{ height: `${height}px` }"
  />
</template>
