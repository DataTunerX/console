import { reactive, toRefs } from 'vue';
import {
  Hyperparameter,
  FineTuningType,
  SchedulerType,
  OptimizerType,
  TrainerType,
  getHyperparameter,
  listHyperparameters,
} from '@/api/hyperparameter';
import { nError } from '@/utils/useNoty';

// 定义默认的超参数对象
const defaultHyperparameter: Hyperparameter = {
  apiVersion: 'core.datatunerx.io/v1beta1',
  kind: 'Hyperparameter',
  metadata: {
    name: 'hyperparameter',
  },
  spec: {
    objective: {
      type: FineTuningType.SFT,
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
      quantization: 'int4',
    },
  },
};

export const useHyperparameter = () => {
  const state = reactive({
    hyperparameter: { ...defaultHyperparameter }, // 使用对象复制以防止修改默认对象
    hyperparameters: [] as Hyperparameter[],
    loading: false,
  });

  // 获取指定命名空间和名称的超参数
  const fetchHyperparameter = async (namespace: string, name: string) => {
    try {
      const res = await getHyperparameter(namespace, name);

      state.hyperparameter = res.data;
    } catch (error) {
      nError('获取超参数失败', error);
    }
  };

  // 获取指定命名空间的超参数列表
  const fetchHyperparameters = async (namespace: string) => {
    try {
      state.loading = true;
      const res = await listHyperparameters(namespace);

      state.hyperparameters = res.data.items;
    } catch (error) {
      nError('获取超参数列表失败', error);
    } finally {
      state.loading = false;
    }
  };

  return {
    ...toRefs(state),
    fetchHyperparameter,
    fetchHyperparameters,
  };
};
