import {
  type Dataset,
  FeatureName,
  SizeType,
  LanguageOptions,
  datasetClient,
  TaskName,
} from '@/api/dataset';
import { reactive, ref, toRefs } from 'vue';
import { DatasetForRender, convertDatasetForRender } from '@/api/dataset-for-render';
import { createDialog } from '@dao-style/extend';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';
import { useI18n } from 'vue-i18n';

const initialValue: DatasetForRender = {
  apiVersion: 'extension.datatunerx.io/v1beta1',
  kind: 'Dataset',
  metadata: {
    name: 'example-dataset',
  },
  spec: {
    datasetCard: {
      datasetCardRef: 'configmap-dataset-readme',
    },
    datasetFiles: {
      source: '',
    },
    datasetMetadata: {
      datasetInfo: {
        features: [
          {
            dataType: 'string',
            mapTo: 'Content',
            name: FeatureName.Instruction,
          },
          {
            dataType: 'string',
            mapTo: 'Result',
            name: FeatureName.Response,
          },
        ],
        subsets: [
          {
            name: 'Default',
            splits: {
              test: {
                file: '',
              },
              train: {
                file: '',
              },
              validate: {
                file: '',
              },
            },
          },
        ],
      },
      languages: [LanguageOptions.zh],
      plugin: {
        loadPlugin: false,
        name: '',
      },
      size: SizeType.SIZE_1K,
      tags: [],
      task: {
        name: TaskName.TextGeneration,
        subTasks: [],
      },
    },
  },
};

export function useDataset() {
  const dataset = ref<DatasetForRender>(initialValue);

  const state = reactive({
    dataset,
    loading: false,
    datasets: [] as Dataset[],
  });

  const fetchDataset = async (namespace: string, name: string) => {
    await datasetClient.read(namespace, name).then(({ data }) => {
      state.dataset = convertDatasetForRender(data);
    });
  };

  const fetchDatasets = async (namespace: string) => {
    await datasetClient.list(namespace).then(({ data }) => {
      state.datasets = data.items;
    });
  };

  return {
    ...toRefs(state),
    fetchDataset,
    fetchDatasets,
  };
}

export function useDeleteDataset(namespace: string, handleRefresh: () => void) {
  const { t } = useI18n();

  const deleteFn = (name: string) => datasetClient.delete(namespace, name).then(() => {
    handleRefresh();
  });

  const onConfirmDelete = (name?: string) => {
    const dialog = createDialog(ConfirmDeleteDialog);

    return dialog.show({
      header: t('views.Dataset.delete.header'),
      content: t('views.Dataset.delete.content', { name }),
      name,
      deleteFn,
    });
  };

  return {
    onConfirmDelete,
  };
}
