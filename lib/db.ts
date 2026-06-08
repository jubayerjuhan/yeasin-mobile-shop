import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import {
  categorySeeds,
  type CategoryRecord,
  type ProductRecord,
  productSeeds,
} from "@/lib/store-data";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "store.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

initializeDatabase();

export type OrderRecord = {
  id: number;
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
  id: number;
  orderId: number;
  productName: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
};

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      price INTEGER NOT NULL,
      compare_at_price INTEGER,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      badge TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      in_stock INTEGER NOT NULL DEFAULT 1,
      sku TEXT NOT NULL UNIQUE,
      specs_json TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stripe_session_id TEXT NOT NULL UNIQUE,
      customer_email TEXT,
      amount_total INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'bdt',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_slug TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  const categoryCount = db
    .prepare("SELECT COUNT(*) as count FROM categories")
    .get() as { count: number };

  if (categoryCount.count === 0) {
    const insertCategory = db.prepare(
      "INSERT INTO categories (slug, name, description, sort_order) VALUES (?, ?, ?, ?)",
    );

    for (const category of categorySeeds) {
      insertCategory.run(
        category.slug,
        category.name,
        category.description,
        category.sortOrder,
      );
    }
  }

  const productCount = db
    .prepare("SELECT COUNT(*) as count FROM products")
    .get() as { count: number };

  if (productCount.count === 0) {
    const categoryRows = db
      .prepare("SELECT id, slug FROM categories")
      .all() as Array<{ id: number; slug: string }>;

    const categoryMap = new Map(categoryRows.map((row) => [row.slug, row.id]));
    const insertProduct = db.prepare(`
      INSERT INTO products (
        slug, name, category_id, price, compare_at_price,
        short_description, description, image, badge, featured, in_stock, sku, specs_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const product of productSeeds) {
      insertProduct.run(
        product.slug,
        product.name,
        categoryMap.get(product.categorySlug),
        product.price,
        product.compareAtPrice,
        product.shortDescription,
        product.description,
        product.image,
        product.badge,
        product.featured ? 1 : 0,
        product.inStock ? 1 : 0,
        product.sku,
        JSON.stringify(product.specs),
      );
    }
  }
}

function mapProductRow(
  row: Record<string, unknown> & {
    specs_json: string;
    featured: number;
    in_stock: number;
  },
): ProductRecord {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    categoryId: Number(row.category_id),
    categorySlug: String(row.category_slug),
    categoryName: String(row.category_name),
    price: Number(row.price),
    compareAtPrice:
      row.compare_at_price === null ? null : Number(row.compare_at_price),
    shortDescription: String(row.short_description),
    description: String(row.description),
    image: String(row.image),
    badge: row.badge === null ? null : String(row.badge),
    featured: Boolean(row.featured),
    inStock: Boolean(row.in_stock),
    sku: String(row.sku),
    specs: JSON.parse(String(row.specs_json)) as string[],
  };
}

export function getCategories(): CategoryRecord[] {
  const rows = db
    .prepare(
      "SELECT id, slug, name, description, sort_order FROM categories ORDER BY sort_order ASC, name ASC",
    )
    .all() as Array<{
    id: number;
    slug: string;
    name: string;
    description: string;
    sort_order: number;
  }>;

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    sortOrder: row.sort_order,
  }));
}

export function getProducts(): ProductRecord[] {
  const rows = db
    .prepare(`
      SELECT
        products.*,
        categories.slug as category_slug,
        categories.name as category_name
      FROM products
      INNER JOIN categories ON categories.id = products.category_id
      ORDER BY featured DESC, products.id DESC
    `)
    .all() as Array<Record<string, unknown> & {
    specs_json: string;
    featured: number;
    in_stock: number;
  }>;

  return rows.map(mapProductRow);
}

export function getFeaturedProducts() {
  return getProducts().filter((product) => product.featured);
}

export function getProductBySlug(slug: string) {
  const row = db
    .prepare(`
      SELECT
        products.*,
        categories.slug as category_slug,
        categories.name as category_name
      FROM products
      INNER JOIN categories ON categories.id = products.category_id
      WHERE products.slug = ?
    `)
    .get(slug) as
    | (Record<string, unknown> & {
        specs_json: string;
        featured: number;
        in_stock: number;
      })
    | undefined;

  return row ? mapProductRow(row) : undefined;
}

export function getDashboardStats() {
  const counts = db
    .prepare(`
      SELECT
        (SELECT COUNT(*) FROM products) as productsCount,
        (SELECT COUNT(*) FROM categories) as categoriesCount,
        (SELECT COUNT(*) FROM orders) as ordersCount,
        (SELECT COALESCE(SUM(amount_total), 0) FROM orders WHERE payment_status = 'paid') as paidRevenue
    `)
    .get() as {
    productsCount: number;
    categoriesCount: number;
    ordersCount: number;
    paidRevenue: number;
  };
  return counts;
}

export function createCategory(input: {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
}) {
  db.prepare(
    "INSERT INTO categories (slug, name, description, sort_order) VALUES (?, ?, ?, ?)",
  ).run(input.slug, input.name, input.description, input.sortOrder);
}

export function updateCategory(input: CategoryRecord) {
  db.prepare(
    "UPDATE categories SET slug = ?, name = ?, description = ?, sort_order = ? WHERE id = ?",
  ).run(input.slug, input.name, input.description, input.sortOrder, input.id);
}

export function deleteCategory(id: number) {
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
}

export function getCategoryUsageCount(id: number) {
  const result = db
    .prepare("SELECT COUNT(*) as count FROM products WHERE category_id = ?")
    .get(id) as { count: number };
  return result.count;
}

export function createProduct(input: {
  slug: string;
  name: string;
  categoryId: number;
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
  db.prepare(`
    INSERT INTO products (
      slug, name, category_id, price, compare_at_price,
      short_description, description, image, badge, featured, in_stock, sku, specs_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.slug,
    input.name,
    input.categoryId,
    input.price,
    input.compareAtPrice,
    input.shortDescription,
    input.description,
    input.image,
    input.badge,
    input.featured ? 1 : 0,
    input.inStock ? 1 : 0,
    input.sku,
    JSON.stringify(input.specs),
  );
}

export function updateProduct(input: {
  id: number;
  slug: string;
  name: string;
  categoryId: number;
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
  db.prepare(`
    UPDATE products
    SET slug = ?, name = ?, category_id = ?, price = ?, compare_at_price = ?,
        short_description = ?, description = ?, image = ?, badge = ?, featured = ?,
        in_stock = ?, sku = ?, specs_json = ?
    WHERE id = ?
  `).run(
    input.slug,
    input.name,
    input.categoryId,
    input.price,
    input.compareAtPrice,
    input.shortDescription,
    input.description,
    input.image,
    input.badge,
    input.featured ? 1 : 0,
    input.inStock ? 1 : 0,
    input.sku,
    JSON.stringify(input.specs),
    input.id,
  );
}

export function deleteProduct(id: number) {
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

export function createOrder(input: {
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
  const insertOrder = db.prepare(`
    INSERT OR REPLACE INTO orders (
      stripe_session_id, customer_email, amount_total, currency,
      payment_status, fulfillment_status, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  const result = insertOrder.run(
    input.stripeSessionId,
    input.customerEmail,
    input.amountTotal,
    input.currency,
    input.paymentStatus,
    input.fulfillmentStatus,
  );

  const orderId = Number(result.lastInsertRowid);
  db.prepare("DELETE FROM order_items WHERE order_id = ?").run(orderId);

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_slug, product_name, quantity, unit_price)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const item of input.items) {
    insertItem.run(
      orderId,
      item.productSlug,
      item.productName,
      item.quantity,
      item.unitPrice,
    );
  }

  return orderId;
}

export function getOrders(): OrderRecord[] {
  return db
    .prepare(`
      SELECT
        id,
        stripe_session_id as stripeSessionId,
        customer_email as customerEmail,
        amount_total as amountTotal,
        currency,
        payment_status as paymentStatus,
        fulfillment_status as fulfillmentStatus,
        created_at as createdAt,
        updated_at as updatedAt
      FROM orders
      ORDER BY datetime(created_at) DESC
    `)
    .all() as OrderRecord[];
}

export function getOrderItems(orderId: number): OrderItemRecord[] {
  return db
    .prepare(`
      SELECT
        id,
        order_id as orderId,
        product_name as productName,
        product_slug as productSlug,
        quantity,
        unit_price as unitPrice
      FROM order_items
      WHERE order_id = ?
      ORDER BY id ASC
    `)
    .all(orderId) as OrderItemRecord[];
}

export function getOrderBySessionId(stripeSessionId: string) {
  return db
    .prepare(`
      SELECT
        id,
        stripe_session_id as stripeSessionId,
        customer_email as customerEmail,
        amount_total as amountTotal,
        currency,
        payment_status as paymentStatus,
        fulfillment_status as fulfillmentStatus,
        created_at as createdAt,
        updated_at as updatedAt
      FROM orders
      WHERE stripe_session_id = ?
    `)
    .get(stripeSessionId) as OrderRecord | undefined;
}

export function updateOrderPaymentStatus(
  stripeSessionId: string,
  paymentStatus: string,
  customerEmail: string | null,
) {
  db.prepare(`
    UPDATE orders
    SET payment_status = ?, customer_email = ?, updated_at = CURRENT_TIMESTAMP
    WHERE stripe_session_id = ?
  `).run(paymentStatus, customerEmail, stripeSessionId);
}

export function updateOrderFulfillmentStatus(orderId: number, status: string) {
  db.prepare(`
    UPDATE orders
    SET fulfillment_status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, orderId);
}
