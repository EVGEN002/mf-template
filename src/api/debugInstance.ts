import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import cookie from 'js-cookie';

const API_URL = process.env.DEBUG_API_URL;
const API_KEY = process.env.API_KEY;

const axiosConfig: AxiosRequestConfig = {
  baseURL: `${API_URL}`,
  headers: {
    hash: API_KEY,
    'Content-Type': 'application/json'
  }
};

const debugInstance: AxiosInstance = axios.create(axiosConfig);

debugInstance.interceptors.request.use(
  async (config) => {
    const hash = cookie.get('hash');
    config.headers.hash = hash;

    return config;
  },
  (error) => {
    return Promise.reject(new Error(`Request error: ${error.message}`));
  }
);

debugInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(new Error(`Response error: ${error.message}`));
  }
);

export default debugInstance;