import { type Dataset, getDataset } from '@/api/dataset';
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
              name: 'instruction',
            },
            {
              dataType: 'string',
              mapTo: 'Result',
              name: 'response',
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
  });

  const fetchDataset = async (namespace: string, name: string) => {
    await getDataset(namespace, name).then((res) => {
      state.dataset = res.data;
    });
  };

  return {
    ...toRefs(state),
    fetchDataset,
  };
}
