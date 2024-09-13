// server/models/Branch.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    address: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBranch>('Branch', BranchSchema);