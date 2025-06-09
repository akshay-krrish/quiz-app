import { AxiosError, type AxiosResponse } from 'axios';
import { apiClient } from './base';
import { EPath } from '@/constants/pathConstants';
import { apiRoutes } from './routes';
import { stringConstants } from '@/constants/stringConstants';
import { clearAuthData, getRefreshedAccessToken } from '@/utils/authUtils';

interface IResponseData {
  data: unknown;
}

interface IResponseError {
  data: null;
  errors: object;
  status: {
    code: string;
    short_message: string;
    message: string;
  };
  metadata: {
    timestamp: string;
  };
}

enum EHTTP_STATUS {
  SUCCESS = 200,
  INFORMATION = 300,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  CONFLICT = 409,
  SERVER_ERROR = 500,
}

//flag to indicate if token refresh is already in progress
let isRefreshing = false;

//Queue for pending requests that need to be retried after token refresh
let pendingRequests: Array<(token: string) => void> = [];

const processQueue = (newAccessToken: string, error: unknown = null) => {
  pendingRequests.forEach((callback) => {
    if (error) {
      callback('');
    } else {
      callback(newAccessToken);
    }
  });
  pendingRequests = [];
};

export const onResponse = (response: AxiosResponse<IResponseData>) => {
  return Promise.resolve(response.data as AxiosResponse);
};

export const onResponseError = async (error: AxiosError) => {
  const failedRequest = error.config;
  const responseData = error.response?.data as IResponseError;

  if (
    Number(responseData.status.code) === EHTTP_STATUS.SERVER_ERROR &&
    failedRequest &&
    (responseData.status.short_message === 'INVALID_TOKEN' ||
      responseData.status.short_message === 'INVALID_HEADER') &&
    !failedRequest._retry
  ) {
    failedRequest._retry = true;

    // Avoid token refresh for signIn requests
    if (
      failedRequest.url?.includes(apiRoutes.signIn) ||
      failedRequest.url?.includes(apiRoutes.signOut)
    ) {
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newAccessToken = await getRefreshedAccessToken();
        // Process all the pending requests with the new token
        processQueue(newAccessToken);
        isRefreshing = false;

        // Update the Authorization header for the failed request and retry it
        failedRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(failedRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue('', refreshError);

        console.error(`${stringConstants.tokenRefreshError}`, refreshError);

        // Optionally handle logout here

        // Clear stored tokens and redirect to login
        clearAuthData();
        window.location.href = EPath.login;

        return Promise.reject(refreshError);
      }
    } else {
      // If a token refresh is already in progress, queue the request
      return new Promise((resolve, reject) => {
        pendingRequests.push((newToken: string) => {
          if (!newToken) {
            // Token refresh failed
            reject(error);
          } else {
            // Update the header and retry the request with the new token
            failedRequest.headers.Authorization = `Bearer ${newToken}`;
            apiClient(failedRequest).then(resolve).catch(reject);
          }
        });
      });
    }
  }

  if (
    Number(responseData?.status.code) !== EHTTP_STATUS.SUCCESS &&
    Number(responseData?.status.code) !== EHTTP_STATUS.INFORMATION &&
    error.config?.url !== apiRoutes.signIn && // redirection to error page not required when sign-in api fails
    error.config?.url !== apiRoutes.signOut && // redirection to error page not required when logout api fails
    error.config?.url !== apiRoutes.news && // redirection to error page not required when news api fails
    !error.config?.url?.includes('graph') // redirection to error page not required when any kpi chart api or copper price chart api fails
  ) {
    console.error(`API Error: ${responseData?.status.message}`, error);

    const urlParams = new URLSearchParams(window.location.search);
    const timerParam = urlParams.get('timer'); // Get only 'timer' param
    const newUrl = timerParam
      ? `${EPath.error}?timer=${timerParam}`
      : EPath.error;

    window.location.href = newUrl; // Redirect with only 'timer' param
    return Promise.reject(error);
  }

  return Promise.reject(error);
};
