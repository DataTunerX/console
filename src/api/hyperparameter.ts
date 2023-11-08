/* eslint-disable no-use-before-define */
import type { ObjectMeta, ListMeta } from 'kubernetes-types/meta/v1';
import { K8sClient } from '@/plugins/axios/client';

export enum FineTuningType {
  // SFT：生成模型GPT的有监督精调 (supervised fine-tuning)
  SFT = 'SFT',
}

// 定义 Quantization 常量
export enum Quantization {
  default= 'default',
  int4= 'int4',
  int8= 'int8'
}

export interface HyperparameterList {
  apiVersion: string;
  items: Hyperparameter[];
  kind: string;
  metadata: ListMeta;
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
  optimizer: Optimizer;
  /**
   * PEFT indicates whether to enable Performance Evaluation and Forecasting Tool.
   */
  PEFT: boolean;
  /**
   * Scheduler specifies the learning rate scheduler.
   */
  scheduler: Scheduler;
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

  quantization: Quantization;
}

/**
* Optimizer specifies the optimization algorithm.
*/
export enum Optimizer {
  Adam = 'Adam',
  AdamW = 'AdamW',
  Sgd = 'SGD',
}

/**
* Scheduler specifies the learning rate scheduler.
*/
export enum Scheduler {
  Constant = 'Constant',
  Cosine = 'Cosine',
  Linear = 'Linear',
}

/**
 * TrainerType specifies the type of trainer to use.
 */
export enum TrainerType {
  Standard = 'Standard',
}

export type StringParameters = Pick<
  Parameters,
  'learningRate' | 'loRA_Alpha' | 'loRA_Dropout' | 'loRA_R' | 'warmupRatio' | 'weightDecay'
>;

const apiVersion = 'core.datatunerx.io/v1beta1';
const kind = 'Hyperparameter';

export const hyperparameterClient = new K8sClient<Hyperparameter>(apiVersion, kind);
