/* eslint-disable no-use-before-define */
import { K8sClient } from '@/plugins/axios/client';
import { ObjectMeta } from 'kubernetes-types/meta/v1';
import { Spec as DatasetSpec } from './dataset';
import { Spec as HyperparameterSpec } from './hyperparameter';
import { Spec as LlmSpec } from './large-language-model';
import { ImagePullPolicy } from './finetune';
/**
 * LLMCheckpoint is the Schema for the llmcheckpoints API
 */
export interface LLMCheckpoint {
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
  kind?: 'LLMCheckpoint';
  metadata?: ObjectMeta;
  /**
   * LLMCheckpointSpec defines the desired state of LLMCheckpoint
   */
  spec?: Spec;
  /**
   * LLMCheckpointStatus defines the observed state of LLMCheckpoint
   */
  status?: Status;
}

/**
 * LLMCheckpointSpec defines the desired state of LLMCheckpoint
 */
export interface Spec {
  /**
   * Checkpoint specifies the checkpoint file.
   */
  checkpoint: string;
  /**
   * CheckpointImage specifies the checkpointImage info.
   */
  checkpointImage?: CheckpointImage;
  /**
   * Dataset specifies the dataset CR used for fine-tuning.
   */
  dataset: Dataset;
  /**
   * Hyperparameter specifies the hyperparameter CR used for fine-tuning.
   */
  hyperparameter: Hyperparameter;
  /**
   * Image specifies the image info used for fine-tuning.
   */
  image: Image;
  /**
   * LLM specifies the large model CR used for fine-tuning.
   */
  llm: Llm;
}

/**
 * CheckpointImage specifies the checkpointImage info.
 */
export interface CheckpointImage {
  /**
   * CheckPointPath description of the checkpoint file path.
   */
  checkPointPath?: string;
  /**
   * ImagePullPolicy describes a policy for if/when to pull a container image.
   */
  imagePullPolicy?: ImagePullPolicy;
  /**
   * LLMPath description of the model file path.
   */
  llmPath?: string;
  /**
   * Name describe the image name.
   */
  name: string;
}

/**
 * Dataset specifies the dataset CR used for fine-tuning.
 */
export interface Dataset {
  /**
   * DatasetRef describe the dataset ref.
   */
  datasetRef: string;
  /**
   * Spec describe the dataset spec.
   */
  spec: DatasetSpec;
}

/**
 * Hyperparameter specifies the hyperparameter CR used for fine-tuning.
 */
export interface Hyperparameter {
  /**
   * HyperparameterRef describe the hyperparameter ref.
   */
  hyperparameterRef: string;
  /**
   * Spec describe the hyperparameter spec.
   */
  spec: HyperparameterSpec;
}

/**
 * Image specifies the image info used for fine-tuning.
 */
export interface Image {
  /**
   * ImagePullPolicy describes a policy for if/when to pull a container image.
   */
  imagePullPolicy?: ImagePullPolicy;
  /**
   * Name describe the image name.
   */
  name?: string;
  /**
   * Path description of the model file path.
   */
  path?: string;
}

/**
 * LLM specifies the large model CR used for fine-tuning.
 */
export interface Llm {
  /**
   * LLMRef describe the llm ref.
   */
  llmRef: string;
  /**
   * Spec describe the llm spec.
   */
  spec: LlmSpec;
}

/**
 * LLMCheckpointStatus defines the observed state of LLMCheckpoint
 */
export interface Status {
  state: State;
}

export enum State {
  Failed = 'FAILED',
  Init = 'INIT',
  Pending = 'PENDING',
  Running = 'RUNNING',
  Successful = 'SUCCESSFUL',
}

export const kind = 'LLMCheckpoint';
export const apiVersion = 'core.datatunerx.io/v1beta1';

export const llmCheckpointClient = new K8sClient<LLMCheckpoint>(apiVersion, kind);
