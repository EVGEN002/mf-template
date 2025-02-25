import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import cookie from 'js-cookie';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    status?: number;
  }
};

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
    return Promise.reject(new Error(`Request error: ${error.message}`));
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(new Error(`Response error: ${error.message}`));
  }
);

const returnErrorObject = (message: string | undefined, status: number | undefined) => {
  message ??= 'Произошла ошибка при запросе';

  return {
    success: false,
    error: {
      message,
      ...(status && { status })
    }
  }
}

const request = {
  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.get(url);

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return returnErrorObject(error?.response?.statusText, error?.response?.status)
      } else {
        throw new Error('Unexpected error');
      }
    }
  },
  post: async <T, D>(url: string, data: D): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(url, data);

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return returnErrorObject(error?.response?.statusText, error?.response?.status)
      } else {
        throw new Error('Unexpected error');
      }
    }
  },
  put: async <T, D>(url: string, data: D): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(url, data);

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return returnErrorObject(error?.response?.statusText, error?.response?.status)
      } else {
        throw new Error('Unexpected error');
      }
    }
  },
  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.delete(url);

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return returnErrorObject(error?.response?.statusText, error?.response?.status)
      } else {
        throw new Error('Unexpected error');
      }
    }
  }
};

export default request;
