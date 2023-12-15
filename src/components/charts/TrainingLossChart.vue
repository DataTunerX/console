<script lang="ts" setup>
import { ProcessedTrainMetrics } from '@/api/finetune-metrics';
import LineChart from './LineChart.vue';

defineProps({
  data: {
    type: Array as PropType<ProcessedTrainMetrics[]>,
    required: true,
  },
});

const container = 'container-train-loss';

</script>

<template>
  <line-chart
    :container="container"
    :data="data"
    y="loss"
    y-axis="Training Loss"
  />
</template>
