/* eslint-disable no-use-before-define */
import type { Condition, ListMeta, ObjectMeta } from 'kubernetes-types/meta/v1';
import { K8sClient } from '@/plugins/axios/client';
import { ProcessedTrainMetrics } from './finetune-metrics';
import { FinetuneJob, Status as FinetuneJobStatus, ScoringPluginConfig } from './finetune-job';

export const Theme = 'canary';

export interface FinetuneExperimentList {
  apiVersion: string;
  items: FinetuneExperiment[];
  kind: string;
  metadata: ListMeta;
}

/**
 * FinetuneExperiment is the Schema for the finetuneexperiments API
 */
export interface FinetuneExperiment {
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
   * FinetuneExperimentSpec defines the desired state of FinetuneExperiment
   */
  spec?: Spec;
  /**
   * FinetuneExperimentStatus defines the observed state of FinetuneExperiment
   */
  status?: Status;
}

export type FinetuneJobWithName = FinetuneJob & { name: string };
export type FinetuneJobWithMetrics = FinetuneJobWithName & { metrics?: ProcessedTrainMetrics[] };

/**
 * FinetuneExperimentSpec defines the desired state of FinetuneExperiment
 */
export interface Spec {
  /**
   * Defining multiple finetunejobs in a single experiment.
   */
  finetuneJobs: FinetuneJobWithName[];
  /**
   * Define the scoring plugin used for this experiment.
   */
  scoringPluginConfig?: ScoringPluginConfig;
  pending?: boolean;
}

export type FinetuneJobStatusWithName = { status?: FinetuneJobStatus } & { name?: string };

/**
 * FinetuneExperimentStatus defines the observed state of FinetuneExperiment
 */
export interface Status {
  /**
   * Describe the highest scoring version of an experiment
   */
  bestVersion: BestVersion;
  conditions: Condition[];
  jobsStatus: FinetuneJobStatusWithName[];
  state: State;
  stats?: string;
}

/**
 * Describe the highest scoring version of an experiment
 */
export interface BestVersion {
  dataset: string;
  hyperparameter: string;
  image: string;
  llm: string;
  score: string;
}

export enum State {
  Failed = 'FAILED',
  Processing = 'PROCESSING',
  Success = 'SUCCESS',
  Pending = 'PENDING',
}

export const apiVersion = 'finetune.datatunerx.io/v1beta1';
export const kind = 'FinetuneExperiment';

export const finetuneExperimentClient = new K8sClient<FinetuneExperiment>(apiVersion, kind);
