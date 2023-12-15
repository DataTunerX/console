import axios from 'axios';
import { TOKEN } from '@/utils/constant';

export interface KubernetesError {
  kind: string
  apiVersion: string
  status: string
  message: string
  reason: string
  code: number
}

const { HttpStatusCode } = axios;

export {
  HttpStatusCode,
};

const httpClient = axios.create({
  baseURL: '/',
  // headers: { Authorization: `Bearer ${process.env.VUE_APP_AUTH}` },
});

httpClient.interceptors.request.use(
  (config) => {
    const token:string|null = localStorage.getItem(TOKEN);

    if (!config.headers.Authorization && token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error.response?.data),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response = {} } = error;

    if (response?.status === 401 || response?.status === 403) {
      localStorage.removeItem(TOKEN);
      window.location.reload();
    }

    return Promise.reject(error.response?.data);
  },
);

export default httpClient;
