/* eslint-disable no-use-before-define */
import { Condition, ObjectMeta } from 'kubernetes-types/meta/v1';
/**
 * FinetuneJob is the Schema for the finetunejobs API
 */
export interface FinetuneJob {
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
   * FinetuneJobSpec defines the desired state of FinetuneJob
   */
  spec?: Spec;
  /**
   * FinetuneJobStatus defines the observed state of FinetuneJob
   */
  status?: Status;
}

/**
* FinetuneJobSpec defines the desired state of FinetuneJob
*/
export interface Spec {
  /**
   * Finetune cr config.
   */
  finetune: Finetune;
  /**
   * Score plugin config.
   */
  scoringConfig?: ScoringConfig;
  /**
   * Serve config.
   */
  serveConfig: ServeConfig;
}

/**
* Finetune cr config.
*/
export interface Finetune {
  /**
   * Dataset specifies the dataset CR used for fine-tuning.
   */
  dataset: string;
  /**
   * Hyperparameter specifies the hyperparameter CR used for fine-tuning.
   */
  hyperparameter: string;
  /**
   * LLM specifies the large model CR used for fine-tuning.
   */
  llm: string;
  name?: string;
  /**
   * Resource specifies the resource configuration for fine-tuning.
   */
  resource?: Resource;
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
* Score plugin config.
*/
export interface ScoringConfig {
  /**
   * Name specifies the name of the scoring CR.
   */
  name: string;
}

/**
* Serve config.
*/
export interface ServeConfig {
  /**
   * NodeSelector specifies the node where service will be deployed.
   */
  nodeSelector: string;
  /**
   * Tolerations specifies the tolerations for service.
   */
  tolerations?: string;
}

/**
* FinetuneJobStatus defines the observed state of FinetuneJob
*/
export interface Status {
  conditions: Condition[];
  result: Result;
  state: State;
  /**
   * todo FinetuneState
   */
  stats: string;
}

export interface Result {
  dashboard: string;
  image: string;
  modelExportResult: boolean;
  serve: string;
}

export enum State {
  Buildimage = 'BUILDIMAGE',
  Failed = 'FAILED',
  Finetune = 'FINETUNE',
  Init = 'INIT',
  Serve = 'SERVE',
  Successful = 'SUCCESSFUL',
}
