import { noty } from '@/plugins/dao-style';
import { i18n } from '@/plugins/vue-i18n';
import { capitalize } from 'lodash';

export type grpcError = {
  code: number;
  details: Array<unknown>;
  message: string;
}

export enum NotyAction {
  fetch = 'fetched',
  create = 'created',
  save = 'saved',
  update = 'updated',
  revert = 'reverted',
  export = 'exported',
  remove = 'removed',
  delete = 'deleted',
}

type Key = keyof typeof NotyAction;

const keyValueMappings = {} as Record<NotyAction, Key>;

Object.keys(NotyAction).forEach((key) => {
  keyValueMappings[NotyAction[key as Key]] = key as Key;
});

type SuccessNotyParams = {
  action?: `${NotyAction}`;
  name?: string;
  customContent?: string;
}

type ErrorNotyParams = {
  action?: `${NotyAction}`;
  name?: string;
  customTitle?: string;
}

export function simpleSuccessNoty(params: SuccessNotyParams) {
  const { action = 'fetched', name, customContent } = params || {};

  const content = customContent || capitalize(i18n.t('common.notySuccess', {
    action: i18n.t(`common.${action}`),
    name,
  }).trim());

  noty.success({
    content,
  });
}

export function simpleErrorNoty(data?: unknown, params?: ErrorNotyParams) {
  const { action = 'fetched', name, customTitle } = params || {};

  const title = customTitle || capitalize(i18n.t('common.notyError', {
    action: i18n.t(`common.${keyValueMappings[action]}`),
    name,
  }).trim());

  noty.error({
    title,
    content: (data as grpcError).message || String(data) || 'Unknown Error',
  });
}
