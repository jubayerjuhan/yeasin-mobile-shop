"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckoutButton } from "@/components/button/checkout-button";
import { useStore } from "@/components/provider/store-provider";
import { formatBdt } from "@/lib/money";

export function CheckoutPageClient() {
  const { cartItems, subtotal, products } = useStore();

  const detailedItems = cartItems.reduce<
    Array<{
      slug: string;
      quantity: number;
      product: (typeof products)[number];
    }>
  >((accumulator, item) => {
      const product = products.find((entry) => entry.slug === item.slug);
      if (!product) {
        return accumulator;
      }
      accumulator.push({ ...item, product });
      return accumulator;
    }, []);

  if (detailedItems.length === 0) {
    return (
      <section className="section cart-page">
        <div className="empty-state large">
          <h1 className="page-title">Your checkout is empty</h1>
          <p>Select some products first, then come back to Stripe checkout.</p>
          <Link className="btn primary" href="/#catalog">
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section checkout-page">
      <div className="store-section-head">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="page-title">Stripe-ready payment flow for your store.</h1>
        </div>
      </div>
      <div className="cart-layout">
        <div className="cart-list checkout-list">
          {detailedItems.map((item) => (
            <article className="checkout-row" key={item.product.slug}>
              <Image
                src={item.product.image}
                alt={item.product.name}
                width={120}
                height={120}
              />
              <div className="cart-row-copy">
                <h2>{item.product.name}</h2>
                <p>
                  {item.quantity} x {formatBdt(item.product.price)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <aside className="summary-card">
          <p className="eyebrow">Payment summary</p>
          <div className="totals-row">
            <span>Subtotal</span>
            <strong>{formatBdt(subtotal)}</strong>
          </div>
          <p className="summary-note">
            Stripe hosted checkout is wired through the `/api/checkout` route.
            Add your live or test keys in `.env.local` to activate payments.
          </p>
          <CheckoutButton />
        </aside>
      </div>
    </section>
  );
}
