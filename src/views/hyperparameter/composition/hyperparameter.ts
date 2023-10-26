import { reactive, toRefs } from 'vue';
import { SchedulerType, OptimizerType, TrainerType } from '@/types/createHyperparameter';
import { Hyperparameter } from '@/api/hyperparameter';

const hyperparameter:Hyperparameter = {
  apiVersion: 'core.datatunerx.io/v1beta1',
  kind: 'Hyperparameter',
  metadata: {
    name: 'hyperparameter',
  },
  spec: {
    objective: {
      type: '',
    },
    parameters: {
      scheduler: SchedulerType.COSINE,
      optimizer: OptimizerType.ADAM,
      int4: false,
      int8: false,
      loRA_R: '4',
      loRA_Alpha: '32.0',
      loRA_Dropout: '0.1',
      learningRate: '0.001',
      epochs: 10,
      blockSize: 512,
      batchSize: 32,
      warmupRatio: '0.1',
      weightDecay: '0.0001',
      gradAccSteps: 1,
      trainerType: TrainerType.STANDARD,
      PEFT: false,
      FP16: false,
    },
  },
};

export const useHyperparameter = () => {
  const state = reactive({
    hyperparameter,
  });

  return {
    ...toRefs(state),
  };
};
