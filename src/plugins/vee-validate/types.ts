/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable max-len */
import {
  AnyObjectSchema, AnySchema, Schema,
} from 'yup';
import type { DeepRequired, DeepPartial } from 'utility-types';
import { FieldContext } from 'vee-validate';
import { MaybeRef } from '@vueuse/core';
import { UnwrapNestedRefs } from 'vue';

export interface FieldValidationMetaInfo {
  field: string;
  value: unknown;
  form: Record<string, unknown>;
  rule?: {
      name: string;
      params?: Record<string, unknown> | unknown[];
  };
}

export interface FieldOptions<TValue = unknown> {
  initialValue?: MaybeRef<TValue>;
  validateOnValueUpdate?: boolean;
  validateOnMount?: boolean;
  bails?: boolean;
  type?: string;
  valueProp?: MaybeRef<TValue>;
  checkedValue?: MaybeRef<TValue>;
  uncheckedValue?: MaybeRef<TValue>;
  label?: MaybeRef<string | undefined>;
  standalone?: boolean;
}

export type YupValidator = AnySchema | AnyObjectSchema;

export type GenericValidateFunction<TValue> = (value: TValue, ctx: FieldValidationMetaInfo) => boolean | string | Promise<boolean | string>;

export type RuleExpression<TValue> = string | Record<string, unknown> | GenericValidateFunction<TValue> | GenericValidateFunction<TValue>[] | YupValidator | Schema<TValue> | undefined;

export type Concat<T extends string[]> = T extends [infer F, ...infer Z] ? (Z extends [] ? (F extends string ? `${F}` : never) : Z extends string[] ? F extends string ? `${F}${Concat<Z>}` : never: never) : never;

export type GetUpperKey<T> = T extends Record<infer K, unknown> ? K extends string ? T[K] extends Record<string, unknown> ? `${Capitalize<K>}` | `${Capitalize<K>}${GetUpperKey<T[K]>}` : `${Capitalize<K>}` : never : never;

export type GetKey<T> = T extends Record<infer K, unknown> ? K extends string ? T[K] extends Record<string, unknown> ? `${K}` | `${K}.${GetKey<T[K]>}` : `${K}` : never : never;

export type GetValue<T extends Record<string, any>, K extends string> =
  K extends keyof T ?
  T[K] : K extends `${infer PK}.${infer NK}` ?
  PK extends keyof T ? NK extends string ?
  T[PK] extends Record<string, unknown> ? GetValue<T[PK], NK> : never : never : never : never;

export type KeyValRuleExpression<T extends object, K extends string> = {
  [KK in K]?: RuleExpression<DeepPartial<GetValue<DeepRequired<T>, KK>>>
};

export type KeyValFieldContext<T extends object, K extends string> = {
  [KK in K]?: FieldContext<DeepPartial<GetValue<DeepRequired<T>, KK>>>
};

export type KeyValOptions<T extends object, K extends string> = {
  [KK in K]?: FieldOptions<DeepPartial<GetValue<DeepRequired<T>, KK>>>
};

export interface UseFieldReturn<T extends object, K extends string> {
  formData: T,
  errorMessage: UnwrapNestedRefs<Partial<Record<K, string>>>,
  fieldErrors: UnwrapNestedRefs<Partial<Record<K, string[]>>>,
  originFieldInfo: KeyValFieldContext<T, K>
}

// export interface FormOptions<TValues extends Record<string, any>> {
//   validationSchema?: MaybeRef<Record<keyof TValues, GenericValidateFunction<unknown> | string | Record<string, any>> | SchemaOf<TValues> | undefined>;
//   initialValues?: MaybeRef<TValues>;
//   initialErrors?: Record<keyof TValues, string | undefined>;
//   initialTouched?: Record<keyof TValues, boolean>;
//   validateOnMount?: boolean;
// }
