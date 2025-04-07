import request from "@/api/request";

import axiosInstance from "@/api/axiosInstance";

export const getTest = () => request(axiosInstance).get<unknown>('test');
