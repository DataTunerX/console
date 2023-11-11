import { Dataset, DatasetForBackend } from '@/api/dataset';
import { convertDatasetFromBackendFormat, convertDatasetToBackendFormat } from '@/api/dataset-for-backend';

describe('convertDatasetToBackendFormat', () => {
  it('should convert Dataset to DatasetForBackend', () => {
    // 创建一个 Dataset 对象
    const dataset: Dataset = {
      spec: {
        datasetMetadata: {
          plugin: {
            loadPlugin: true,
            name: 'test',
            parameters: {
              key: 'value',
            },
          },
        },
      },
    };

    // 调用函数
    const result = convertDatasetToBackendFormat(dataset);

    // 检查结果
    expect(result).toEqual({
      spec: {
        datasetMetadata: {
          plugin: {
            loadPlugin: true,
            name: 'test',
            parameters: JSON.stringify({
              key: 'value',
            }),
          },
        },
      },
    });
  });
});

describe('convertDatasetFromBackendFormat', () => {
  it('should convert DatasetForBackend to Dataset', () => {
    // 创建一个 DatasetForBackend 对象
    const datasetForBackend: DatasetForBackend = {
      spec: {
        datasetMetadata: {
          plugin: {
            loadPlugin: true,
            name: 'test',
            parameters: JSON.stringify({
              key: 'value',
            }),
          },
        },
      },
    };

    // 调用函数
    const result = convertDatasetFromBackendFormat(datasetForBackend);

    // 检查结果
    expect(result).toEqual({
      spec: {
        datasetMetadata: {
          plugin: {
            loadPlugin: true,
            name: 'test',
            parameters: {
              key: 'value',
            },
          },
        },
      },
    });
  });
});
