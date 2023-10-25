/* eslint-disable no-use-before-define */
/* eslint-disable max-len */

import httpClient from '@/plugins/request';
import type { ObjectMeta } from 'kubernetes-types/meta/v1';

export interface DatasetList {
  apiVersion: string
  items: Dataset[]
  kind: string
  metadata: ObjectMeta
}

export interface Dataset {
  apiVersion: string;
  kind: string;
  metadata: ObjectMeta;
  spec: Spec;
}

export interface Spec {
  datasetMetadata: DatasetMetadata;
  datasetCard: DatasetCard;
  datasetFiles: DatasetFiles;
}

export interface DatasetMetadata {
  languages: string[];
  tags: string[];
  license: string;
  size: string;
  task: Task;
  datasetInfo: DatasetInfo;
  loadPlugin: boolean;
  plugin: Plugin;
}

export interface Task {
  name: string;
  subTasks: SubTask[];
}

export interface SubTask {
  name: string;
}

export interface DatasetInfo {
  subsets: Subset[];
  features: Feature[];
}

export interface Subset {
  name: string;
  splits?: Splits;
}

export interface Splits {
  train: File;
  test: File;
  validate: File;
}

export interface File {
  file: string;
}

export interface Feature {
  name: string;
  dataType: string;
  mapTo: string;
}

export interface Plugin {
  name: string;
  parameters: string;
}

export interface DatasetCard {
  datasetCardRef: string;
}

export interface DatasetFiles {
  source: string;
}

const apiVersion = 'extension.datatunerx.io/v1beta1';

export const createDataset = (namespace: string, dataset: Dataset) => httpClient.post<Dataset>(`/apis/${apiVersion}/namespaces/${namespace}/datasets`, dataset);

export const updateDataset = (namespace: string, dataset: Dataset) => httpClient.put<Dataset>(`/apis/${apiVersion}/namespaces/${namespace}/datasets/${dataset.metadata.name}`, dataset);

export const listDatasets = (namespace: string) => httpClient.get<DatasetList>(`/apis/${apiVersion}/namespaces/${namespace}/datasets`);

export const getDataset = (namespace: string, name: string) => httpClient.get<Dataset>(`/apis/${apiVersion}/namespaces/${namespace}/datasets/${name}`);

export const deleteDataset = (namespace: string, name: string) => httpClient.delete<DatasetList>(`/apis/${apiVersion}/namespaces/${namespace}/datasets/${name}`);

export default {
  createDataset,
  updateDataset,
  listDatasets,
  getDataset,
  deleteDataset,
};
