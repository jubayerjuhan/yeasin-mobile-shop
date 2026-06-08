import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  slug: string;
  name: string;
  categoryId: mongoose.Types.ObjectId;
  price: number;
  compareAtPrice: number | null;
  shortDescription: string;
  description: string;
  image: string;
  badge: string | null;
  featured: boolean;
  inStock: boolean;
  sku: string;
  specs: string[];
}

const ProductSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: null },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    badge: { type: String, default: null },
    featured: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    sku: { type: String, required: true, unique: true },
    specs: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
