import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import cookie from 'js-cookie';

const API_URL = process.env.API_URL;

const axiosConfig: AxiosRequestConfig = {
  baseURL: `${API_URL}`
};

const axiosInstance: AxiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
  async (config) => {
    const token =
      process.env.NODE_ENV === 'production'
        ? cookie.get(process.env.API_TOKEN_KEY ?? 'token')
        : process.env.DEV_API_TOKEN;
    config.headers.Authorization = 'Bearer ' + token;

    return config;
  },
  (error) => {
    return Promise.reject(new Error(`Request error: ${error.message}`));
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        window.location.href = '/auth?returnUrl=/explorer';
      } else {
        return Promise.reject(error);
      }
    }

    return Promise.reject(new Error(`Response error: ${error.message}`));
  }
);

export default axiosInstance;
