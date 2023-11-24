/* eslint-disable no-use-before-define */
import { K8sClient } from '@/plugins/axios/client';
import { ObjectMeta } from 'kubernetes-types/meta/v1';

export const Theme = 'green-ecology';

/**
 * LLM is the Schema for the llms API
 */
export interface LargeLanguageModel {
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
   * LLMSpec defines the desired state of LLM
   */
  spec?: Spec;
}

/**
 * LLMSpec defines the desired state of LLM
 */
export interface Spec {
  /**
   * Describe readme information for llm.
   */
  llmCard?: LlmCard;
  /**
   * Describe file information for llm.
   */
  llmFiles?: LlmFiles;
  /**
   * Describe metadata information for llm.
   */
  llmMetdata: LlmMetdata;
}

/**
 * Describe readme information for llm.
 */
export interface LlmCard {
  /**
   * Readme information of the model, parsed in markdown format, is presented as information
   * on the model page to help model users understand the model and use it correctly. Describe
   * references to readme files mounted by configmap.
   */
  llmCardRef?: string;
}

/**
 * Describe file information for llm.
 */
export interface LlmFiles {
  /**
   * Describe llm source file citation address.
   */
  source?: string;
}

/**
 * Describe metadata information for llm.
 */
export interface LlmMetdata {
  /**
   * Describe the llm on which the model was fine-tuned.
   */
  baseLlm?: string;
  /**
   * Describe Hardware and software information the llm's operation
   */
  computeInfrastructure?: ComputeInfrastructure;
  /**
   * Describe the datasets used in the llm.
   */
  datasets?: string[];
  /**
   * Describe the domain of the llm, the following fields are optional: 1. Multimodal 2.
   * ComputerVision 3. NLP 4. Audio 5. Tabular 6. ReinforcementLearning
   */
  domain?: Domain[];
  /**
   * Describe the AI framework used by the llm.
   */
  frameworks: string[];
  /**
   * Describe list of natural languages supported by the llm.
   */
  languages: string[];
  /**
   * Describe the open source licences to which the llm adheres.
   */
  license: string[];
  /**
   * Describe the llm image config.
   */
  llmImageConfig: LlmImageConfig;
  /**
   * Describe the name of the llm.
   */
  name: string;
  /**
   * Custom labels for llm.
   */
  tags?: string[];
  /**
   * Describe the types of tasks in the pipeline corresponding to the llm. example:
   * ... tasks: - feature-extraction - text-to-image ...
   */
  tasks: string[];
}

/**
 * Describe Hardware and software information the llm's operation
 */
export interface ComputeInfrastructure {
  /**
   * Describe the hardware information required for the llm to operate
   */
  hardware?: Hardware;
}

/**
 * Describe the hardware information required for the llm to operate
 */
export interface Hardware {
  /**
   * Description of the number of cpu cores needed for llm.
   */
  cpu: CPU;
  /**
   * Description of the memory size required by llm
   */
  memory: CPU;
  /**
   * Describes the size of the video memory required by the llm.
   */
  vRAM: CPU;
}

export type CPU = number | string;

export enum Domain {
  Audio = 'Audio',
  ComputerVision = 'ComputerVision',
  Multimodal = 'Multimodal',
  NLP = 'NLP',
  ReinforcementLearning = 'ReinforcementLearning',
  Tabular = 'Tabular',
}

/**
 * Describe the llm image config.
 */
export interface LlmImageConfig {
  image: string;
  path?: string;
}

export const apiVersion = 'core.datatunerx.io/v1beta1';
export const kind = 'LLM';

export const largeLanguageModelClient = new K8sClient<LargeLanguageModel>(apiVersion, kind);
