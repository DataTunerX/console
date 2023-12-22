<script lang="ts" setup>
import { ProcessedTrainMetrics } from '@/api/finetune-metrics';
import LineChart from './LineChart.vue';

const props = defineProps({
  data: {
    type: Array as PropType<ProcessedTrainMetrics[]>,
    required: true,
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
  encode: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
});

</script>

<template>
  <line-chart
    v-bind="props"
    container="container-learning-rate"
    y="learning_rate"
    title="Learning Rate"
  />
</template>
