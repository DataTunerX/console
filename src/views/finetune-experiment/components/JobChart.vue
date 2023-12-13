<script lang="ts" setup>
import LearningRateChart from '@/components/charts/LearningRateChart.vue';
import PerformanceEvaluationChart from '@/components/charts/PerformanceEvaluationChart.vue';
import TrainLossChart from '@/components/charts/TrainingLossChart.vue';
import ValidationLossChart from '@/components/charts/ValidationLossChart.vue';

enum MetricType {
  LearningRate = 'learning_rate',
  TrainingLoss = 'training_loss',
  ValidationLoss = 'validation_loss',
  PerformanceEvaluation = 'performance_evaluation',
}

const metricTypes: { label: string; value: MetricType }[] = [
  {
    label: 'Learning Rate',
    value: MetricType.LearningRate,
  },
  {
    label: 'Training Loss',
    value: MetricType.TrainingLoss,
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

const metricType = ref(MetricType.LearningRate);
</script>

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
    <learning-rate-chart v-if="metricType === MetricType.LearningRate" />
    <train-loss-chart v-if="metricType === MetricType.TrainingLoss" />
    <validation-loss-chart v-if="metricType === MetricType.ValidationLoss" />
    <performance-evaluation-chart v-if="metricType === MetricType.PerformanceEvaluation" />
  </div>
</template>

<style lang="scss" scoped>
.job-chart {
  flex-grow: 1;
  padding: 15px;
}

</style>
