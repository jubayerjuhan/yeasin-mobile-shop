import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productSlug: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface IOrder extends Document {
  stripeSessionId: string;
  customerEmail: string | null;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  items: IOrderItem[];
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productSlug: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    stripeSessionId: { type: String, required: true, unique: true },
    customerEmail: { type: String, default: null },
    amountTotal: { type: Number, required: true },
    currency: { type: String, default: "bdt" },
    paymentStatus: { type: String, default: "pending" },
    fulfillmentStatus: { type: String, default: "unfulfilled" },
    items: { type: [OrderItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
