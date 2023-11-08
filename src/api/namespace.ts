import httpClient from '@/plugins/axios';
import { NamespaceList } from 'kubernetes-types/core/v1';

const listNamespaces = () => httpClient.get<NamespaceList>('/api/v1/namespaces');

export {
  listNamespaces,
};
