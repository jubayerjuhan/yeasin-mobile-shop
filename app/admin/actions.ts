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

export async function createCategoryAction(state: any, formData: FormData) {
  try {
    await createCategory({
      slug: String(formData.get("slug") ?? ""),
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      sortOrder: toNumber(formData.get("sortOrder")),
    });
    revalidateStore();
    return { success: true, message: "Category created successfully!" };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create category" };
  }
}

export async function updateCategoryAction(state: any, formData: FormData) {
  try {
    await updateCategory({
      id: String(formData.get("id")),
      slug: String(formData.get("slug") ?? ""),
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      sortOrder: toNumber(formData.get("sortOrder")),
    });
    revalidateStore();
    return { success: true, message: "Category updated successfully!" };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update category" };
  }
}

export async function deleteCategoryAction(state: any, formData: FormData) {
  try {
    const id = String(formData.get("id"));
    if ((await getCategoryUsageCount(id)) > 0) {
      return { success: false, error: "This category still has products. Move or delete them first." };
    }
    await deleteCategory(id);
    revalidateStore();
    return { success: true, message: "Category deleted successfully!" };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete category" };
  }
}

export async function createProductAction(state: any, formData: FormData) {
  try {
    await createProduct({
      slug: String(formData.get("slug") ?? ""),
      name: String(formData.get("name") ?? ""),
      categoryId: String(formData.get("categoryId")),
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
    return { success: true, message: "Product created successfully!" };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create product" };
  }
}

export async function updateProductAction(state: any, formData: FormData) {
  try {
    await updateProduct({
      id: String(formData.get("id")),
      slug: String(formData.get("slug") ?? ""),
      name: String(formData.get("name") ?? ""),
      categoryId: String(formData.get("categoryId")),
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
    return { success: true, message: "Product updated successfully!" };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update product" };
  }
}

export async function deleteProductAction(state: any, formData: FormData) {
  try {
    await deleteProduct(String(formData.get("id")));
    revalidateStore();
    return { success: true, message: "Product deleted successfully!" };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete product" };
  }
}

export async function updateOrderStatusAction(state: any, formData: FormData) {
  try {
    await updateOrderFulfillmentStatus(
      String(formData.get("id")),
      String(formData.get("fulfillmentStatus") ?? "unfulfilled"),
    );
    revalidatePath("/admin/orders");
    return { success: true, message: "Order status updated successfully!" };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update order" };
  }
}
