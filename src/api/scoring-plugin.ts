import { K8sClient } from '@/plugins/axios/client';
import { ObjectMeta, ListMeta } from 'kubernetes-types/meta/v1';
/* eslint-disable no-use-before-define */

export interface LlmList {
  apiVersion: string;
  items: ScoringPlugin[];
  kind: string;
  metadata: ListMeta;
}
/**
 * ScoringPlugin is the Schema for the scoringplugins API
 */
export interface ScoringPlugin {
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
   * ScoringPluginSpec defines the desired state of ScoringPlugin
   */
  spec?: Spec;
  /**
   * ScoringPluginStatus defines the observed state of ScoringPlugin
   */
  status?: Status;
}

/**
 * ScoringPluginSpec defines the desired state of ScoringPlugin
 */
export interface Spec {
  metrics?: string[];
  parameters?: string;
  scoringClass?: string;
  /**
   * INSERT ADDITIONAL SPEC FIELDS - desired state of cluster Important: Run "make" to
   * regenerate code after modifying this file
   */
  version?: string;
}

/**
 * ScoringPluginStatus defines the observed state of ScoringPlugin
 */
export interface Status {
  /**
   * INSERT ADDITIONAL STATUS FIELD - define observed state of cluster Important: Run "make"
   * to regenerate code after modifying this file
   */
  state?: string;
}

export const apiVersion = 'extension.datatunerx.io/v1beta1';
export const kind = 'ScoringPlugin';

export const BuildInScoringPlugin = 'BuildInScoringPlugin';

export const scoringConfigClient = new K8sClient<ScoringPlugin>(apiVersion, kind);
