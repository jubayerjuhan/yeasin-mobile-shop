import Link from "next/link";
import { logoutAction } from "./login/actions";
import { Toaster } from "@/components/toast/sonner";
import { LayoutDashboard, Package, Grid, ShoppingCart, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40 w-full flex">
      <aside className="fixed inset-y-0 left-0 z-10 w-64 flex flex-col border-r bg-background px-4 py-6">
        <div className="mb-8 px-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Admin Panel</p>
          <h1 className="text-2xl font-bold tracking-tight">Store Control</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground text-muted-foreground">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground text-muted-foreground">
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground text-muted-foreground">
            <Grid className="h-4 w-4" />
            Categories
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground text-muted-foreground">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </Link>
        </nav>
        
        <div className="mt-auto">
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-red-100 hover:text-red-700 text-red-600">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>
      
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
      
      <Toaster richColors position="top-right" />
    </div>
  );
}
