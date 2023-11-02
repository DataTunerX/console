/* eslint-disable no-use-before-define */
import { K8sClient } from '@/plugins/axios/client';
import type { ObjectMeta, ListMeta } from 'kubernetes-types/meta/v1';

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
  metadata: ListMeta;
}

/**
 * Dataset is the Schema for the datasets API
 */
export interface Dataset {
  /**
   * APIVersion defines the versioned schema of this representation of an object. Servers
   * should convert recognized schemas to the latest internal value, and may reject
   * unrecognized values. More info:
   * https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
   */
  apiVersion?: string;
  /**
   * Kind is a string value representing the REST resource this object represents. Servers may
   * infer this from the endpoint the client submits requests to. Cannot be updated. In
   * CamelCase. More info:
   * https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
   */
  kind?: string;
  metadata?: ObjectMeta;
  /**
   * DatasetSpec defines the desired state of Dataset
   */
  spec?: Spec;
  /**
   * DatasetStatus defines the observed state of Dataset
   */
  status?: Status;
}

/**
* DatasetSpec defines the desired state of Dataset
*/
export interface Spec {
  /**
   * DatasetCard defines a dataset's readme, in type of markdown
   */
  datasetCard?: DatasetCard;
  /**
   * DatasetFiles defines a dataset's source file address
   */
  datasetFiles?: DatasetFiles;
  /**
   * INSERT ADDITIONAL SPEC FIELDS - desired state of cluster Important: Run "make" to
   * regenerate code after modifying this file
   */
  datasetMetadata: DatasetMetadata;
}

/**
* DatasetCard defines a dataset's readme, in type of markdown
*/
export interface DatasetCard {
  datasetCardRef?: string;
}

/**
* DatasetFiles defines a dataset's source file address
*/
export interface DatasetFiles {
  source?: string;
}

/**
* INSERT ADDITIONAL SPEC FIELDS - desired state of cluster Important: Run "make" to
* regenerate code after modifying this file
*/
export interface DatasetMetadata {
  /**
   * DatasetInfo defines the dataset description include subsets and features
   */
  datasetInfo?: DatasetInfo;
  languages?: string[];
  license?: string;
  /**
   * Plugin defines a plugin used by a dataset
   */
  plugin?: Plugin;
  size?: string;
  tags?: string[];
  /**
   * Task defines a dataset task type
   */
  task?: Task;
}

/**
* DatasetInfo defines the dataset description include subsets and features
*/
export interface DatasetInfo {
  features?: Feature[];
  subsets?: Subset[];
}

/**
* Feature defines a dataset's column name as a feature and its data type and relationship
* to finetune feature fields
*/
export interface Feature {
  dataType?: string;
  mapTo?: string;
  name?: FeatureName;
}

export enum FeatureName {
  Instruction = 'instruction',
  Response = 'response',
}

/**
* Subset defines a dataset‘s subset
*/
export interface Subset {
  name?: string;
  /**
   * Splits defines a dataset's train-splits, test-splits, validate-splits address info
   */
  splits?: Splits;
}

/**
* Splits defines a dataset's train-splits, test-splits, validate-splits address info
*/
export interface Splits {
  /**
   * Test defines a dataset's subsets' test-splits file address
   */
  test?: Test;
  /**
   * Train defines a dataset's subsets' train-splits file address
   */
  train?: Train;
  /**
   * Validate defines a dataset's subsets' validate-splits file address
   */
  validate?: Validate;
}

/**
* Test defines a dataset's subsets' test-splits file address
*/
export interface Test {
  file?: string;
}

/**
* Train defines a dataset's subsets' train-splits file address
*/
export interface Train {
  file?: string;
}

/**
* Validate defines a dataset's subsets' validate-splits file address
*/
export interface Validate {
  file?: string;
}

/**
* Plugin defines a plugin used by a dataset
*/
export interface Plugin {
  loadPlugin: boolean;
  name?: string;
  parameters?: string;
}

/**
* Task defines a dataset task type
*/
export interface Task {
  name?: string;
  subTasks?: SubTask[];
}

/**
* EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN! NOTE: json tags are required.  Any
* new fields you add must have json tags for the fields to be serialized. SubTask defines a
* dataset task's subtask
*/
export interface SubTask {
  name?: string;
}

/**
* DatasetStatus defines the observed state of Dataset
*/
export interface Status {
  /**
   * INSERT ADDITIONAL STATUS FIELD - define observed state of cluster Important: Run "make"
   * to regenerate code after modifying this file
   */
  state?: string;
}

const apiVersion = 'extension.datatunerx.io/v1beta1';
const kind = 'Dataset';

export const datasetClient = new K8sClient<Dataset>(apiVersion, kind);
