/* eslint-disable no-use-before-define */
import { Condition, ObjectMeta } from 'kubernetes-types/meta/v1';
import { Spec as FinetuneSpec, State as FinetuneState } from './finetune';
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
  valid?: boolean
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
   * FinetuneSpec defines the desired state of Finetune
   */
  finetuneSpec: FinetuneSpec;
  name?: string;
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
  conditions?: Condition[];
  finetuneState?: FinetuneState;
  result?: Result;
  state: State;
  stats?: string;
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
