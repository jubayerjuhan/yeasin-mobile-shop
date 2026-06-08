import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/app/admin/actions";
import { getCategories, getProductsPaginated } from "@/lib/db";
import { ImageUploader } from "@/components/image-uploader/image-uploader";
import { AdminForm, ActionForm, SubmitButton } from "@/components/form/admin-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select/select";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Trash2, Plus } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage(props: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || "1");
  const query = searchParams.query || "";

  const { products, totalPages } = await getProductsPaginated({ search: query, page, limit: 12 });
  const categories = await getCategories();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">Manage your catalog, pricing, and stock.</p>
        </div>

        <form method="GET" action="/admin/products" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="admin-search-wrap">
            <Search />
            <input
              name="query"
              type="search"
              placeholder="Search name or SKU…"
              className="admin-search-input"
              defaultValue={query}
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-secondary">
            Search
          </button>
        </form>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, alignItems: "start" }}>
        {/* Create form */}
        <div className="admin-card" style={{ position: "sticky", top: 24 }}>
          <div
            style={{
              padding: "18px 20px",
              borderBottom: "1px solid var(--admin-border)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "var(--admin-accent-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus style={{ width: 14, height: 14, color: "var(--admin-accent)" }} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--admin-text)",
                  letterSpacing: "-0.02em",
                }}
              >
                Create Product
              </h2>
              <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-2)" }}>
                Add a new device or accessory
              </p>
            </div>
          </div>
          <div style={{ padding: "20px" }}>
            <AdminForm action={createProductAction} submitLabel="Create Product" className="space-y-4">
              {[
                { id: "name", label: "Name", placeholder: "iPhone 15 Pro" },
                { id: "slug", label: "Slug", placeholder: "iphone-15-pro" },
                { id: "sku", label: "SKU", placeholder: "IP15P-256-BLK" },
              ].map(({ id, label, placeholder }) => (
                <div key={id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label className="admin-label" htmlFor={`create-${id}`}>{label}</label>
                  <input className="admin-input" id={`create-${id}`} name={id} placeholder={placeholder} required />
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label className="admin-label" htmlFor="create-categoryId">Category</label>
                <Select name="categoryId" required>
                  <SelectTrigger className="admin-input" style={{ height: "auto" }}><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label className="admin-label">Price (BDT)</label>
                  <input className="admin-input" name="price" type="number" placeholder="150000" required />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label className="admin-label">Compare At</label>
                  <input className="admin-input" name="compareAtPrice" type="number" placeholder="160000" />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label className="admin-label">Product Image</label>
                <ImageUploader name="image" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label className="admin-label">Badge</label>
                <input className="admin-input" name="badge" placeholder="New / Hot" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label className="admin-label">Short Description</label>
                <textarea
                  name="shortDescription"
                  className="admin-input admin-textarea"
                  rows={2}
                  required
                  placeholder="Brief product description…"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label className="admin-label">Detailed Description</label>
                <textarea
                  name="description"
                  className="admin-input admin-textarea"
                  rows={4}
                  required
                  placeholder="Full product description…"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label className="admin-label">Specs (one per line)</label>
                <textarea
                  name="specs"
                  className="admin-input admin-textarea"
                  rows={4}
                  placeholder="6.1-inch display&#10;A17 Pro chip&#10;…"
                />
              </div>
              <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
                <label className="admin-checkbox-wrapper">
                  <input type="checkbox" name="featured" className="admin-checkbox-input" />
                  <span className="admin-checkbox-label">Featured</span>
                </label>
                <label className="admin-checkbox-wrapper">
                  <input type="checkbox" name="inStock" defaultChecked className="admin-checkbox-input" />
                  <span className="admin-checkbox-label">In Stock</span>
                </label>
              </div>
            </AdminForm>
          </div>
        </div>

        {/* Product list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {products.length === 0 && (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                background: "var(--admin-surface)",
                borderRadius: 16,
                border: "1px solid var(--admin-border)",
              }}
            >
              <p style={{ margin: 0, color: "var(--admin-text-2)", fontSize: 14 }}>
                No products found. Create one or try a different search.
              </p>
            </div>
          )}

          {products.map((product) => (
            <div key={product.id} className="admin-card">
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  {/* Product image thumbnail */}
                  {product.image && (
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 12,
                        background: "var(--admin-surface-2)",
                        border: "1px solid var(--admin-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        overflow: "hidden",
                        padding: 8,
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={64}
                        height={64}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  )}

                  <div style={{ flex: 1 }}><ActionForm action={updateProductAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                      {[
                        { label: "Name", name: "name", value: product.name },
                        { label: "Slug", name: "slug", value: product.slug },
                        { label: "SKU", name: "sku", value: product.sku },
                      ].map(({ label, name, value }) => (
                        <div key={name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <label className="admin-label">{label}</label>
                          <input className="admin-input" name={name} defaultValue={value} required />
                        </div>
                      ))}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="admin-label">Category</label>
                        <Select name="categoryId" defaultValue={product.categoryId} required>
                          <SelectTrigger className="admin-input" style={{ height: "auto" }}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="admin-label">Price (BDT)</label>
                        <input className="admin-input" name="price" type="number" defaultValue={product.price} required />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="admin-label">Compare At</label>
                        <input className="admin-input" name="compareAtPrice" type="number" defaultValue={product.compareAtPrice ?? ""} />
                      </div>
                      <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="admin-label">Product Image</label>
                        <ImageUploader name="image" defaultValue={product.image} />
                      </div>
                      <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="admin-label">Badge</label>
                        <input className="admin-input" name="badge" defaultValue={product.badge ?? ""} />
                      </div>
                      <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="admin-label">Short Description</label>
                        <textarea
                          name="shortDescription"
                          defaultValue={product.shortDescription}
                          className="admin-input admin-textarea"
                          rows={2}
                          required
                        />
                      </div>
                      <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="admin-label">Description</label>
                        <textarea
                          name="description"
                          defaultValue={product.description}
                          className="admin-input admin-textarea"
                          rows={3}
                          required
                        />
                      </div>
                      <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="admin-label">Specs (one per line)</label>
                        <textarea
                          name="specs"
                          defaultValue={product.specs.join("\n")}
                          className="admin-input admin-textarea"
                          rows={3}
                        />
                      </div>
                      <div style={{ gridColumn: "1 / -1", display: "flex", gap: 24, marginTop: 8 }}>
                        <label className="admin-checkbox-wrapper">
                          <input type="checkbox" name="featured" defaultChecked={product.featured} className="admin-checkbox-input" />
                          <span className="admin-checkbox-label">Featured</span>
                        </label>
                        <label className="admin-checkbox-wrapper">
                          <input type="checkbox" name="inStock" defaultChecked={product.inStock} className="admin-checkbox-input" />
                          <span className="admin-checkbox-label">In Stock</span>
                        </label>
                      </div>
                    </div>
                      <SubmitButton label="Save Changes" />
                  </ActionForm></div>

                  {/* Delete */}
                  <div style={{ paddingTop: 4 }}>
                    <ActionForm action={deleteProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <SubmitButton
                        label={<><Trash2 style={{ width: 14, height: 14 }} /><span className="sr-only">Delete</span></>}
                        variant="destructive"
                        className="admin-btn admin-btn-danger admin-btn-icon"
                      />
                    </ActionForm>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <Link
                href={`/admin/products?page=${page - 1}${query ? `&query=${query}` : ""}`}
                className="admin-btn admin-btn-secondary admin-btn-icon"
                style={{
                  opacity: page <= 1 ? 0.4 : 1,
                  pointerEvents: page <= 1 ? "none" : "auto",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronLeft style={{ width: 16, height: 16 }} />
              </Link>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text-2)" }}>
                Page {page} of {totalPages}
              </span>
              <Link
                href={`/admin/products?page=${page + 1}${query ? `&query=${query}` : ""}`}
                className="admin-btn admin-btn-secondary admin-btn-icon"
                style={{
                  opacity: page >= totalPages ? 0.4 : 1,
                  pointerEvents: page >= totalPages ? "none" : "auto",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
