import { formatBdt } from "@/lib/money";
import { getDashboardStats, getOrders, getProducts, getCategories } from "@/lib/db";
import { Package, Grid, ShoppingCart, TrendingUp, ArrowUpRight, Circle } from "lucide-react";

export const dynamic = "force-dynamic";

function getStatusClass(status: string) {
  if (status === "paid") return "admin-badge paid";
  if (status === "pending") return "admin-badge pending";
  if (["canceled", "failed"].includes(status)) return "admin-badge canceled";
  return "admin-badge secondary";
}

function getFulfillmentClass(status: string) {
  if (status === "completed") return "admin-badge paid";
  if (["processing", "shipped"].includes(status)) return "admin-badge processing";
  if (status === "canceled") return "admin-badge canceled";
  return "admin-badge secondary";
}

const kpiIcons = [
  { icon: Package, color: "hsl(262, 78%, 62%)", bg: "hsla(262, 78%, 62%, 0.12)" },
  { icon: Grid, color: "hsl(200, 80%, 60%)", bg: "hsla(200, 80%, 60%, 0.12)" },
  { icon: ShoppingCart, color: "hsl(142, 72%, 50%)", bg: "hsla(142, 72%, 50%, 0.12)" },
  { icon: TrendingUp, color: "hsl(38, 92%, 55%)", bg: "hsla(38, 92%, 55%, 0.12)" },
];

export default async function AdminPage() {
  const stats = await getDashboardStats();
  const allOrders = await getOrders();
  const recentOrders = allOrders.slice(0, 6);
  const allProducts = await getProducts();
  const categories = await getCategories();

  const kpis = [
    { title: "Total Products", value: stats.productsCount, change: "+2 this week" },
    { title: "Categories", value: stats.categoriesCount, change: "Active" },
    { title: "Total Orders", value: stats.ordersCount, change: "All time" },
    { title: "Paid Revenue", value: formatBdt(stats.paidRevenue), change: "Confirmed" },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header" style={{ marginBottom: 40 }}>
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">
            Here&apos;s a snapshot of your store&apos;s performance.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            background: "var(--admin-green-bg)",
            borderRadius: 999,
            border: "1px solid hsla(142, 72%, 50%, 0.2)",
            color: "var(--admin-green)",
            fontSize: 13,
            fontWeight: 650,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--admin-green)",
              animation: "pulse 2s infinite",
            }}
          />
          Store live
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        {kpis.map((kpi, i) => {
          const { icon: Icon, color, bg } = kpiIcons[i];
          return (
            <div key={kpi.title} className="admin-card stat-card">
              <div className="admin-card-header">
                <div>
                  <p className="admin-card-title">{kpi.title}</p>
                  <p className="admin-card-value">{kpi.value}</p>
                </div>
                <div className="admin-card-icon" style={{ background: bg }}>
                  <Icon style={{ width: 20, height: 20, color }} />
                </div>
              </div>
              <div className="admin-card-content">
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "var(--admin-text-2)",
                    fontWeight: 500,
                  }}
                >
                  {kpi.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tables row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 20,
        }}
      >
        {/* Recent orders */}
        <div className="admin-card">
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--admin-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--admin-text)",
                  letterSpacing: "-0.02em",
                }}
              >
                Recent Orders
              </h2>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: 13,
                  color: "var(--admin-text-2)",
                }}
              >
                Latest {recentOrders.length} transactions
              </p>
            </div>
            <a
              href="/admin/orders"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 13,
                fontWeight: 650,
                color: "var(--admin-accent)",
                textDecoration: "none",
              }}
            >
              View all
              <ArrowUpRight style={{ width: 13, height: 13 }} />
            </a>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Payment</th>
                  <th>Fulfillment</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 12,
                          color: "var(--admin-text-2)",
                        }}
                      >
                        {order.stripeSessionId.slice(0, 16)}…
                      </span>
                    </td>
                    <td>
                      <span className={getStatusClass(order.paymentStatus)}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={getFulfillmentClass(order.fulfillmentStatus)}>
                        {order.fulfillmentStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, fontSize: 14 }}>
                      {formatBdt(order.amountTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categories */}
        <div className="admin-card">
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--admin-border)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: "var(--admin-text)",
                letterSpacing: "-0.02em",
              }}
            >
              Categories
            </h2>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 13,
                color: "var(--admin-text-2)",
              }}
            >
              Active product groups
            </p>
          </div>
          <div style={{ padding: "8px 0" }}>
            {categories.slice(0, 6).map((category, i) => (
              <div
                key={category.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 24px",
                  borderBottom:
                    i < Math.min(categories.length, 6) - 1
                      ? "1px solid var(--admin-border)"
                      : "none",
                  transition: "background 0.15s ease",
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: `hsl(${(i * 47 + 220) % 360}, 70%, 62%)`,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 650,
                      color: "var(--admin-text)",
                    }}
                  >
                    {category.name}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "var(--admin-text-2)",
                      fontFamily: "monospace",
                    }}
                  >
                    {category.slug}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 1100px) {
          .admin-kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
