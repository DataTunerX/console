/* eslint-disable @typescript-eslint/no-unused-vars */
import { Flags } from 'yup';

type MapperFunction = (item: any) => any;

declare module 'yup' {
  // Ensure that the type parameters match the original ArraySchema declaration
  interface ArraySchema<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TIn extends any[] | null | undefined = any[],
    TContext = Record<string, any>,
    TDefault = undefined,
    TFlags extends Flags = ''
  > {
    unique(mapper: MapperFunction, label?: string): ArraySchema;
  }

  interface StringSchema {
    s3(): StringSchema;
  }
}
