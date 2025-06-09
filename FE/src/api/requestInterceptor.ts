import { getToken } from '@/utils/authUtils';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const onRequest = (config: InternalAxiosRequestConfig) => {
  const accessToken = getToken('accessToken');
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
};

export const onRequestError = (error: AxiosError): Promise<AxiosError> =>
  Promise.reject(error);
