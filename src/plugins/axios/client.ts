import { DeleteOptions, ListMeta } from 'kubernetes-types/meta/v1';
import httpClient from './index';

type HttpClient = typeof httpClient;

export interface List<T> {
  apiVersion: string;
  items: T[];
  kind: string;
  metadata: ListMeta;
}

export class K8sClient<T> {
  private pathTemplate: string;

  private httpClient: HttpClient = httpClient;

  constructor(private apiVersion: string, private kind: string) {
    this.pathTemplate = `/apis/${apiVersion}/namespaces/{namespace}/${kind.toLowerCase()}s`;
  }

  private getPath(namespace: string): string {
    return this.pathTemplate.replace('{namespace}', encodeURIComponent(namespace));
  }

  list(namespace: string) {
    const path = this.getPath(namespace);

    return this.httpClient.get<List<T>>(path);
  }

  create(namespace: string, data: T) {
    const url = this.getPath(namespace);

    return this.httpClient.post<T>(url, data);
  }

  update(namespace: string, name: string, data: T) {
    const url = `${this.getPath(namespace)}/${name}`;

    return this.httpClient.put<T>(url, data);
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
