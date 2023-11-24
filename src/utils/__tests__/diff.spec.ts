import {
  Optimizer, Scheduler, Parameters, getKeys, diff, Quantization,
} from '@/utils/diff';

describe('diff.ts', () => {
  describe('getKeys', () => {
    it('should return the correct keys of an object', () => {
      const obj = {
        a: 1,
        b: 2,
        c: 3,
      };
      const keys = getKeys(obj);

      expect(keys).toEqual(['a', 'b', 'c']);
    });
  });

  describe('diff', () => {
    const baseParameters: Parameters = {
      batchSize: 1,
      blockSize: 1,
      epochs: 1,
      FP16: false,
      gradAccSteps: 1,
      int4: false,
      int8: false,
      learningRate: '0.01',
      loRA_Alpha: '0.5',
      loRA_Dropout: '0.5',
      loRA_R: '1',
      optimizer: Optimizer.Adam,
      PEFT: false,
      scheduler: Scheduler.Constant,
      trainerType: 'type1',
      warmupRatio: '0.1',
      weightDecay: '0.01',
      quantization: Quantization.default,
    };

    it('should return an empty object when the base and new parameters are identical', () => {
      const newParameters = { ...baseParameters };
      const differences = diff(baseParameters, newParameters);

      expect(differences).toEqual({});
    });

    it('should return an object with the correct differences when the base and new parameters have some differences', () => {
      const newParameters = {
        ...baseParameters,
        batchSize: 2,
        learningRate: '0.02',
      };
      const differences = diff(baseParameters, newParameters);

      expect(differences).toEqual({
        batchSize: 2,
        learningRate: '0.02',
      });
    });
  });
});
