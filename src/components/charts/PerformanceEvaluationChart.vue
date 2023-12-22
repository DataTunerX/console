<script lang="ts" setup>
import { ProcessedEvalMetrics } from '@/api/finetune-metrics';
import LineChart from './LineChart.vue';

const props = defineProps({
  data: {
    type: Array as PropType<ProcessedEvalMetrics[]>,
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
    container="container-performance-evaluation"
    y="eval_perplexity"
    title="Eval Perplexity"
  />
</template>
