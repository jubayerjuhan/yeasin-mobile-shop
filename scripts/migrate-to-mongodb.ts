import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import mongoose from "mongoose";
import { Category } from "../lib/models/Category";
import { Product } from "../lib/models/Product";
import { Order } from "../lib/models/Order";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/yeasin-mobile-shop";

async function migrate() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const dbPath = path.join(process.cwd(), "data", "store.db");
  if (!fs.existsSync(dbPath)) {
    console.log("No SQLite database found at", dbPath);
    process.exit(0);
  }

  const db = new Database(dbPath);
  
  // Clear existing data in MongoDB to avoid duplicates during migration tests
  console.log("Clearing existing MongoDB data...");
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});

  console.log("Migrating Categories...");
  const categories = db.prepare("SELECT * FROM categories").all() as any[];
  const categoryMap = new Map();

  for (const cat of categories) {
    const newCat = await Category.create({
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      sortOrder: cat.sort_order,
    });
    categoryMap.set(cat.id, newCat._id);
  }

  console.log("Migrating Products...");
  const products = db.prepare("SELECT * FROM products").all() as any[];
  for (const prod of products) {
    await Product.create({
      slug: prod.slug,
      name: prod.name,
      categoryId: categoryMap.get(prod.category_id),
      price: prod.price,
      compareAtPrice: prod.compare_at_price,
      shortDescription: prod.short_description,
      description: prod.description,
      image: prod.image,
      badge: prod.badge,
      featured: Boolean(prod.featured),
      inStock: Boolean(prod.in_stock),
      sku: prod.sku,
      specs: JSON.parse(prod.specs_json || "[]"),
    });
  }

  console.log("Migrating Orders...");
  const orders = db.prepare("SELECT * FROM orders").all() as any[];
  for (const order of orders) {
    const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id) as any[];
    
    await Order.create({
      stripeSessionId: order.stripe_session_id,
      customerEmail: order.customer_email,
      amountTotal: order.amount_total,
      currency: order.currency,
      paymentStatus: order.payment_status,
      fulfillmentStatus: order.fulfillment_status,
      items: items.map(item => ({
        productSlug: item.product_slug,
        productName: item.product_name,
        quantity: item.quantity,
        unitPrice: item.unit_price
      })),
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at),
    });
  }

  console.log("Migration Complete!");
  process.exit(0);
}

migrate().catch(console.error);
