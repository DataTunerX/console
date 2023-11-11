import type { StateIconType } from '@dao-style/extend';
import type { ComponentPublicInstance } from 'vue';
import type { LocationAsRelativeRaw } from 'vue-router';

export interface StatusMap {
  text: string;
  type: StateIconType;
}

export type FormActionType = 'create' | 'update';

export type NavRoute = {
  to: LocationAsRelativeRaw;
  icon?: string;
  display: string;
  flag?: string;
  path?: string;
  children?: NavRoute[],
  // 是否是 plugin / gproduct
  plugin?: boolean,
  // 是否新开 tab 页
  openNewTab?: boolean,
  // plugin / gproduct 是否可用
  enable?: boolean,
}

export interface SchemaEnumItem {
  label: string;
  value: string;
}

export type ElementRefType<T> = ComponentPublicInstance | null | Element | T;

export type LabelType = Record<'key' | 'value', string>;

export interface KeyValue {
  [key: string]: string,
}
