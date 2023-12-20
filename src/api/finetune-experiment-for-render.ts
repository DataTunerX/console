import { KeyValue } from '@/types/common';
import { BuildInScoringPlugin } from './scoring-plugin';
import { ScoringPluginConfig } from './finetune-job';
import { Spec, FinetuneExperiment } from './finetune-experiment';

export type ScoringPluginConfigForRender = Omit<ScoringPluginConfig, 'parameters'> & {
  parameters?: KeyValue;
};

export type SpecForRender = Omit<Spec, 'scoringPluginConfig'> & {
  scoringPluginConfig: ScoringPluginConfigForRender;
};

export type FinetuneExperimentForRender = Omit<FinetuneExperiment, 'spec'> & {
  spec: SpecForRender;
};

export function convertFinetuneExperimentForRender(
  finetuneExperiment: FinetuneExperiment,
): FinetuneExperimentForRender {
  const { spec, ...otherProps } = finetuneExperiment;

  if (!spec) {
    throw new Error('Spec is undefined');
  }

  const { scoringPluginConfig, ...otherSpecProps } = spec;

  let scoringPluginConfigForRender: ScoringPluginConfigForRender = { };

  if (!scoringPluginConfig) {
    scoringPluginConfigForRender = {
      name: BuildInScoringPlugin,
    };
  } else {
    const { parameters, ...otherScoringPluginConfigProps } = scoringPluginConfig;

    scoringPluginConfigForRender = {
      ...otherScoringPluginConfigProps,
      parameters: JSON.parse(parameters || '{}'),
    };
  }

  const specForRender: SpecForRender = {
    ...otherSpecProps,
    scoringPluginConfig: scoringPluginConfigForRender,
  };

  return {
    ...otherProps,
    spec: specForRender,
  };
}

export function convertFinetuneExperimentForPost(
  finetuneExperimentForRender: FinetuneExperimentForRender,
): FinetuneExperiment {
  const { spec, ...otherProps } = finetuneExperimentForRender;
  const { scoringPluginConfig, ...otherSpecProps } = spec;

  let specForPost = {
    ...otherSpecProps,
  } as Spec;

  const { parameters, ...otherScoringPluginConfigProps } = scoringPluginConfig;

  let scoringPluginConfigForPost:ScoringPluginConfig | undefined = { };

  if (scoringPluginConfig.name === BuildInScoringPlugin) {
    scoringPluginConfigForPost = undefined;
  } else {
    scoringPluginConfigForPost = {
      ...otherScoringPluginConfigProps,
      parameters: JSON.stringify(parameters),
    };
  }

  specForPost = {
    ...specForPost,
    scoringPluginConfig: scoringPluginConfigForPost,
  };

  return {
    ...otherProps,
    spec: specForPost,
  };
}
