import { Dataset } from '@/api/dataset';
import { DatasetForRender, convertDatasetForPost, convertDatasetForRender } from '@/api/dataset-for-render';

describe('convertDatasetForPost', () => {
  it('should convert DatasetForRender to Dataset', () => {
    // 创建一个 Dataset 对象
    const datasetForRender: DatasetForRender = {
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
    const result = convertDatasetForPost(datasetForRender);

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

describe('convertDatasetForRender', () => {
  it('should convert Dataset to DatasetForRender', () => {
    // 创建一个 DatasetForBackend 对象
    const dataset: Dataset = {
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
    const result = convertDatasetForRender(dataset);

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
