import { KeyValue } from '@/types/common';
import {
  DatasetMetadata, Spec, Dataset, Plugin,
} from './dataset';

export type PluginForRender = Omit<Plugin, 'parameters'> & { parameters?: KeyValue };

export type DatasetMetadataForRender = Omit<DatasetMetadata, 'plugin'> & {
  plugin: PluginForRender;
};

export type SpecWithModifiedDatasetMetadata = Omit<Spec, 'datasetMetadata'> & {
  datasetMetadata: DatasetMetadataForRender;
};

export type DatasetForRender = Omit<Dataset, 'spec'> & { spec: SpecWithModifiedDatasetMetadata };

export function convertDatasetForRender(dataset: Dataset): DatasetForRender {
  // 创建一个新的 DatasetMetadata 对象，其中 plugin 属性已经被替换为 pluginForRender
  let pluginForRender: PluginForRender = {
    loadPlugin: false,
  };

  if (dataset.spec?.datasetMetadata.plugin) {
    pluginForRender = {
      ...dataset.spec.datasetMetadata.plugin,
      parameters: JSON.parse(dataset.spec.datasetMetadata.plugin.parameters || '{}'),

    };
  }

  const datasetMetadataForBackend: DatasetMetadataForRender = {
    ...dataset.spec?.datasetMetadata,
    plugin: pluginForRender,
  };

  // 创建一个新的 Spec 对象，其中 datasetMetadata 属性已经被替换为 datasetMetadataForBackend
  const specForBackend: SpecWithModifiedDatasetMetadata = {
    ...dataset.spec,
    datasetMetadata: datasetMetadataForBackend,
  };

  // 创建一个新的 DatasetForBackend 对象，其中 spec 属性已经被替换为 specForBackend
  const datasetForRender: DatasetForRender = {
    ...dataset,
    spec: specForBackend,
  };

  return datasetForRender;
}

export function convertDatasetForPost(datasetForRender: DatasetForRender): Dataset {
  // 创建一个新的 Plugin 对象，其中 parameters 属性已经被转换为 KeyValue
  const plugin: Plugin = {
    ...datasetForRender.spec.datasetMetadata.plugin,
    parameters: JSON.stringify(datasetForRender.spec.datasetMetadata.plugin.parameters),
  };

  // 创建一个新的 DatasetMetadata 对象，其中 plugin 属性已经被替换为 plugin
  const datasetMetadata: DatasetMetadata = {
    ...datasetForRender.spec.datasetMetadata,
    plugin,
  };

  // 创建一个新的 Spec 对象，其中 datasetMetadata 属性已经被替换为 datasetMetadata
  const spec: Spec = {
    ...datasetForRender.spec,
    datasetMetadata,
  };

  // 创建一个新的 Dataset 对象，其中 spec 属性已经被替换为 spec
  const dataset: Dataset = {
    ...datasetForRender,
    spec,
  };

  return dataset;
}
