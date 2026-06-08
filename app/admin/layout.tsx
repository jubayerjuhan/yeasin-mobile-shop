import Link from "next/link";
import Image from "next/image";
import { logoutAction } from "./login/actions";
import { Toaster } from "@/components/toast/sonner";
import {
  LayoutDashboard,
  Package,
  Grid,
  ShoppingCart,
  LogOut,
  ExternalLink,
  Zap,
} from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Grid },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell dark">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <Link className="admin-sidebar-brand" href="/admin">
          <div className="admin-brand-mark">
            <Zap style={{ width: 18, height: 18, color: "var(--admin-accent)" }} />
          </div>
          <div className="admin-brand-name">
            <strong>Yeasin Shop</strong>
            <small>Admin Console</small>
          </div>
        </Link>

        {/* Nav */}
        <nav className="admin-nav">
          <p className="admin-nav-section">Navigation</p>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="admin-nav-link">
              <Icon />
              {label}
            </Link>
          ))}

          <p className="admin-nav-section" style={{ marginTop: 24 }}>Storefront</p>
          <Link
            href="/"
            className="admin-nav-link"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink />
            View Store
          </Link>
        </nav>

        {/* Logout */}
        <div className="admin-sidebar-footer">
          <form action={logoutAction}>
            <button type="submit" className="admin-logout-btn">
              <LogOut style={{ width: 16, height: 16 }} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {children}
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}
