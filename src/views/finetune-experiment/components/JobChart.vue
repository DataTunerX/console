<template>
  <div class="job-chart">
    <div class="flex justify-end">
      <dao-select v-model="metricType">
        <dao-option
          v-for="item in metricTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </dao-select>
    </div>

    <component
      :is="getChartComponent(metricType)"
      :data="getChartData(metricType)"
      encode="finetune_name"
      hide-title
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, PropType } from 'vue';
import { ProcessedMetrics } from '@/api/finetune-metrics';
import LearningRateChart from '@/components/charts/LearningRateChart.vue';
import TrainLossChart from '@/components/charts/TrainingLossChart.vue';
import ValidationLossChart from '@/components/charts/ValidationLossChart.vue';
import PerformanceEvaluationChart from '@/components/charts/PerformanceEvaluationChart.vue';

const props = defineProps({
  metrics: {
    type: Object as PropType<ProcessedMetrics>,
    default: () => ({
      train_metrics: [],
      eval_metrics: [],
    }),
  },
  selectedKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

enum MetricType {
  LearningRate = 'learning_rate',
  TrainingLoss = 'training_loss',
  ValidationLoss = 'validation_loss',
  PerformanceEvaluation = 'performance_evaluation',
}

const metricTypes: { label: string; value: MetricType }[] = [
  {
    label: 'Training Loss',
    value: MetricType.TrainingLoss,
  },
  {
    label: 'Learning Rate',
    value: MetricType.LearningRate,
  },
  {
    label: 'Validation Loss',
    value: MetricType.ValidationLoss,
  },
  {
    label: 'Performance Evaluation',
    value: MetricType.PerformanceEvaluation,
  },
];

const metricType = ref(MetricType.TrainingLoss);

function getChartComponent(type: MetricType) {
  switch (type) {
    case MetricType.LearningRate:
      return LearningRateChart;
    case MetricType.TrainingLoss:
      return TrainLossChart;
    case MetricType.ValidationLoss:
      return ValidationLossChart;
    case MetricType.PerformanceEvaluation:
      return PerformanceEvaluationChart;
    default:
      return null;
  }
}

function getChartData(type: MetricType) {
  switch (type) {
    case MetricType.LearningRate:
    case MetricType.TrainingLoss:
      return props.metrics.train_metrics.filter((metric) => props.selectedKeys.includes(metric.finetune_name));
    case MetricType.ValidationLoss:
    case MetricType.PerformanceEvaluation:
      return props.metrics.eval_metrics.filter((metric) => props.selectedKeys.includes(metric.finetune_name));
    default:
      return [];
  }
}
</script>

<style lang="scss" scoped>
.job-chart {
  flex-grow: 1;
  width: 0;
  padding: 20px;
}
</style>
