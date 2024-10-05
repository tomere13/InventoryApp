// src/types.ts
// Interface for each item in the stock report
// Interface for each item in the stock report
export interface IStockReportItem {
  itemId: IItem; // Change from mongoose.Types.ObjectId to IItem
  currentStock: number;
}
export interface IBranch {
  _id?: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface IItem {
  _id: string;
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  dateAdded?: string;
  branch: string; // Branch ID
}

export interface INewItem {
  _id?: string;
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  dateAdded?: string;
  branch: string; // Branch ID
}

// src/types.ts

export interface IStockReport {
  itemId: string;
  currentStock: number;
}

export interface IReport {
  _id: string; // Ensure _id is a string
  branchId: IBranch;
  stockReport: IStockReportItem[];
  notes?: string;
  dateSent: string; // ISO string
}

