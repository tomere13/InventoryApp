// src/services/branchService.ts

import axios from '../utils/axiosInstance';
import { IBranch } from '../types';

const API_URL = '/api/branches';

export const getBranches = async (): Promise<IBranch[]> => {
  const response = await axios.get<IBranch[]>(API_URL);
  return response.data;
};

export const createBranch = async (branchData: { name: string; address: string }): Promise<IBranch> => {
  const response = await axios.post<IBranch>(API_URL, branchData);
  return response.data;
};

