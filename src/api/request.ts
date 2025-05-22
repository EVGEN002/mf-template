import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
};

const returnErrorObject = (
  message: string | undefined,
  status: number | undefined
) => {
  message ??= 'Произошла ошибка при запросе';

  return {
    success: false,
    error: {
      message,
      ...(status && { status })
    }
  };
};

const request = (axiosInstance: AxiosInstance) => ({
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.get(url, config);

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return returnErrorObject(
          error?.response?.statusText,
          error?.response?.status
        );
      } else {
        throw new Error('Unexpected error');
      }
    }
  },
  post: async <T, D>(url: string, data?: D): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(url, data);

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return returnErrorObject(
          error?.response?.statusText,
          error?.response?.status
        );
      } else {
        throw new Error('Unexpected error');
      }
    }
  },
  put: async <T, D>(url: string, data?: D): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(url, data);

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return returnErrorObject(
          error?.response?.statusText,
          error?.response?.status
        );
      } else {
        throw new Error('Unexpected error');
      }
    }
  },
  patch: async <T, D>(url: string, data?: D): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.patch(url, data);

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return returnErrorObject(
          error?.response?.statusText,
          error?.response?.status
        );
      } else {
        throw new Error('Unexpected error');
      }
    }
  },
  delete: async <T, D>(url: string, data?: D): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.delete(url, {
        data
      });

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return returnErrorObject(
          error?.response?.statusText,
          error?.response?.status
        );
      } else {
        throw new Error('Unexpected error');
      }
    }
  }
});

export default request;
