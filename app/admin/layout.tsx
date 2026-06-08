import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <p className="eyebrow">Admin panel</p>
        <h1 className="admin-title">Store control</h1>
        <nav className="admin-nav">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/admin/orders">Orders</Link>
        </nav>
      </aside>
      <div className="admin-content">{children}</div>
    </section>
  );
}
