"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBdt } from "@/lib/money";
import { useStore } from "@/components/provider/store-provider";

export function CartPageClient() {
  const { cartItems, subtotal, updateQuantity, removeFromCart, products } =
    useStore();

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

  return (
    <section className="section cart-page">
      <div className="store-section-head">
        <div>
          <p className="eyebrow">Shopping cart</p>
          <h1 className="page-title">Review your selected tech picks.</h1>
        </div>
      </div>
      {detailedItems.length === 0 ? (
        <div className="empty-state large">
          <h2>No products in the cart yet</h2>
          <p>Add a featured phone, earbuds, or accessories bundle to keep going.</p>
          <Link className="btn primary" href="/#catalog">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {detailedItems.map((item) => (
              <article className="cart-row" key={item.product.slug}>
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={180}
                  height={180}
                />
                <div className="cart-row-copy">
                  <h2>{item.product.name}</h2>
                  <p>{item.product.shortDescription}</p>
                  <strong>{formatBdt(item.product.price)}</strong>
                  <div className="quantity-row">
                    <button
                      className="qty-button"
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.slug, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="qty-button"
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.slug, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="remove-link"
                      type="button"
                      onClick={() => removeFromCart(item.product.slug)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="summary-card">
            <p className="eyebrow">Order summary</p>
            <div className="totals-row">
              <span>Subtotal</span>
              <strong>{formatBdt(subtotal)}</strong>
            </div>
            <p className="summary-note">
              Delivery cost and final confirmation can be adjusted after Stripe
              checkout setup is connected to your live account.
            </p>
            <Link className="btn primary" href="/checkout">
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
