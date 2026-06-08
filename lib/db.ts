import connectToDatabase from "./mongodb";
import { Category } from "./models/Category";
import { Product } from "./models/Product";
import { Order } from "./models/Order";
import type { CategoryRecord, ProductRecord } from "./store-data";

export type OrderRecord = {
  id: string;
  stripeSessionId: string;
  customerEmail: string | null;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItemRecord = {
  productName: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
};

// Map Mongoose documents to application records
function mapProductDoc(doc: any): ProductRecord {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    categoryId: doc.categoryId?._id?.toString() || doc.categoryId.toString(),
    categorySlug: doc.categoryId?.slug || "",
    categoryName: doc.categoryId?.name || "",
    price: doc.price,
    compareAtPrice: doc.compareAtPrice,
    shortDescription: doc.shortDescription,
    description: doc.description,
    image: doc.image,
    badge: doc.badge,
    featured: doc.featured,
    inStock: doc.inStock,
    sku: doc.sku,
    specs: doc.specs,
  };
}

export async function getCategories(): Promise<CategoryRecord[]> {
  await connectToDatabase();
  const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean();
  
  return categories.map((cat: any) => ({
    id: cat._id.toString(),
    slug: cat.slug,
    name: cat.name,
    description: cat.description,
    sortOrder: cat.sortOrder,
  }));
}

export async function getProducts(): Promise<ProductRecord[]> {
  await connectToDatabase();
  const products = await Product.find()
    .populate("categoryId", "slug name")
    .sort({ featured: -1, _id: -1 })
    .lean();

  return products.map(mapProductDoc);
}

export async function getProductsPaginated(options: { search?: string, page: number, limit: number }) {
  await connectToDatabase();
  const query: any = {};
  if (options.search) {
    query.$or = [
      { name: { $regex: options.search, $options: "i" } },
      { sku: { $regex: options.search, $options: "i" } },
    ];
  }
  const skip = (options.page - 1) * options.limit;
  const [products, total] = await Promise.all([
    Product.find(query).populate("categoryId", "slug name").sort({ _id: -1 }).skip(skip).limit(options.limit).lean(),
    Product.countDocuments(query)
  ]);
  return { products: products.map(mapProductDoc), total, totalPages: Math.ceil(total / options.limit) };
}

export async function getFeaturedProducts(): Promise<ProductRecord[]> {
  await connectToDatabase();
  const products = await Product.find({ featured: true })
    .populate("categoryId", "slug name")
    .sort({ _id: -1 })
    .lean();

  return products.map(mapProductDoc);
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | undefined> {
  await connectToDatabase();
  const product = await Product.findOne({ slug })
    .populate("categoryId", "slug name")
    .lean();

  return product ? mapProductDoc(product) : undefined;
}

export async function getDashboardStats() {
  await connectToDatabase();
  const productsCount = await Product.countDocuments();
  const categoriesCount = await Category.countDocuments();
  const ordersCount = await Order.countDocuments();
  
  const paidOrders = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$amountTotal" } } }
  ]);
  const paidRevenue = paidOrders[0]?.total || 0;

  return { productsCount, categoriesCount, ordersCount, paidRevenue };
}

export async function createCategory(input: {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
}) {
  await connectToDatabase();
  await Category.create(input);
}

export async function updateCategory(input: CategoryRecord) {
  await connectToDatabase();
  await Category.findByIdAndUpdate(input.id, {
    slug: input.slug,
    name: input.name,
    description: input.description,
    sortOrder: input.sortOrder,
  });
}

export async function deleteCategory(id: string) {
  await connectToDatabase();
  await Category.findByIdAndDelete(id);
}

export async function getCategoryUsageCount(id: string): Promise<number> {
  await connectToDatabase();
  return Product.countDocuments({ categoryId: id });
}

export async function createProduct(input: {
  slug: string;
  name: string;
  categoryId: string;
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
}) {
  await connectToDatabase();
  await Product.create(input);
}

export async function updateProduct(input: {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
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
}) {
  await connectToDatabase();
  const { id, ...updateData } = input;
  await Product.findByIdAndUpdate(id, updateData);
}

export async function deleteProduct(id: string) {
  await connectToDatabase();
  await Product.findByIdAndDelete(id);
}

export async function createOrder(input: {
  stripeSessionId: string;
  customerEmail: string | null;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  items: Array<{
    productSlug: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
}) {
  await connectToDatabase();
  const order = await Order.findOneAndUpdate(
    { stripeSessionId: input.stripeSessionId },
    { ...input },
    { upsert: true, new: true }
  );
  return order._id.toString();
}

export async function getOrders(): Promise<OrderRecord[]> {
  await connectToDatabase();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  
  return orders.map((order: any) => ({
    id: order._id.toString(),
    stripeSessionId: order.stripeSessionId,
    customerEmail: order.customerEmail,
    amountTotal: order.amountTotal,
    currency: order.currency,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));
}

export async function getOrdersPaginated(options: { search?: string, page: number, limit: number }) {
  await connectToDatabase();
  const query: any = {};
  if (options.search) {
    query.$or = [
      { stripeSessionId: { $regex: options.search, $options: "i" } },
      { customerEmail: { $regex: options.search, $options: "i" } },
    ];
  }
  const skip = (options.page - 1) * options.limit;
  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(options.limit).lean(),
    Order.countDocuments(query)
  ]);
  return { 
    orders: orders.map((order: any) => ({
      id: order._id.toString(),
      stripeSessionId: order.stripeSessionId,
      customerEmail: order.customerEmail,
      amountTotal: order.amountTotal,
      currency: order.currency,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    })), 
    total, 
    totalPages: Math.ceil(total / options.limit) 
  };
}

export async function getOrderById(id: string): Promise<OrderRecord | undefined> {
  await connectToDatabase();
  const order = await Order.findById(id).lean();
  if (!order) return undefined;
  return {
    id: order._id.toString(),
    stripeSessionId: order.stripeSessionId,
    customerEmail: order.customerEmail,
    amountTotal: order.amountTotal,
    currency: order.currency,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

export async function getOrderItems(orderId: string): Promise<OrderItemRecord[]> {
  await connectToDatabase();
  const order = await Order.findById(orderId).lean();
  return order ? order.items : [];
}

export async function getOrderBySessionId(stripeSessionId: string): Promise<OrderRecord | undefined> {
  await connectToDatabase();
  const order = await Order.findOne({ stripeSessionId }).lean();
  if (!order) return undefined;

  return {
    id: order._id.toString(),
    stripeSessionId: order.stripeSessionId,
    customerEmail: order.customerEmail,
    amountTotal: order.amountTotal,
    currency: order.currency,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

export async function updateOrderPaymentStatus(
  stripeSessionId: string,
  paymentStatus: string,
  customerEmail: string | null,
) {
  await connectToDatabase();
  await Order.findOneAndUpdate(
    { stripeSessionId },
    { paymentStatus, customerEmail }
  );
}

export async function updateOrderFulfillmentStatus(orderId: string, status: string) {
  await connectToDatabase();
  await Order.findByIdAndUpdate(orderId, { fulfillmentStatus: status });
}
