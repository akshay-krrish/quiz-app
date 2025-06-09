import axios, { type AxiosRequestConfig } from 'axios';
import { onRequest, onRequestError } from './requestInterceptor';
import { stringConstants } from '@/constants/stringConstants';
import { onResponse, onResponseError } from './responseInterceptor';

const baseUrl = import.meta.env.VITE_API_ENDPOINT as string | undefined;

if (baseUrl === undefined) {
  throw new Error(stringConstants.baseUrlError);
}

export const apiClient = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(onRequest, onRequestError);
apiClient.interceptors.response.use(onResponse, onResponseError);

export const getData = async (url: string, config?: AxiosRequestConfig) => {
  const response = await apiClient.get(url, config);
  return response.data;
};

export const postData = async (
  url: string,
  payload: object,
  config?: AxiosRequestConfig
) => {
  const response = await apiClient.post(url, payload, config);
  return response.data;
};
