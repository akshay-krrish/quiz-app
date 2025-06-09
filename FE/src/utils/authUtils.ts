import axios from 'axios';
import { storage } from './storageUtils';
import { stringConstants } from '@/constants/stringConstants';
import { apiRoutes } from '@/api/routes';

const baseUrl = import.meta.env.VITE_API_ENDPOINT as string | undefined;

//This function clears all auth data stored in local storage
export const clearAuthData = () => {
  storage.removeItem('accessToken');
  storage.removeItem('refreshToken');
};

// This function searches for a token in localStorage
// and returns it if found and not expired, else returns null
// and deletes the expired token
export const getToken = (tokenName: string) => {
  const tokenValue = storage.getItem<string>(tokenName);
  if (tokenValue) {
    return tokenValue;
  } else return null;
};

//This function sets both access token and refresh token in localstorage.
export const setToken = (accessToken: string, refreshToken?: string): void => {
  storage.setItem('accessToken', accessToken);
  if (refreshToken) storage.setItem('refreshToken', refreshToken);
};

//This function gets new access token after refreshing using refresh token
export const getRefreshedAccessToken = async () => {
  const refreshToken = getToken('refreshToken');
  if (!refreshToken) {
    throw new Error(stringConstants.refreshTokenNotAvailable);
  }
  const response = await axios.post(
    `${baseUrl}${apiRoutes.accessTokenRefresh}`,
    {
      refresh_token: refreshToken,
    }
  );
  const { access_token: newAccessToken, refresh_token: newRefreshToken } =
    response.data.data.tokens;
  setToken(newAccessToken, newRefreshToken);

  return newAccessToken;
};
