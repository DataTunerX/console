<script lang="ts" setup>
import { ProcessedEvalMetrics } from '@/api/finetune-metrics';
import LineChart from './LineChart.vue';

defineProps({
  data: {
    type: Array as PropType<ProcessedEvalMetrics[]>,
    required: true,
  },
});

</script>

<template>
  <line-chart
    container="container-validation-loss"
    :data="data"
    y="eval_loss"
    title="Eval Loss"
  />
</template>
