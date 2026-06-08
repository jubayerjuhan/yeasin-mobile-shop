import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Category =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
