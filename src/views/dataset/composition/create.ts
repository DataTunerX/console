import {
  type Dataset, FeatureName, datasetClient,
} from '@/api/dataset';
import { SizeType, LicenseType, LanguageOptions } from '@/api/dataset';
import { reactive, ref, toRefs } from 'vue';

export function useDataset() {
  const dataset = ref<Dataset>({
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
        license: LicenseType.CCBY,
        plugin: {
          loadPlugin: false,
          name: '',
          parameters: '{\n  "Param1": "value1",\n  "Param2": 42\n}\n',
        },
        size: SizeType.SIZE_1K,
        tags: ['NLP'],
        task: {
          name: 'Translation',
          subTasks: [
          ],
        },
      },
    },
  });

  const state = reactive({
    dataset,
    loading: false,
    datasets: [] as Dataset[],
  });

  const fetchDataset = async (namespace: string, name: string) => {
    await datasetClient.read(namespace, name).then((res) => {
      state.dataset = res.data;
    });
  };

  const fetchDatasets = async (namespace: string) => {
    await datasetClient.list(namespace).then((res) => {
      state.datasets = res.data.items;
    });
  };

  return {
    ...toRefs(state),
    fetchDataset,
    fetchDatasets,
  };
}
