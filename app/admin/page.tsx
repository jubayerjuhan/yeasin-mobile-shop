import { formatBdt } from "@/lib/money";
import { getDashboardStats, getOrders, getProducts, getCategories } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const stats = getDashboardStats();
  const recentOrders = getOrders().slice(0, 5);
  const products = getProducts().slice(0, 5);
  const categories = getCategories();

  return (
    <div className="admin-page">
      <div className="admin-grid">
        <article className="admin-stat-card">
          <span>Products</span>
          <strong>{stats.productsCount}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Categories</span>
          <strong>{stats.categoriesCount}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Orders</span>
          <strong>{stats.ordersCount}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Paid revenue</span>
          <strong>{formatBdt(stats.paidRevenue)}</strong>
        </article>
      </div>

      <div className="admin-section">
        <h2>Recent orders</h2>
        <div className="admin-table">
          <div className="admin-table-head">
            <span>Session</span>
            <span>Payment</span>
            <span>Fulfillment</span>
            <span>Total</span>
          </div>
          {recentOrders.map((order) => (
            <div className="admin-table-row" key={order.id}>
              <span>{order.stripeSessionId.slice(0, 18)}...</span>
              <span>{order.paymentStatus}</span>
              <span>{order.fulfillmentStatus}</span>
              <span>{formatBdt(order.amountTotal)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-grid two-up">
        <div className="admin-section">
          <h2>Current categories</h2>
          <ul className="admin-list">
            {categories.map((category) => (
              <li key={category.id}>
                <strong>{category.name}</strong>
                <span>{category.slug}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="admin-section">
          <h2>Featured catalog snapshot</h2>
          <ul className="admin-list">
            {products.map((product) => (
              <li key={product.id}>
                <strong>{product.name}</strong>
                <span>{formatBdt(product.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
