// src/models/Item.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  dateAdded?: Date; // Make dateAdded optional
}

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number },
  dateAdded: { type: Date, default: Date.now },
});

export default mongoose.model<IItem>('Item', ItemSchema);