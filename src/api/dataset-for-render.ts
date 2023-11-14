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

  const specForBackend: SpecWithModifiedDatasetMetadata = {
    ...dataset.spec,
    datasetMetadata: datasetMetadataForBackend,
  };

  const datasetForRender: DatasetForRender = {
    ...dataset,
    spec: specForBackend,
  };

  return datasetForRender;
}

export function convertDatasetForPost(datasetForRender: DatasetForRender): Dataset {
  const plugin: Plugin = {
    ...datasetForRender.spec.datasetMetadata.plugin,
    parameters: JSON.stringify(datasetForRender.spec.datasetMetadata.plugin.parameters),
  };

  const datasetMetadata: DatasetMetadata = {
    ...datasetForRender.spec.datasetMetadata,
    plugin,
  };

  const spec: Spec = {
    ...datasetForRender.spec,
    datasetMetadata,
  };

  const dataset: Dataset = {
    ...datasetForRender,
    spec,
  };

  return dataset;
}
