import { KeyValue } from '@/types/common';
import { ScoringConfig } from './finetune-job';
import { Spec, FinetuneExperiment } from './finetune-experiment';

export type ScoringConfigForRender = Omit<ScoringConfig, 'parameters'> & { parameters?: KeyValue };

export type SpecForRender = Omit<Spec, 'scoringConfig'> & { scoringConfig: ScoringConfigForRender };

export type FinetuneExperimentForRender = Omit<FinetuneExperiment, 'spec'> & { spec: SpecForRender };

export function convertFinetuneExperimentForRender(finetuneExperiment: FinetuneExperiment): FinetuneExperimentForRender {
  const { spec, ...otherProps } = finetuneExperiment;

  if (!spec) {
    throw new Error('Spec is undefined');
  }

  const { scoringConfig, ...otherSpecProps } = spec;

  if (!scoringConfig) {
    throw new Error('ScoringConfig is undefined');
  }

  const { parameters, ...otherScoringConfigProps } = scoringConfig;

  const scoringConfigForRender: ScoringConfigForRender = {
    ...otherScoringConfigProps,
    parameters: JSON.parse(parameters || '{}'),
  };

  const specForRender: SpecForRender = {
    ...otherSpecProps,
    scoringConfig: scoringConfigForRender,
  };

  return {
    ...otherProps,
    spec: specForRender,
  };
}

export function convertFinetuneExperimentForPost(finetuneExperimentForRender: FinetuneExperimentForRender): FinetuneExperiment {
  const { spec, ...otherProps } = finetuneExperimentForRender;
  const { scoringConfig, ...otherSpecProps } = spec;
  const { parameters, ...otherScoringConfigProps } = scoringConfig;

  const scoringConfigForPost: ScoringConfig = {
    ...otherScoringConfigProps,
    parameters: JSON.stringify(parameters),
  };

  const specForPost: Spec = {
    ...otherSpecProps,
    scoringConfig: scoringConfigForPost,
  };

  return {
    ...otherProps,
    spec: specForPost,
  };
}
