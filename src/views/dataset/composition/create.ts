import { type Dataset, getDataset } from '@/api/dataset';
import { SizeType, LicenseType } from '@/types/createDataset';
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
        source: 's3://example-dataset/source',
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
                  file: 's3://example-dataset/test',
                },
                train: {
                  file: 's3://example-dataset/train',
                },
                validate: {
                  file: 's3://example-dataset/validate',
                },
              },
            },
            {
              name: 'Additional Subset',
            },
          ],
        },
        languages: ['中文'],
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
            {
              name: 'English to French',
            },
            {
              name: 'English to Spanish',
            },
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
