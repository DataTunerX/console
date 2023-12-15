<script lang="ts" setup>
import { ProcessedEvalMetrics } from '@/api/finetune-metrics';
import LineChart from './LineChart.vue';

defineProps({
  data: {
    type: Array as PropType<ProcessedEvalMetrics[]>,
    required: true,
  },
});

const container = 'container-performance-evaluation';

</script>

<template>
  <line-chart
    :container="container"
    :data="data"
    y="eval_perplexity"
    y-axis="Eval Perplexity"
  />
</template>
