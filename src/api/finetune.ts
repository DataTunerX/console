import { K8sClient } from '@/plugins/axios/client';
import { ObjectMeta } from 'kubernetes-types/meta/v1';
import { Parameters } from './hyperparameter';
/* eslint-disable no-use-before-define */

/**
 * Finetune is the Schema for the finetunes API
 */
export interface Finetune {
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
   * FinetuneSpec defines the desired state of Finetune
   */
  spec?: Spec;
  /**
   * FinetuneStatus defines the observed state of Finetune
   */
  status?: Status;
}

/**
 * FinetuneSpec defines the desired state of Finetune
 */
export interface Spec {
  /**
   * Dataset specifies the dataset CR used for fine-tuning.
   */
  dataset: string;
  /**
   * Hyperparameter specifies the hyperparameter CR used for fine-tuning.
   */
  hyperparameter?: Hyperparameter;
  image?: Image;
  /**
   * LLM specifies the large model CR used for fine-tuning.
   */
  llm: string;
  node?: number;
  /**
   * Resource specifies the resource configuration for fine-tuning.
   */
  resource?: Resource;
}

/**
 * Hyperparameter specifies the hyperparameter CR used for fine-tuning.
 */
export interface Hyperparameter {
  hyperparameterRef?: string;
  overrides?: Partial<Parameters>;
  parameters?: Partial<Parameters>;
}

export interface Image {
  /**
   * ImagePullPolicy describes a policy for if/when to pull a container image.
   */
  imagePullPolicy?: ImagePullPolicy;
  /**
   * Name describe the image name.
   */
  name: string;
  /**
   * Path description of the model file path.
   */
  path?: string;
}

/**
 * ImagePullPolicy describes a policy for if/when to pull a container image.
 */
export enum ImagePullPolicy {
  Always = 'Always',
  IfNotPresent = 'IfNotPresent',
  Never = 'Never',
}

/**
 * Resource specifies the resource configuration for fine-tuning.
 */
export interface Resource {
  /**
   * Limits specifies the resource limits.
   */
  limits: Limits;
  /**
   * ResourceLimits represents the resource limits for a task.
   */
  requests: Requests;
}

/**
 * Limits specifies the resource limits.
 */
export interface Limits {
  /**
   * CPU specifies the CPU resource limit.
   */
  cpu: CPU;
  /**
   * GPU specifies the GPU resource limit.
   */
  gpu: string;
  /**
   * Memory specifies the memory resource limit.
   */
  memory: CPU;
}

export type CPU = number | string;

/**
 * ResourceLimits represents the resource limits for a task.
 */
export interface Requests {
  /**
   * CPU specifies the CPU resource limit.
   */
  cpu: CPU;
  /**
   * GPU specifies the GPU resource limit.
   */
  gpu: string;
  /**
   * Memory specifies the memory resource limit.
   */
  memory: CPU;
}

/**
 * FinetuneStatus defines the observed state of Finetune
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

const apiVersion = 'finetune.datatunerx.io/v1beta1';
const kind = 'Finetune';

export const finetuneClient = new K8sClient<Finetune>(apiVersion, kind);
