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
  /**
   * Выполняет GET-запрос
   * @template T - Ожидаемый тип данных ответа
   * @param {string} url - Эндпоинт запроса
   * @param {AxiosRequestConfig} [config] - Конфиг запроса
   * @returns {Promise<ApiResponse<T>>} - Стандартизированный ответ
   */
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
  /**
   * Выполняет POST-запрос
   * @template T - Ожидаемый тип данных ответа
   * @template D - Тип передаваемых данных
   * @param {string} url - URL-адрес запроса
   * @param {D} data - Тело запроса
   * @param {AxiosRequestConfig} [config] - Дополнительная конфигурация запроса
   * @returns {Promise<ApiResponse<T>>} Объект ответа с данными или ошибкой
   *
   * @example
   * const newUser = { name: 'John', age: 30 };
   * const { data } = await api.post<User, typeof newUser>('/users', newUser);
   */
  post: async <T, D>(url: string, data: D): Promise<ApiResponse<T>> => {
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
  /**
   * Выполняет PUT-запрос
   * @template T - Ожидаемый тип данных ответа
   * @template D - Тип передаваемых данных
   * @param {string} url - URL-адрес запроса
   * @param {D} data - Тело запроса
   * @param {AxiosRequestConfig} [config] - Дополнительная конфигурация запроса
   * @returns {Promise<ApiResponse<T>>} Объект ответа с данными или ошибкой
   *
   * @example
   * const updatedUser = { name: 'John Doe' };
   * const { success } = await api.put<User>('/users/123', updatedUser);
   */
  put: async <T, D>(url: string, data: D): Promise<ApiResponse<T>> => {
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
  /**
   * Выполняет DELETE-запрос
   * @template T - Ожидаемый тип данных ответа (если предусмотрен API)
   * @template D - Тип передаваемых данных (опционально)
   * @param {string} url - URL-адрес запроса
   * @param {D} [data] - Тело запроса (необязательно)
   * @param {AxiosRequestConfig} [config] - Дополнительная конфигурация запроса
   * @returns {Promise<ApiResponse<T>>} Объект ответа с данными или ошибкой
   *
   * @example
   * // Удаление с телом запроса
   * await api.delete<void, { reason: string }>('/users/123', { reason: 'spam' });
   *
   * @example
   * // Простое удаление
   * await api.delete('/posts/456');
   */
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
