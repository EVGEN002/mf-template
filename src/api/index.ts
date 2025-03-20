import request from '@/api/axios';

import { CurrentUser } from '@/types/general';

import { Material, RepoFile } from '@/types/spatialData';

export const getDictionary = (dictionary: string) =>
  request.get<any>(`apimap/api/Dictionary/${dictionary}`);

export const getDictionaryFundsettings = (dictionary: string) =>
  request.get<any>(`apimap/api/Dictionary/fundsettings/${dictionary}`);

export const getSpatialData = (uuid: string) =>
  request.get<Material>(`apimap/api/Material/fetch/${uuid}`);

export const postSpatialData = (data: Material) =>
  request.post('apimap/api/Material', data);

export const putSpatialData = (uuid: string, data: Partial<Material>) =>
  request.put(`apimap/api/Material/${uuid}`, data);

export const deleteSpatialData = (uuid: string) =>
  request.delete(`apimap/api/Material/${uuid}`);

export const postToCart = (data: { materialId: string; quantity: number }) =>
  request.post(`apiorders/api/ShoppingCart/items`, data);

export const getCurrentUser = () => request.get<CurrentUser>(`apimap/api/me`);

export const uploadRepoFile = (data: FormData) =>
  request.post<RepoFile[], FormData>(`apiorders/Repo/upload`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const deleteRepoFile = (code: string) =>
  request.delete(`apiorders/Repo/${code}`);
