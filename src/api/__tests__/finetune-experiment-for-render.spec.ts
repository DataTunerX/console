import { convertFinetuneExperimentForRender } from '@/api/finetune-experiment-for-render';
import { FinetuneExperiment } from '../finetune-experiment';

describe('convertFinetuneExperimentForRender', () => {
  it('should convert FinetuneExperiment to FinetuneExperimentForRender', () => {
    // Create a FinetuneExperiment object
    const finetuneExperiment: FinetuneExperiment = {
      spec: {
        finetuneJobs: [],
        scoringPluginConfig: {
          name: 'test',
          parameters: JSON.stringify({
            key: 'value',
          }),
        },
      },
    };

    // Call the function
    const result = convertFinetuneExperimentForRender(finetuneExperiment);

    // Check the result
    expect(result).toEqual({
      spec: {
        finetuneJobs: [],
        scoringPluginConfig: {
          name: 'test',
          parameters: {
            key: 'value',
          },
        },
      },
    });
  });

  it('should throw an error if spec is undefined', () => {
    // Create a FinetuneExperiment object with undefined spec
    const finetuneExperiment = {
      spec: undefined,
    };

    // Call the function and expect it to throw an error
    expect(() => convertFinetuneExperimentForRender(finetuneExperiment)).toThrowError(
      'Spec is undefined',
    );
  });

  it('should handle missing scoringPluginConfig', () => {
    // Create a FinetuneExperiment object without scoringPluginConfig
    const finetuneExperiment = {
      spec: {
        finetuneJobs: [],
      },
    };

    // Call the function
    const result = convertFinetuneExperimentForRender(finetuneExperiment);

    // Check the result
    expect(result).toEqual({
      spec: {
        finetuneJobs: [],
        scoringPluginConfig: {
          name: 'BuildInScoringPlugin',
        },
      },
    });
  });

  it('should handle empty parameters in scoringPluginConfig', () => {
    // Create a FinetuneExperiment object with empty parameters in scoringPluginConfig
    const finetuneExperiment = {
      spec: {
        finetuneJobs: [],
        scoringPluginConfig: {
          name: 'test',
          parameters: '',
        },
      },
    };

    // Call the function
    const result = convertFinetuneExperimentForRender(finetuneExperiment);

    // Check the result
    expect(result).toEqual({
      spec: {
        finetuneJobs: [],
        scoringPluginConfig: {
          name: 'test',
          parameters: {},
        },
      },
    });
  });
});
