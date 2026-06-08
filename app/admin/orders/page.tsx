import { updateOrderStatusAction } from "@/app/admin/actions";
import { getOrderItems, getOrders } from "@/lib/db";
import { formatBdt } from "@/lib/money";

export const dynamic = "force-dynamic";

const fulfillmentOptions = [
  "unfulfilled",
  "processing",
  "shipped",
  "completed",
  "canceled",
];

export default function AdminOrdersPage() {
  const orders = getOrders();

  return (
    <div className="admin-page">
      <div className="admin-section">
        <h2>Orders and status</h2>
        <div className="admin-stack">
          {orders.length === 0 ? (
            <p className="muted-copy">No orders yet. Once checkout creates a Stripe session, orders will appear here.</p>
          ) : null}
          {orders.map((order) => {
            const items = getOrderItems(order.id);
            return (
              <article className="order-card" key={order.id}>
                <div className="order-top">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p>{order.stripeSessionId}</p>
                  </div>
                  <div className="order-badges">
                    <span className="order-badge">{order.paymentStatus}</span>
                    <span className="order-badge secondary">{order.fulfillmentStatus}</span>
                  </div>
                </div>
                <div className="order-meta">
                  <span>{order.customerEmail ?? "No customer email yet"}</span>
                  <strong>{formatBdt(order.amountTotal)}</strong>
                </div>
                <ul className="order-items">
                  {items.map((item) => (
                    <li key={item.id}>
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <strong>{formatBdt(item.unitPrice)}</strong>
                    </li>
                  ))}
                </ul>
                <form action={updateOrderStatusAction} className="order-form">
                  <input type="hidden" name="id" value={order.id} />
                  <select
                    name="fulfillmentStatus"
                    defaultValue={order.fulfillmentStatus}
                  >
                    {fulfillmentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <button className="btn primary" type="submit">
                    Update Status
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
