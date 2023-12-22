<script lang="ts" setup>
import { ProcessedTrainMetrics } from '@/api/finetune-metrics';
import LineChart from './LineChart.vue';

const props = defineProps({
  data: {
    type: Array as PropType<ProcessedTrainMetrics[]>,
    required: true,
  },
  container: {
    type: String,
    default: 'container-training-loss',
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
    y="loss"
    title="Training Loss"
  />
</template>
