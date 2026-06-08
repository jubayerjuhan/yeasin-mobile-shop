import Link from "next/link";
import Stripe from "stripe";
import { getOrderBySessionId, updateOrderPaymentStatus } from "@/lib/db";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  let paymentStatus = "paid";

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paymentStatus = session.payment_status === "paid" ? "paid" : session.payment_status;
    const existing = await getOrderBySessionId(sessionId);
    if (existing) {
      await updateOrderPaymentStatus(sessionId, paymentStatus, session.customer_details?.email ?? null);
    }
  }

  return (
    <section className="section status-page">
      <div className="status-card">
        <p className="eyebrow">Order Confirmed</p>
        <h1 className="page-title">Thank you for your purchase!</h1>
        <p>
          Your order has been received successfully. We are currently processing it and will contact you shortly to confirm your delivery details.
        </p>
        <Link className="btn primary" href="/">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}
