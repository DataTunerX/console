/**
* Optimizer specifies the optimization algorithm.
*/
export enum Optimizer {
  Adam = 'Adam',
  AdamW = 'AdamW',
  Sgd = 'SGD',
}

export enum Quantization {
  default= 'default',
  int4= 'int4',
  int8= 'int8'
}

/**
* Scheduler specifies the learning rate scheduler.
*/
export enum Scheduler {
  Constant = 'Constant',
  Cosine = 'Cosine',
  Linear = 'Linear',
}

export interface Parameters {
  /**
   * BatchSize specifies the size of mini-batches.
   */
  batchSize: number;
  /**
   * BlockSize specifies the block size.
   */
  blockSize: number;
  /**
   * Epochs specifies the number of training epochs.
   */
  epochs: number;
  /**
   * FP16 indicates whether to use 16-bit floating point precision.
   */
  FP16: boolean;
  /**
   * GradAccSteps specifies the number of gradient accumulation steps.
   */
  gradAccSteps: number;
  /**
   * Int4 indicates whether to use 4-bit integer quantization.
   */
  int4: boolean;
  /**
   * Int8 indicates whether to use 8-bit integer quantization.
   */
  int8: boolean;
  /**
   * LearningRate specifies the initial learning rate.
   */
  learningRate: string;
  /**
   * LoRA_Alpha represents the alpha parameter for Localized Receptive Attention.
   */
  loRA_Alpha: string;
  /**
   * LoRA_Dropout specifies the dropout rate for Localized Receptive Attention.
   */
  loRA_Dropout: string;
  /**
   * LoRA_R represents the radius parameter for Localized Receptive Attention.
   */
  loRA_R: string;
  /**
   * Optimizer specifies the optimization algorithm.
   */
  optimizer: Optimizer;
  /**
   * PEFT indicates whether to enable Performance Evaluation and Forecasting Tool.
   */
  PEFT: boolean;
  /**
   * Scheduler specifies the learning rate scheduler.
   */
  scheduler: Scheduler;
  /**
   * TrainerType specifies the type of trainer to use.
   */
  trainerType: string;
  /**
   * WarmupRatio specifies the ratio of warmup steps.
   */
  warmupRatio: string;
  /**
   * WeightDecay specifies the weight decay factor.
   */
  weightDecay: string;

  quantization: Quantization;
}

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
