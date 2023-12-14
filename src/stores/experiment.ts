import { i18n } from '@/plugins/vue-i18n';
import { FinetuneExperiment, finetuneExperimentClient } from '@/api/finetune-experiment';
import { nError } from '@/utils/useNoty';

function onNewLine(buffer: string, fn: (chunk: string) => void): string {
  const newLineIndex = buffer.indexOf('\n');

  if (newLineIndex === -1) {
    return buffer;
  }
  const chunk = buffer.slice(0, newLineIndex);
  const newBuffer = buffer.slice(newLineIndex + 1);

  fn(chunk);

  return onNewLine(newBuffer, fn);
}

export const useExperimentStore = defineStore('experiment', {
  state: () => ({
    lastResourceVersion: '' as string,
    experiments: [] as FinetuneExperiment[],
    datasetWithExperiment: {} as { [key: string]: string[] },
    hyperparameterWithExperiment: {} as { [key: string]: string[] },
  }),

  actions: {
    async fetchExperiment(namespace: string) {
      try {
        const { data } = await finetuneExperimentClient.list(namespace);

        this.lastResourceVersion = data.metadata.resourceVersion as string;
        this.experiments = data.items;

        // this.streamUpdates(namespace, this.lastResourceVersion);

        const { datasetWithExperiment, hyperparameterWithExperiment } = this.experiments.reduce(
          (acc, experiment) => {
            experiment.spec?.finetuneJobs.forEach(({ spec }) => {
              if (spec?.finetune.finetuneSpec.dataset) {
                const dataset = spec?.finetune.finetuneSpec.dataset;

                if (!acc.datasetWithExperiment[dataset]) {
                  acc.datasetWithExperiment[dataset] = [];
                }

                acc.datasetWithExperiment[dataset].push(experiment.metadata?.name as string);
              }
              if (spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef) {
                const hyperparameterRef = spec?.finetune.finetuneSpec.hyperparameter?.hyperparameterRef;

                if (!acc.hyperparameterWithExperiment[hyperparameterRef]) {
                  acc.hyperparameterWithExperiment[hyperparameterRef] = [];
                }
                acc.hyperparameterWithExperiment[hyperparameterRef].push(
                  experiment.metadata?.name as string,
                );
              }
            });

            return acc;
          },
          {
            datasetWithExperiment: {} as { [key: string]: string[] },
            hyperparameterWithExperiment: {} as { [key: string]: string[] },
          },
        );

        this.datasetWithExperiment = datasetWithExperiment;
        this.hyperparameterWithExperiment = hyperparameterWithExperiment;
      } catch (error) {
        nError(i18n.t('common.fetchFailed'), error);
      }
    },

    streamUpdates(namespace: string, lastResourceVersion: string) {
      fetch(
        `/apis/finetune.datatunerx.io/v1beta1/namespaces/${namespace}/finetuneexperiments?watch=1&resourceVersion=${lastResourceVersion}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_AUTH}`,
          },
        },
      )
        .then((response) => {
          const stream = response.body?.getReader();
          const utf8Decoder = new TextDecoder('utf-8');
          const buffer = '';

          return stream?.read().then((result) => this.processText(result, buffer, utf8Decoder, stream));
        })
        .catch(() => {
          /* eslint-disable no-console */
          console.log('Error! Retrying in 5 seconds...');
          setTimeout(() => this.streamUpdates(namespace, lastResourceVersion), 5000);
        });
    },

    processText(
      { done, value }: ReadableStreamReadResult<Uint8Array>,
      buffer: string,
      utf8Decoder: TextDecoder,
      stream: ReadableStreamDefaultReader<Uint8Array>,
    ): Promise<void> {
      if (done) {
        // eslint-disable-next-line no-console
        console.log('Request terminated');

        return Promise.resolve();
      }
      // eslint-disable-next-line no-param-reassign
      buffer += utf8Decoder.decode(value);
      // eslint-disable-next-line no-param-reassign
      buffer = onNewLine(buffer, (chunk) => {
        if (chunk.trim().length === 0) {
          return;
        }
        try {
          const event = JSON.parse(chunk);

          if (event.type === 'ADDED') {
            this.experiments.push(event.object);
          } else if (event.type === 'DELETED') {
            this.experiments = this.experiments.filter(
              (experiment) => experiment.metadata?.name !== event.object.metadata.name,
            );
          }
          /* eslint-disable no-console */
          console.log(event.type, event.object.metadata.name);
        } catch (error) {
          /* eslint-disable no-console */
          console.log('Error while parsing', chunk, '\n', error);
        }
      });

      return stream.read().then((result) => this.processText(result, buffer, utf8Decoder, stream));
    },
  },
});
