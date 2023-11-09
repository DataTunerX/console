import { reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  Hyperparameter,
  FineTuningType,
  Scheduler,
  Optimizer,
  TrainerType,
  Quantization,
  hyperparameterClient,
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
      scheduler: Scheduler.Cosine,
      optimizer: Optimizer.AdamW,
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
      trainerType: TrainerType.Standard,
      PEFT: false,
      FP16: false,
      quantization: Quantization.default,
    },
  },
};

export const useHyperparameter = () => {
  const { t } = useI18n();
  const state = reactive({
    hyperparameter: { ...defaultHyperparameter }, // 使用对象复制以防止修改默认对象
    hyperparameters: [] as Hyperparameter[],
    loading: false,
  });

  // 获取指定命名空间和名称的超参数
  const fetchHyperparameter = async (namespace: string, name: string) => {
    try {
      const res = await hyperparameterClient.read(namespace, name);

      state.hyperparameter = res.data;
    } catch (error) {
      nError(t('common.notyError', {
        name: t('common.fetch'),
        action: t('views.hyperparameter.hyperparameterGroup'),
      }), error);
    }
  };

  // 获取指定命名空间的超参数列表
  const fetchHyperparameters = async (namespace: string) => {
    try {
      state.loading = true;
      const res = await hyperparameterClient.list(namespace);

      state.hyperparameters = res.data.items;
    } catch (error) {
      nError(t('common.notyError', {
        name: t('common.fetch'),
        action: t('views.hyperparameter.hyperparameterGroupList'),
      }), error);
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
