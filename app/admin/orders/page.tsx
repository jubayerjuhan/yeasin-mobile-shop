import { updateOrderStatusAction } from "@/app/admin/actions";
import { getOrderItems, getOrdersPaginated } from "@/lib/db";
import { formatBdt } from "@/lib/money";
import { Badge } from "@/components/badge/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select/select";
import { ActionForm, SubmitButton } from "@/components/form/admin-form";
import { Button, buttonVariants } from "@/components/button/button";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Eye, Package } from "lucide-react";

export const dynamic = "force-dynamic";

const fulfillmentOptions = [
  "unfulfilled",
  "processing",
  "shipped",
  "completed",
  "canceled",
];

function paymentBadgeClass(status: string) {
  if (status === "paid") return "admin-badge paid";
  if (status === "pending") return "admin-badge pending";
  return "admin-badge canceled";
}
function fulfillmentBadgeClass(status: string) {
  if (status === "completed") return "admin-badge paid";
  if (["processing", "shipped"].includes(status)) return "admin-badge processing";
  if (status === "canceled") return "admin-badge canceled";
  return "admin-badge secondary";
}

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || "1");
  const query = searchParams.query || "";

  const { orders, totalPages } = await getOrdersPaginated({ search: query, page, limit: 12 });

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">Manage customer orders and fulfillment status.</p>
        </div>

        <form method="GET" action="/admin/orders" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="admin-search-wrap">
            <Search />
            <input
              name="query"
              type="search"
              placeholder="Search session or email…"
              className="admin-search-input"
              defaultValue={query}
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-secondary">
            Search
          </button>
        </form>
      </div>

      {/* Orders grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 16,
        }}
      >
        {orders.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 24px",
              background: "var(--admin-surface)",
              borderRadius: 16,
              border: "1px solid var(--admin-border)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "var(--admin-surface-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Package style={{ width: 22, height: 22, color: "var(--admin-text-2)" }} />
            </div>
            <p style={{ margin: 0, color: "var(--admin-text-2)", fontSize: 14 }}>
              No orders found.
            </p>
          </div>
        )}

        {await Promise.all(
          orders.map(async (order) => {
            const items = await getOrderItems(order.id);
            return (
              <div key={order.id} className="admin-card" style={{ display: "flex", flexDirection: "column" }}>
                {/* Card header */}
                <div
                  style={{
                    padding: "18px 20px",
                    borderBottom: "1px solid var(--admin-border)",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: 15,
                        fontWeight: 750,
                        color: "var(--admin-text)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11,
                        fontFamily: "monospace",
                        color: "var(--admin-text-2)",
                      }}
                    >
                      {order.stripeSessionId.slice(0, 18)}…
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                    <span className={paymentBadgeClass(order.paymentStatus)}>
                      {order.paymentStatus}
                    </span>
                    <span className={fulfillmentBadgeClass(order.fulfillmentStatus)}>
                      {order.fulfillmentStatus}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "16px 20px", flexGrow: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                      paddingBottom: 16,
                      borderBottom: "1px solid var(--admin-border)",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: "var(--admin-text-2)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "60%",
                      }}
                    >
                      {order.customerEmail ?? "No email"}
                    </p>
                    <strong
                      style={{
                        fontSize: 16,
                        fontWeight: 750,
                        color: "var(--admin-text)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {formatBdt(order.amountTotal)}
                    </strong>
                  </div>

                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {items.map((item, index) => (
                      <li
                        key={`${item.productSlug}-${index}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 13,
                        }}
                      >
                        <span
                          style={{
                            color: "var(--admin-text-2)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.productName}{" "}
                          <span style={{ color: "var(--admin-text)", fontWeight: 700 }}>
                            ×{item.quantity}
                          </span>
                        </span>
                        <span style={{ color: "var(--admin-text)", fontWeight: 650, whiteSpace: "nowrap" }}>
                          {formatBdt(item.unitPrice)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card footer */}
                <div
                  style={{
                    padding: "16px 20px",
                    borderTop: "1px solid var(--admin-border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <ActionForm action={updateOrderStatusAction} className="flex gap-2">
                    <input type="hidden" name="id" value={order.id} />
                    <div style={{ flex: 1 }}>
                      <Select name="fulfillmentStatus" defaultValue={order.fulfillmentStatus}>
                        <SelectTrigger className="admin-input w-full" style={{ height: "auto" }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fulfillmentOptions.map((option) => (
                            <SelectItem key={option} value={option} className="capitalize">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <SubmitButton label="Update" />
                  </ActionForm>

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="admin-btn admin-btn-secondary"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", textDecoration: "none" }}
                  >
                    <Eye style={{ width: 14, height: 14 }} />
                    View Details
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <Link
            href={`/admin/orders?page=${page - 1}${query ? `&query=${query}` : ""}`}
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
            href={`/admin/orders?page=${page + 1}${query ? `&query=${query}` : ""}`}
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
  );
}
