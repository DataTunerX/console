<script lang="ts" setup>
import { ProcessedTrainMetrics } from '@/api/finetune-metrics';
import LineChart from './LineChart.vue';

defineProps({
  data: {
    type: Array as PropType<ProcessedTrainMetrics[]>,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
});

const container = 'container-learning-rate';
</script>

<template>
  <line-chart
    :container="container"
    :data="data"
    :color="color"
    y="learning_rate"
    title="Learning Rate"
  />
</template>
