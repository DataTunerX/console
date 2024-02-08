import { AxiosResponse } from 'axios';
import httpClient from './index';

type HttpClient = typeof httpClient;

export interface UploadResponse {
  url: string;
  message?: string;
  error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UploadClient {
  private pathTemplate: string;

  private httpClient: HttpClient = httpClient;

  constructor(private apiVersion: string) {
    this.pathTemplate = `/apis/${apiVersion}/upload`;
  }

  private getPath(): string {
    return this.pathTemplate;
  }

  upload(data: { file: File }): Promise<AxiosResponse<UploadResponse>> {
    const url = this.getPath();

    return this.httpClient.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}
