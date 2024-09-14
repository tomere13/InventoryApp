// src/models/Report.ts

import mongoose, { Document, Schema } from 'mongoose';

// Interface for each item in the stock report
export interface IStockReportItem {
  itemId: mongoose.Types.ObjectId;
  currentStock: number;
}

// Interface for the entire report
export interface IReport extends Document {
  branchId: mongoose.Types.ObjectId; // Reference to Branch
  stockReport: IStockReportItem[];
  notes?: string;
  dateSent: Date;
}

// Schema for each stock report item
const StockReportItemSchema: Schema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  currentStock: { type: Number, required: true },
});

// Main Report Schema
const ReportSchema: Schema = new Schema({
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  stockReport: { type: [StockReportItemSchema], required: true },
  notes: { type: String },
  dateSent: { type: Date, default: Date.now },
});

export default mongoose.model<IReport>('Report', ReportSchema);