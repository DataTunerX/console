import { DeleteOptions, ListMeta } from 'kubernetes-types/meta/v1';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { OpPatch } from 'json-patch';
import httpClient from './index';

type HttpClient = typeof httpClient;

export interface List<T> {
  apiVersion: string;
  items: T[];
  kind: string;
  metadata: ListMeta;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class K8sClient<T, D = any> {
  private pathTemplate: string;

  private httpClient: HttpClient = httpClient;

  constructor(private apiVersion: string, private kind: string) {
    this.pathTemplate = `/apis/${apiVersion}/namespaces/{namespace}/${kind.toLowerCase()}s`;
  }

  private getPath(namespace: string): string {
    return this.pathTemplate.replace('{namespace}', encodeURIComponent(namespace));
  }

  list(namespace: string, config?: AxiosRequestConfig<D>) {
    const path = this.getPath(namespace);

    return this.httpClient.get<List<T>, AxiosResponse<List<T>>, D>(path, config);
  }

  create(namespace: string, data: T) {
    const url = this.getPath(namespace);

    return this.httpClient.post<T>(url, data);
  }

  update(namespace: string, name: string, data: T) {
    const url = `${this.getPath(namespace)}/${name}`;

    return this.httpClient.put<T>(url, data);
  }

  patch(namespace: string, name: string, data: OpPatch[]) {
    const url = `${this.getPath(namespace)}/${name}`;

    return this.httpClient.patch(url, data, {
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
    });
  }

  read(namespace: string, name: string) {
    const path = `${this.getPath(namespace)}/${name}`;

    return this.httpClient.get<T>(path);
  }

  delete(namespace: string, name: string) {
    const path = `${this.getPath(namespace)}/${name}`;

    return this.httpClient.delete<DeleteOptions>(path);
  }
}
