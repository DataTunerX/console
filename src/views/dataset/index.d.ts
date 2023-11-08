// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ArraySchema } from 'yup';

declare module 'yup' {
  interface ArraySchema {
    unique(message: string, mapper?: (a: never) => string): ArraySchema;
  }
}
