import {
  Hyperparameter,
  FineTuningType,
  Scheduler,
  Optimizer,
  TrainerType,
  Quantization,
  hyperparameterClient,
  Parameters,
} from '@/api/hyperparameter';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';
import { nError } from '@/utils/useNoty';
import { createDialog } from '@dao-style/extend';

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
      PEFT: true,
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
      const { data } = await hyperparameterClient.read(namespace, name);

      state.hyperparameter = data;
    } catch (error) {
      nError(
        t('common.notyError', {
          name: t('common.fetch'),
          action: t('views.Hyperparameter.hyperparameterGroup'),
        }),
        error,
      );
    }
  };

  // 获取指定命名空间的超参数列表
  const fetchHyperparameters = async (namespace: string) => {
    try {
      state.loading = true;
      const { data } = await hyperparameterClient.list(namespace);

      state.hyperparameters = data.items;
    } catch (error) {
      nError(
        t('common.notyError', {
          name: t('common.fetch'),
          action: t('views.Hyperparameter.hyperparameterGroupList'),
        }),
        error,
      );
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

export const retrieveQuantization = (parameters: Parameters) => {
  let quantizationValue = Quantization.default;

  if (parameters.int4) {
    quantizationValue = Quantization.int4;
  } else if (parameters.int8) {
    quantizationValue = Quantization.int8;
  }

  return quantizationValue;
};

export function useDeleteHyperparameter(namespace: Ref<string>, handleRefresh: () => void) {
  const { t } = useI18n();

  const deleteFn = (name: string) => hyperparameterClient.delete(namespace.value, name);

  const onConfirmDelete = async (name?: string) => {
    const dialog = createDialog(ConfirmDeleteDialog);

    await dialog.show({
      header: t('views.Hyperparameter.delete.header'),
      content: t('views.Hyperparameter.delete.content', { name }),
      name,
      deleteFn,
    });

    handleRefresh();
  };

  return {
    onConfirmDelete,
  };
}
