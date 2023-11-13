import { reactive, ref, toRefs } from 'vue';
import {
  apiVersion, kind, FinetuneExperiment, finetuneExperimentClient,
} from '@/api/finetune-experiment';
import { FinetuneJob } from '@/api/finetune-job';
import { ScoringPlugin, scoringConfigClient } from '@/api/scoring-plugin';
import { LargeLanguageModel, largeLanguageModelClient } from '@/api/large-language-model';
import { ImagePullPolicy } from '@/api/finetune';

const defaultFinetuneExperiment: FinetuneExperiment = {
  apiVersion,
  kind,
  metadata: {
    name: '',
  },
  spec: {
    finetuneJobs: [],
    scoringConfig: {
      name: '',
    },
  },
};

export const useFinetuneExperiment = () => {
  const state = reactive({
    finetuneExperiment: defaultFinetuneExperiment,
    finetuneExperiments: [] as FinetuneExperiment[],
  });

  const fetchFinetuneExperiments = async (namespace: string) => {
    const res = await finetuneExperimentClient.list(namespace);

    state.finetuneExperiments = res.data.items;
  };

  return {
    ...toRefs(state),
    fetchFinetuneExperiments,
  };
};

export const useFinetuneJob = () => {
  const finetuneJob = ref<FinetuneJob>(
    {
      metadata: {
        name: '',
      },
      valid: true,
      spec: {
        finetune: {
          finetuneSpec: {
            image: {
              name: '',
              imagePullPolicy: ImagePullPolicy.IfNotPresent,
            },
            resource: {
              limits: {
                cpu: '2',
                gpu: '1',
                memory: '4Gi',
              },
              requests: {
                cpu: '2',
                gpu: '1',
                memory: '4Gi',
              },
            },
            dataset: '',
            llm: '',
            hyperparameter: {
              hyperparameterRef: '',
              overrides: {},
              parameters: {},
            },
          },
        },
        scoringConfig: {
          name: '',
        },
        serveConfig: {
          nodeSelector: 'arch=arm64',
        },
      },
    },

  );

  return { finetuneJob };
};

export const useScoringConfig = () => {
  const state = reactive({
    scoringConfigs: [] as ScoringPlugin[],
  });

  const fetchScoringConfigs = async (namespace: string) => {
    const res = await scoringConfigClient.list(namespace);

    state.scoringConfigs = res.data.items;
  };

  return {
    ...toRefs(state),
    fetchScoringConfigs,
  };
};

export const useLargeLanguageModel = () => {
  const state = reactive({
    largeLanguageModels: [] as LargeLanguageModel[],
  });

  const fetchLargeLanguageModels = async (namespace: string) => {
    const res = await largeLanguageModelClient.list(namespace);

    state.largeLanguageModels = res.data.items;
  };

  return {
    ...toRefs(state),
    fetchLargeLanguageModels,
  };
};
