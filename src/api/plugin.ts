/* eslint-disable no-use-before-define */
import { K8sClient } from '@/plugins/axios/client';
import type { ObjectMeta, ListMeta } from 'kubernetes-types/meta/v1';

export interface PluginList {
  apiVersion: string;
  items: Plugin[];
  kind: string;
  metadata: ListMeta;
}

export interface Plugin {
  apiVersion: string;
  kind: string;
  metadata: ObjectMeta;
  spec: Spec;
}

export interface Spec {
  datasetClass: string;
  parameters: string;
  provider: string;
  version: string;
}

const apiVersion = 'extension.datatunerx.io/v1beta1';
const kind = 'DataPlugin';

export const dataPluginClient = new K8sClient<Plugin>(apiVersion, kind);
