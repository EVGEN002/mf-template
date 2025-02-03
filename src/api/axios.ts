import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import cookie from 'js-cookie';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
}

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

const axiosConfig: AxiosRequestConfig = {
  baseURL: `${API_URL}`,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
};

const axiosInstance: AxiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = cookie.get('token') ?? API_KEY;
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const request = {
  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: {
            message:
              error.response?.status === 404
                ? 'Запрашиваемый ресурс не найден (404)'
                : error.response?.data?.message ||
                  'Произошла ошибка при запросе',
            status: error.response?.status
          }
        };
      } else {
        return {
          success: false,
          error: {
            message: 'Неизвестная ошибка'
          }
        };
      }
    }
  },
  post: async <T, D>(
    url: string,
    payloadData: D,
    params?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(
        url,
        payloadData,
        params
      );
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: {
            message:
              error.response?.status === 404
                ? 'Запрашиваемый ресурс не найден (404)'
                : error.response?.data?.message ||
                  'Произошла ошибка при запросе',
            status: error.response?.status
          }
        };
      } else {
        return {
          success: false,
          error: {
            message: 'Неизвестная ошибка'
          }
        };
      }
    }
  },
  put: async <T, D>(url: string, data: D): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: {
            message:
              error.response?.status === 404
                ? 'Запрашиваемый ресурс не найден (404)'
                : error.response?.data?.message ||
                  'Произошла ошибка при запросе',
            status: error.response?.status
          }
        };
      } else {
        return {
          success: false,
          error: {
            message: 'Неизвестная ошибка'
          }
        };
      }
    }
  },
  detele: async <T>(url: string): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(url);
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: {
            message:
              error.response?.status === 404
                ? 'Запрашиваемый ресурс не найден (404)'
                : error.response?.data?.message ||
                  'Произошла ошибка при запросе',
            status: error.response?.status
          }
        };
      } else {
        return {
          success: false,
          error: {
            message: 'Неизвестная ошибка'
          }
        };
      }
    }
  }
};

export default request;
