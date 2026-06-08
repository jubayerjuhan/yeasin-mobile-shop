import { getOrderById, getOrderItems } from "@/lib/db";
import { formatBdt } from "@/lib/money";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card/card";
import { Badge } from "@/components/badge/badge";
import { ActionForm, SubmitButton } from "@/components/form/admin-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select/select";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const fulfillmentOptions = [
  "unfulfilled",
  "processing",
  "shipped",
  "completed",
  "canceled",
];

export default async function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const order = await getOrderById(params.id);
  
  if (!order) {
    notFound();
  }

  const items = await getOrderItems(order.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Order #{order.id.slice(0, 8)}</h2>
          <p className="text-muted-foreground mt-2">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} × {formatBdt(item.unitPrice)}</p>
                  </div>
                  <div className="font-bold">
                    {formatBdt(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 mt-4">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">{formatBdt(order.amountTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.customerEmail || "N/A"}</p>
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-sm text-muted-foreground">Stripe Session</p>
                <p className="font-mono text-xs break-all">{order.stripeSessionId}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                  {order.paymentStatus}
                </Badge>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Fulfillment Status</p>
                <ActionForm action={updateOrderStatusAction} className="space-y-4">
                  <input type="hidden" name="id" value={order.id} />
                  <Select name="fulfillmentStatus" defaultValue={order.fulfillmentStatus}>
                    <SelectTrigger>
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
                  <SubmitButton label="Update Status" className="w-full" />
                </ActionForm>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
