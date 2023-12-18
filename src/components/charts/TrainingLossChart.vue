<script lang="ts" setup>
import { ProcessedTrainMetrics } from '@/api/finetune-metrics';
import LineChart from './LineChart.vue';

defineProps({
  data: {
    type: Array as PropType<ProcessedTrainMetrics[]>,
    required: true,
  },
  container: {
    type: String,
    default: 'container-training-loss',
  },

});

</script>

<template>
  <line-chart
    :container="container"
    :data="data"
    y="loss"
    title="Training Loss"
  />
</template>
