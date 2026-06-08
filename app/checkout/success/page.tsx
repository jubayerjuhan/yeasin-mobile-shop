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
        <p className="eyebrow">Payment success</p>
        <h1 className="page-title">Stripe checkout completed.</h1>
        <p>
          Payment status is currently recorded as <strong>{paymentStatus}</strong>.
          The order is now visible in the admin panel for fulfillment tracking.
        </p>
        <Link className="btn ghost" href="/admin/orders">
          View Admin Orders
        </Link>
        <Link className="btn primary" href="/">
          Back to Store
        </Link>
      </div>
    </section>
  );
}
