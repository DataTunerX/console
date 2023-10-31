/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import httpClient from '@/plugins/request';
import type { ObjectMeta } from 'kubernetes-types/meta/v1';

export enum LicenseType {
  CCBY = 'CC BY',
  CCBY_SA = 'CC BY-SA',
  CCBY_ND = 'CC BY-ND',
  CCBY_NC = 'CC BY-NC',
  CCBY_NC_SA = 'CC BY-NC-SA',
  CCBY_NC_ND = 'CC BY-NC-ND',
  CC0 = 'CC0',
  ODC_PDDL = 'ODC-PDDL',
  ODC_BY = 'ODC-BY',
  ODC_ODbl = 'ODC-ODbl',
  CDLA_Permissive_2_0 = 'CDLA-Permissive-2.0',
  CDLA_Sharing_1_0 = 'CDLA-Sharing-1.0',
}

export enum SizeType {
  SIZE_1K = 'n < 1K',
  SIZE_10K = '1K < n < 10K',
  SIZE_100K = '10K < n < 100K',
  SIZE_1M = '100K < n < 1M',
  SIZE_10M = '1M < n < 10M',
  SIZE_100M = '10M < n < 100M',
  SIZE_1B = '100M < n < 1B',
  SIZE_GT_1B = 'n > 1B',
}

export enum LanguageOptions {
  zh = 'zh-CN',
  en = 'en-US',
}

export interface DatasetList {
  apiVersion: string;
  items: Dataset[];
  kind: string;
  metadata: ObjectMeta;
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
  loadPlugin: boolean;
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

export const updateDataset = (namespace: string, dataset: Dataset) => httpClient.put<Dataset>(
  `/apis/${apiVersion}/namespaces/${namespace}/datasets/${dataset.metadata.name}`,
  dataset,
);

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
