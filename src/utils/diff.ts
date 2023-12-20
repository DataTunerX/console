import { Parameters } from '@/api/hyperparameter';

export function getKeys<O extends object>(obj: O): (keyof O)[] {
  return Object.keys(obj) as (keyof O)[];
}

export function diff(baseParameters: Parameters, newParameters: Parameters): Partial<Parameters> {
  const result: Partial<Parameters> = {};

  getKeys(baseParameters).forEach((key) => {
    if (baseParameters[key] !== newParameters[key]) {
      (result[key] as string | number | boolean) = newParameters[key];
    }
  });

  return result;
}
