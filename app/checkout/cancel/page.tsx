import Link from "next/link";

export default function CancelPage() {
  return (
    <section className="section status-page">
      <div className="status-card">
        <p className="eyebrow">Checkout canceled</p>
        <h1 className="page-title">Your payment was not completed.</h1>
        <p>You can return to the cart, adjust your items, and try checking out again.</p>
        <Link className="btn primary" href="/cart">
          Return to Cart
        </Link>
      </div>
    </section>
  );
}
