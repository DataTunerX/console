import {
  apiVersion,
  kind,
  FinetuneExperiment,
  finetuneExperimentClient,
  FinetuneJobWithName,
} from '@/api/finetune-experiment';
import { BuildInScoringPlugin, ScoringPlugin, scoringPluginConfigClient } from '@/api/scoring-plugin';
import { LargeLanguageModel, largeLanguageModelClient } from '@/api/large-language-model';
import { ImagePullPolicy } from '@/api/finetune';
import { FinetuneExperimentForRender } from '@/api/finetune-experiment-for-render';
import { createDialog } from '@dao-style/extend';
import StopExperimentDialog from '../components/StopExperimentDialog.vue';

const defaultFinetuneJob: FinetuneJobWithName = {
  name: '',
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
    serveConfig: {},
  },
};

const defaultFinetuneExperiment: FinetuneExperimentForRender = {
  apiVersion,
  kind,
  metadata: {
    name: '',
  },
  spec: {
    finetuneJobs: [defaultFinetuneJob],
    scoringPluginConfig: {
      name: BuildInScoringPlugin,
      parameters: {},
    },
  },
};

export const useFinetuneExperiment = () => {
  const state = reactive({
    finetuneExperiment: defaultFinetuneExperiment,
    finetuneExperiments: [] as FinetuneExperiment[],
  });

  const fetchFinetuneExperiments = async (namespace: string) => {
    const { data } = await finetuneExperimentClient.list(namespace);

    state.finetuneExperiments = data.items;
  };

  const stop = (workload: FinetuneExperiment) => {
    const dialog = createDialog(StopExperimentDialog);

    return dialog.show({
      workload,
    });
  };

  return {
    ...toRefs(state),
    fetchFinetuneExperiments,
    stop,
  };
};

export const useFinetuneJob = () => {
  const finetuneJob = ref<FinetuneJobWithName>(defaultFinetuneJob);

  return { finetuneJob };
};

export const useScoringPluginConfig = () => {
  const state = reactive({
    scoringPluginConfigs: [] as ScoringPlugin[],
  });

  const fetchScoringPluginConfigs = async (namespace: string) => {
    const { data } = await scoringPluginConfigClient.list(namespace);

    state.scoringPluginConfigs = data.items;
  };

  return {
    ...toRefs(state),
    fetchScoringPluginConfigs,
  };
};

export const useLargeLanguageModel = () => {
  const state = reactive({
    largeLanguageModels: [] as LargeLanguageModel[],
  });

  const fetchLargeLanguageModels = async (namespace: string) => {
    const { data } = await largeLanguageModelClient.list(namespace);

    state.largeLanguageModels = data.items;
  };

  return {
    ...toRefs(state),
    fetchLargeLanguageModels,
  };
};
