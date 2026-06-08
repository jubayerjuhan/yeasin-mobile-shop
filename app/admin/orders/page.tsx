import { updateOrderStatusAction } from "@/app/admin/actions";
import { getOrderItems, getOrdersPaginated } from "@/lib/db";
import { formatBdt } from "@/lib/money";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card/card";
import { Badge } from "@/components/badge/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select/select";
import { ActionForm, SubmitButton } from "@/components/form/admin-form";
import { Input } from "@/components/input/input";
import { Button, buttonVariants } from "@/components/button/button";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

const fulfillmentOptions = [
  "unfulfilled",
  "processing",
  "shipped",
  "completed",
  "canceled",
];

export default async function AdminOrdersPage(props: { searchParams: Promise<{ query?: string, page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || "1");
  const query = searchParams.query || "";
  
  const { orders, totalPages } = await getOrdersPaginated({ search: query, page, limit: 12 });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground mt-2">Manage customer orders and fulfillment status.</p>
        </div>
        
        <form method="GET" action="/admin/orders" className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              name="query" 
              type="search" 
              placeholder="Search session or email..." 
              className="pl-8 w-full md:w-[300px]" 
              defaultValue={query}
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.length === 0 && (
          <div className="col-span-full text-center p-12 border rounded-lg bg-muted/40">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        )}
        
        {await Promise.all(orders.map(async (order) => {
          const items = await getOrderItems(order.id);
          return (
            <Card key={order.id} className="flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                    <CardDescription className="font-mono text-xs mt-1" title={order.stripeSessionId}>
                      {order.stripeSessionId.slice(0, 18)}...
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                      {order.paymentStatus}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {order.fulfillmentStatus}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <div className="text-sm text-muted-foreground truncate mr-4">
                    {order.customerEmail ?? "No customer email"}
                  </div>
                  <div className="font-bold whitespace-nowrap">
                    {formatBdt(order.amountTotal)}
                  </div>
                </div>
                
                <ul className="space-y-3 flex-1 mb-6">
                  {items.map((item, index) => (
                    <li key={`${item.productSlug}-${index}`} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-2">
                        {item.productName} <span className="text-foreground font-medium">x{item.quantity}</span>
                      </span>
                      <span className="font-medium shrink-0">{formatBdt(item.unitPrice)}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4 border-t mt-auto space-y-4">
                  <ActionForm action={updateOrderStatusAction} className="flex gap-3">
                    <input type="hidden" name="id" value={order.id} />
                    <div className="flex-1">
                      <Select name="fulfillmentStatus" defaultValue={order.fulfillmentStatus}>
                        <SelectTrigger className="w-full">
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
                  <Link href={`/admin/orders/${order.id}`} className={buttonVariants({ variant: "outline", className: "w-full" })}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        }))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4 border-t">
          <Link href={`/admin/orders?page=${page - 1}${query ? `&query=${query}` : ""}`} className={buttonVariants({ variant: "outline", size: "icon", className: page <= 1 ? "pointer-events-none opacity-50" : "" })}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <span className="text-sm font-medium">Page {page} of {totalPages}</span>
          <Link href={`/admin/orders?page=${page + 1}${query ? `&query=${query}` : ""}`} className={buttonVariants({ variant: "outline", size: "icon", className: page >= totalPages ? "pointer-events-none opacity-50" : "" })}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
