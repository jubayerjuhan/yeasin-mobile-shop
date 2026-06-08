import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/admin/actions";
import { getCategories } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  const categories = getCategories();

  return (
    <div className="admin-page">
      <div className="admin-section">
        <h2>Create category</h2>
        <form action={createCategoryAction} className="admin-form-grid">
          <input name="name" placeholder="Category name" required />
          <input name="slug" placeholder="category-slug" required />
          <input name="sortOrder" type="number" placeholder="Sort order" defaultValue={0} />
          <textarea name="description" placeholder="Description" rows={3} />
          <button className="btn primary" type="submit">
            Create Category
          </button>
        </form>
      </div>

      <div className="admin-section">
        <h2>Edit categories</h2>
        <div className="admin-stack">
          {categories.map((category) => (
            <form action={updateCategoryAction} className="admin-record" key={category.id}>
              <input type="hidden" name="id" value={category.id} />
              <div className="admin-form-grid">
                <input name="name" defaultValue={category.name} required />
                <input name="slug" defaultValue={category.slug} required />
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={category.sortOrder}
                  required
                />
                <textarea
                  name="description"
                  defaultValue={category.description}
                  rows={3}
                />
              </div>
              <div className="admin-record-actions">
                <button className="btn primary" type="submit">
                  Save
                </button>
              </div>
            </form>
          ))}
          {categories.map((category) => (
            <form action={deleteCategoryAction} className="inline-danger-form" key={`delete-${category.id}`}>
              <input type="hidden" name="id" value={category.id} />
              <button className="danger-button" type="submit">
                Delete {category.name}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
