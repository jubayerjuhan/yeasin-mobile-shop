import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/app/admin/actions";
import { getCategories, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  const products = getProducts();
  const categories = getCategories();

  return (
    <div className="admin-page">
      <div className="admin-section">
        <h2>Create product</h2>
        <form action={createProductAction} className="admin-form-grid">
          <input name="name" placeholder="Product name" required />
          <input name="slug" placeholder="product-slug" required />
          <select name="categoryId" required defaultValue="">
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input name="sku" placeholder="SKU" required />
          <input name="price" type="number" placeholder="Price in BDT" required />
          <input name="compareAtPrice" type="number" placeholder="Compare at price" />
          <input name="image" placeholder="/assets/product-smartphone.png" required />
          <input name="badge" placeholder="Featured / New / Bundle" />
          <textarea name="shortDescription" placeholder="Short description" rows={2} required />
          <textarea name="description" placeholder="Long description" rows={4} required />
          <textarea
            name="specs"
            placeholder={"One spec per line\n256GB storage\n120Hz display"}
            rows={4}
          />
          <label className="checkbox-row">
            <input name="featured" type="checkbox" />
            <span>Featured</span>
          </label>
          <label className="checkbox-row">
            <input name="inStock" type="checkbox" defaultChecked />
            <span>In stock</span>
          </label>
          <button className="btn primary" type="submit">
            Create Product
          </button>
        </form>
      </div>

      <div className="admin-section">
        <h2>Edit products</h2>
        <div className="admin-stack">
          {products.map((product) => (
            <form action={updateProductAction} className="admin-record" key={product.id}>
              <input type="hidden" name="id" value={product.id} />
              <div className="admin-form-grid">
                <input name="name" defaultValue={product.name} required />
                <input name="slug" defaultValue={product.slug} required />
                <select name="categoryId" defaultValue={product.categoryId} required>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input name="sku" defaultValue={product.sku} required />
                <input name="price" type="number" defaultValue={product.price} required />
                <input
                  name="compareAtPrice"
                  type="number"
                  defaultValue={product.compareAtPrice ?? ""}
                />
                <input name="image" defaultValue={product.image} required />
                <input name="badge" defaultValue={product.badge ?? ""} />
                <textarea
                  name="shortDescription"
                  defaultValue={product.shortDescription}
                  rows={2}
                  required
                />
                <textarea
                  name="description"
                  defaultValue={product.description}
                  rows={4}
                  required
                />
                <textarea
                  name="specs"
                  defaultValue={product.specs.join("\n")}
                  rows={4}
                />
                <label className="checkbox-row">
                  <input name="featured" type="checkbox" defaultChecked={product.featured} />
                  <span>Featured</span>
                </label>
                <label className="checkbox-row">
                  <input name="inStock" type="checkbox" defaultChecked={product.inStock} />
                  <span>In stock</span>
                </label>
              </div>
              <div className="admin-record-actions">
                <button className="btn primary" type="submit">
                  Save
                </button>
              </div>
            </form>
          ))}

          {products.map((product) => (
            <form action={deleteProductAction} className="inline-danger-form" key={`delete-${product.id}`}>
              <input type="hidden" name="id" value={product.id} />
              <button className="danger-button" type="submit">
                Delete {product.name}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
