"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBdt } from "@/lib/money";
import { useStore } from "@/components/provider/store-provider";

export function CartDrawer() {
  const {
    cartItems,
    closeCart,
    isCartOpen,
    subtotal,
    totalItems,
    updateQuantity,
    removeFromCart,
    products,
  } = useStore();

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
    <div className={isCartOpen ? "drawer-shell open" : "drawer-shell"}>
      <button
        aria-label="Close cart"
        className="drawer-backdrop"
        type="button"
        onClick={closeCart}
      />
      <aside className="drawer-panel">
        <div className="drawer-top">
          <div>
            <p className="eyebrow">Cart</p>
            <h2>{totalItems} item{totalItems === 1 ? "" : "s"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={closeCart}>
            Close
          </button>
        </div>
        <div className="drawer-body">
          {detailedItems.length === 0 ? (
            <div className="empty-state">
              <h3>Your cart is empty</h3>
              <p>Start with a featured product or browse the full catalog below.</p>
            </div>
          ) : (
            detailedItems.map((item) => (
              <div className="cart-item" key={item.product.slug}>
                <div className="cart-item-media">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={120}
                    height={120}
                  />
                </div>
                <div className="cart-item-copy">
                  <h3>{item.product.name}</h3>
                  <p>{formatBdt(item.product.price)}</p>
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
              </div>
            ))
          )}
        </div>
        <div className="drawer-bottom">
          <div className="totals-row">
            <span>Subtotal</span>
            <strong>{formatBdt(subtotal)}</strong>
          </div>
          <div className="drawer-actions">
            <Link className="btn ghost" href="/cart" onClick={closeCart}>
              View Cart
            </Link>
            <Link className="btn primary" href="/checkout" onClick={closeCart}>
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
