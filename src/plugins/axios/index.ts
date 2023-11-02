/* eslint-disable @typescript-eslint/no-shadow */
import axios, { HttpStatusCode } from 'axios';

export interface KubernetesError {
  kind: string
  apiVersion: string
  status: string
  message: string
  reason: string
  code: number
}

const httpClient = axios.create({
  baseURL: '/',
  headers: { Authorization: `Bearer ${process.env.VUE_APP_AUTH}` },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response?.data),
);

export default httpClient;

export { HttpStatusCode };
