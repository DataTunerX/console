import {
  Dataset,
  Plugin,
  DatasetMetadata,
  DatasetMetadataForBackend,
  PluginForBackend,
  Spec,
  SpecWithModifiedDatasetMetadata,
  DatasetForBackend,
} from './dataset';

export function convertDatasetToBackendFormat(dataset: Dataset): DatasetForBackend {
  // 创建一个新的 DatasetMetadata 对象，其中 plugin 属性已经被替换为 pluginForBackend
  let pluginForBackend: PluginForBackend = {
    loadPlugin: false,
  };

  if (dataset.spec?.datasetMetadata.plugin) {
    pluginForBackend = {
      ...dataset.spec.datasetMetadata.plugin,
      parameters: JSON.stringify(dataset.spec.datasetMetadata.plugin.parameters),
    };
  }

  const datasetMetadataForBackend: DatasetMetadataForBackend = {
    ...dataset.spec?.datasetMetadata,
    plugin: pluginForBackend,
  };

  // 创建一个新的 Spec 对象，其中 datasetMetadata 属性已经被替换为 datasetMetadataForBackend
  const specForBackend: SpecWithModifiedDatasetMetadata = {
    ...dataset.spec,
    datasetMetadata: datasetMetadataForBackend,
  };

  // 创建一个新的 DatasetForBackend 对象，其中 spec 属性已经被替换为 specForBackend
  const datasetForBackend: DatasetForBackend = {
    ...dataset,
    spec: specForBackend,
  };

  return datasetForBackend;
}

export function convertDatasetFromBackendFormat(datasetForBackend: DatasetForBackend): Dataset {
  // 创建一个新的 Plugin 对象，其中 parameters 属性已经被转换为 KeyValue
  const plugin: Plugin = {
    ...datasetForBackend.spec.datasetMetadata.plugin,
    parameters: JSON.parse(datasetForBackend.spec.datasetMetadata.plugin.parameters || '{}'),
  };

  // 创建一个新的 DatasetMetadata 对象，其中 plugin 属性已经被替换为 plugin
  const datasetMetadata: DatasetMetadata = {
    ...datasetForBackend.spec.datasetMetadata,
    plugin,
  };

  // 创建一个新的 Spec 对象，其中 datasetMetadata 属性已经被替换为 datasetMetadata
  const spec: Spec = {
    ...datasetForBackend.spec,
    datasetMetadata,
  };

  // 创建一个新的 Dataset 对象，其中 spec 属性已经被替换为 spec
  const dataset: Dataset = {
    ...datasetForBackend,
    spec,
  };

  return dataset;
}
