// src/types.ts

export interface IBranch {
  _id?: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface IItem {
  _id?: string;
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  dateAdded?: string;
  branch: string; // Branch ID
}