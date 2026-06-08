import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/admin/actions";
import { getCategories } from "@/lib/db";
import { Input } from "@/components/input/input";
import { AdminForm, ActionForm, SubmitButton } from "@/components/form/admin-form";
import { Trash2, Plus, FolderOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-subtitle">Manage product categories for your store.</p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            background: "var(--admin-surface)",
            borderRadius: 999,
            border: "1px solid var(--admin-border)",
            color: "var(--admin-text-2)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <FolderOpen style={{ width: 14, height: 14 }} />
          {categories.length} categories
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>
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
                Create Category
              </h2>
              <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-2)" }}>
                Add a new product group
              </p>
            </div>
          </div>
          <div style={{ padding: "20px" }}>
            <AdminForm action={createCategoryAction} submitLabel="Create Category" className="space-y-4">
              {[
                { id: "name", label: "Name", placeholder: "Accessories", type: "text" },
                { id: "slug", label: "Slug", placeholder: "accessories", type: "text" },
                { id: "sortOrder", label: "Sort Order", placeholder: "0", type: "number" },
                { id: "description", label: "Description", placeholder: "Optional description…", type: "text" },
              ].map(({ id, label, placeholder, type }) => (
                <div key={id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label className="admin-label" htmlFor={`create-cat-${id}`}>{label}</label>
                  <input
                    className="admin-input"
                    id={`create-cat-${id}`}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    defaultValue={id === "sortOrder" ? 0 : undefined}
                    required={id !== "description"}
                  />
                </div>
              ))}
            </AdminForm>
          </div>
        </div>

        {/* Categories list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {categories.length === 0 && (
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
                No categories found. Create one to get started.
              </p>
            </div>
          )}

          {categories.map((category, i) => (
            <div key={category.id} className="admin-card">
              <div style={{ padding: "20px" }}>
                {/* Category label */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottom: "1px solid var(--admin-border)",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: `hsl(${(i * 47 + 220) % 360}, 70%, 62%)`,
                      flexShrink: 0,
                    }}
                  />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--admin-text)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {category.name}
                  </h3>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: "var(--admin-text-2)",
                      background: "var(--admin-surface-2)",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {category.slug}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}><ActionForm action={updateCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="admin-label" htmlFor={`name-${category.id}`}>Name</label>
                        <input
                          className="admin-input"
                          id={`name-${category.id}`}
                          name="name"
                          defaultValue={category.name}
                          required
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="admin-label" htmlFor={`slug-${category.id}`}>Slug</label>
                        <input
                          className="admin-input"
                          id={`slug-${category.id}`}
                          name="slug"
                          defaultValue={category.slug}
                          required
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="admin-label" htmlFor={`sortOrder-${category.id}`}>Sort Order</label>
                        <input
                          className="admin-input"
                          id={`sortOrder-${category.id}`}
                          name="sortOrder"
                          type="number"
                          defaultValue={category.sortOrder}
                          required
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label className="admin-label" htmlFor={`description-${category.id}`}>Description</label>
                        <input
                          className="admin-input"
                          id={`description-${category.id}`}
                          name="description"
                          defaultValue={category.description}
                          placeholder="Optional…"
                        />
                      </div>
                    </div>
                    <SubmitButton label="Save Changes" />
                  </ActionForm></div>

                  {/* Delete button */}
                  <div style={{ paddingTop: 22 }}>
                    <ActionForm action={deleteCategoryAction}>
                      <input type="hidden" name="id" value={category.id} />
                      <SubmitButton
                        label={
                          <>
                            <Trash2 style={{ width: 14, height: 14 }} />
                            <span className="sr-only">Delete</span>
                          </>
                        }
                        variant="destructive"
                        className="admin-btn admin-btn-danger admin-btn-icon"
                      />
                    </ActionForm>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
