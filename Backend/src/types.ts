// Backend/src/types.ts

import { ObjectId } from 'mongoose';

export interface IItem {
  _id: ObjectId;
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  dateAdded: Date;
  branch: string;
  supplier: string;
}

export interface IStockReport {
  itemId: string; // or ObjectId if preferred
  desiredQuantity: number; // New property
}

export interface IBranch {
  _id?: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}
