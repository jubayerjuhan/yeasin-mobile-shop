"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getCategoryUsageCount,
  updateCategory,
  updateOrderFulfillmentStatus,
  updateProduct,
} from "@/lib/db";

function toNumber(value: FormDataEntryValue | null) {
  return value ? Number(value) : 0;
}

function toNullableNumber(value: FormDataEntryValue | null) {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStringArray(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function revalidateStore() {
  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/orders");
}

export async function createCategoryAction(formData: FormData) {
  createCategory({
    slug: String(formData.get("slug") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    sortOrder: toNumber(formData.get("sortOrder")),
  });
  revalidateStore();
}

export async function updateCategoryAction(formData: FormData) {
  updateCategory({
    id: toNumber(formData.get("id")),
    slug: String(formData.get("slug") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    sortOrder: toNumber(formData.get("sortOrder")),
  });
  revalidateStore();
}

export async function deleteCategoryAction(formData: FormData) {
  const id = toNumber(formData.get("id"));
  if (getCategoryUsageCount(id) > 0) {
    throw new Error("This category still has products. Move or delete them first.");
  }
  deleteCategory(id);
  revalidateStore();
}

export async function createProductAction(formData: FormData) {
  createProduct({
    slug: String(formData.get("slug") ?? ""),
    name: String(formData.get("name") ?? ""),
    categoryId: toNumber(formData.get("categoryId")),
    price: toNumber(formData.get("price")),
    compareAtPrice: toNullableNumber(formData.get("compareAtPrice")),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? ""),
    badge: String(formData.get("badge") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
    inStock: formData.get("inStock") === "on",
    sku: String(formData.get("sku") ?? ""),
    specs: toStringArray(formData.get("specs")),
  });
  revalidateStore();
}

export async function updateProductAction(formData: FormData) {
  updateProduct({
    id: toNumber(formData.get("id")),
    slug: String(formData.get("slug") ?? ""),
    name: String(formData.get("name") ?? ""),
    categoryId: toNumber(formData.get("categoryId")),
    price: toNumber(formData.get("price")),
    compareAtPrice: toNullableNumber(formData.get("compareAtPrice")),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? ""),
    badge: String(formData.get("badge") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
    inStock: formData.get("inStock") === "on",
    sku: String(formData.get("sku") ?? ""),
    specs: toStringArray(formData.get("specs")),
  });
  revalidateStore();
}

export async function deleteProductAction(formData: FormData) {
  deleteProduct(toNumber(formData.get("id")));
  revalidateStore();
}

export async function updateOrderStatusAction(formData: FormData) {
  updateOrderFulfillmentStatus(
    toNumber(formData.get("id")),
    String(formData.get("fulfillmentStatus") ?? "unfulfilled"),
  );
  revalidatePath("/admin/orders");
}
