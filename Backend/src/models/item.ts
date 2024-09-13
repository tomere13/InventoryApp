// server/models/Item.ts

import mongoose, { Document, Schema } from 'mongoose';
import { IBranch } from './Branch';

export interface IItem extends Document {
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  dateAdded?: Date;
  branch: mongoose.Types.ObjectId; // Reference to Branch
}

const ItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, default: 0 },
    dateAdded: { type: Date, default: Date.now },
    branch: { type: mongoose.Types.ObjectId, ref: 'Branch', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IItem>('Item', ItemSchema);