/* eslint-disable no-use-before-define */
import type { ObjectMeta } from 'kubernetes-types/meta/v1';
import httpClient from '@/plugins/request';

export interface HyperparameterList {
  apiVersion: string
  items: Hyperparameter[]
  kind: string
  metadata: ObjectMeta
}

/**
 * Hyperparameter is the Schema for the hyperparameters API
 */
export interface Hyperparameter {
  /**
   * APIVersion defines the versioned schema of this representation of an object. Servers
   * should convert recognized schemas to the latest internal value, and may reject
   * unrecognized values. More info:
   * https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
   */
  apiVersion: string;
  /**
   * Kind is a string value representing the REST resource this object represents. Servers may
   * infer this from the endpoint the client submits requests to. Cannot be updated. In
   * CamelCase. More info:
   * https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
   */
  kind: string;
  metadata: ObjectMeta;
  /**
   * HyperparameterSpec defines the desired state of Hyperparameter
   */
  spec: Spec;
}

/**
 * HyperparameterSpec defines the desired state of Hyperparameter
 */
export interface Spec {
  /**
   * Over-senator adjustments to achieve targets.
   */
  objective: Objective;
  /**
   * Finetune paramenter config.
   */
  parameters: Parameters;
}

/**
 * Over-senator adjustments to achieve targets.
 */
export interface Objective {
  /**
   * The type (Type) of fine-tuning may refer to a specific method or strategy of
   * hyperparameter tuning. Common hyperparameter tuning methods include: 1. Grid Search 2.
   * Random Search 3. Bayesian Optimisation 4. Genetic Algorithms 5. Hyperband et al.
   */
  type: string;
}

/**
 * Finetune paramenter config.
 */
export interface Parameters {
  /**
   * BatchSize specifies the size of mini-batches.
   */
  batchSize: number;
  /**
   * BlockSize specifies the block size.
   */
  blockSize: number;
  /**
   * Epochs specifies the number of training epochs.
   */
  epochs: number;
  /**
   * FP16 indicates whether to use 16-bit floating point precision.
   */
  FP16: boolean;
  /**
   * GradAccSteps specifies the number of gradient accumulation steps.
   */
  gradAccSteps: number;
  /**
   * Int4 indicates whether to use 4-bit integer quantization.
   */
  int4: boolean;
  /**
   * Int8 indicates whether to use 8-bit integer quantization.
   */
  int8: boolean;
  /**
   * LearningRate specifies the initial learning rate.
   */
  learningRate: string;
  /**
   * LoRA_Alpha represents the alpha parameter for Localized Receptive Attention.
   */
  loRA_Alpha: string;
  /**
   * LoRA_Dropout specifies the dropout rate for Localized Receptive Attention.
   */
  loRA_Dropout: string;
  /**
   * LoRA_R represents the radius parameter for Localized Receptive Attention.
   */
  loRA_R: string;
  /**
   * Optimizer specifies the optimization algorithm.
   */
  optimizer: string;
  /**
   * PEFT indicates whether to enable Performance Evaluation and Forecasting Tool.
   */
  PEFT: boolean;
  /**
   * Scheduler specifies the learning rate scheduler.
   */
  scheduler: string;
  /**
   * TrainerType specifies the type of trainer to use.
   */
  trainerType: string;
  /**
   * WarmupRatio specifies the ratio of warmup steps.
   */
  warmupRatio: string;
  /**
   * WeightDecay specifies the weight decay factor.
   */
  weightDecay: string;
}

const apiVersion = 'core.datatunerx.io/v1beta1';
const pathTemplate = `/apis/${apiVersion}/namespaces/{namespace}/hyperparameters`;

const path = (namespace: string) => `${pathTemplate.replace('{namespace}', encodeURIComponent(String(namespace)))}}`;

export const listDatasets = (namespace: string) => httpClient.get<HyperparameterList>(path(namespace));

export const createDataset = (namespace: string, dataset: Hyperparameter) => httpClient.post<Hyperparameter>(path(namespace), dataset);

export const updateDataset = (namespace: string, dataset: Hyperparameter) => {
  const url = `${path(namespace)}/${dataset.metadata.name}`;

  return httpClient.put<Hyperparameter>(url, dataset);
};

export const getDataset = (namespace: string, name: string) => httpClient.get<Hyperparameter>(`${path(namespace)}/${name}`);

export const deleteDataset = (namespace: string, name: string) => httpClient.delete<HyperparameterList>(`${path(namespace)}/${name}`);

export default {
  createDataset,
  updateDataset,
  listDatasets,
  getDataset,
  deleteDataset,
};
