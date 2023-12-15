import httpClient from '@/plugins/axios';
import qs from 'qs';

export interface TrainMetrics {
  current_steps: number;
  total_steps: number;
  loss: number;
  learning_rate: number;
  epoch: number;
}

export interface EvalMetrics {
  current_steps: number;
  total_steps: number;
  epoch: number;
  eval_loss: number;
  eval_perplexity: number;
}

export interface FinetuneMetrics {
  finetune_name: string;
  metrics: {
    train_metrics: TrainMetrics[];
    eval_metrics: EvalMetrics[];
  };
}

export interface ProcessedTrainMetrics extends TrainMetrics {
  finetune_name: string;
}

export interface ProcessedEvalMetrics extends EvalMetrics {
  finetune_name: string;
}

export interface ProcessedMetrics {
  train_metrics: ProcessedTrainMetrics[];
  eval_metrics: ProcessedEvalMetrics[];
}

export const processedData = (input: FinetuneMetrics[]): ProcessedMetrics => ({
  train_metrics: input.flatMap((item) => item.metrics.train_metrics.map((metric) => ({
    finetune_name: item.finetune_name,
    ...metric,
  }))),
  eval_metrics: input.flatMap((item) => item.metrics.eval_metrics.map((metric) => ({
    finetune_name: item.finetune_name,
    ...metric,
  }))),
});

export const getMetrics = (namespace: string, names: string[]) => httpClient.get<FinetuneMetrics[]>(
  `/inference/apis/util.datatunerx.io/v1beta1/namespaces/${namespace}/finetune/metrics`,
  {
    params: {
      finetune_name: names,
    },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  },
);
