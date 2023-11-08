import { reactive, ref, toRefs } from 'vue';
import {
  apiVersion, kind, FinetuneExperiment, finetuneExperimentClient,
} from '@/api/finetune-experiment';
import { FinetuneJob } from '@/api/finetune-job';
import uniqueID from '@/utils/uid';
import { ScoringPlugin, scoringConfigClient } from '@/api/scoring-plugin';
import { LargeLanguageModel, largeLanguageModelClient } from '@/api/large-language-model';

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
        name: `finetune-job-${uniqueID()}`,
      },
      spec: {
        finetune: {
          dataset: '',
          hyperparameter: '',
          llm: '',
        },
        serveConfig: {
          nodeSelector: 'asdf',
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
