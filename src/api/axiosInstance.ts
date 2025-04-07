import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import cookie from 'js-cookie';

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

const axiosConfig: AxiosRequestConfig = {
  baseURL: `${API_URL}`,
  headers: {
    hash: API_KEY,
    'Content-Type': 'application/json'
  }
};

const axiosInstance: AxiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
  async (config) => {
    const hash = cookie.get('hash');
    config.headers.hash = hash ?? API_KEY;

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
      if (error.response?.status === 401) {
        const authPath = process.env.AUTH_PATH;
        
        if (!authPath) throw Error('auth path is not defined')
        window.location.href = authPath;
      }
    }

    return Promise.reject(new Error(`Response error: ${error.message}`));
  }
);

export default axiosInstance;
