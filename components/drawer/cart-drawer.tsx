"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBdt } from "@/lib/money";
import { useStore } from "@/components/provider/store-provider";
import { X, Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";

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
    if (!product) return accumulator;
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
        {/* Header */}
        <div className="drawer-top">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted-color)",
                }}
              >
                Your Cart
              </p>
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 750,
                  letterSpacing: "-0.03em",
                  color: "var(--ink)",
                }}
              >
                {totalItems} item{totalItems === 1 ? "" : "s"}
              </h2>
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.05)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                color: "var(--ink-secondary)",
              }}
              type="button"
              onClick={closeCart}
              aria-label="Close cart drawer"
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {detailedItems.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                padding: "40px 24px",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "var(--accent-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <ShoppingCart style={{ width: 28, height: 28, color: "var(--accent)" }} />
              </div>
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                }}
              >
                Your cart is empty
              </h3>
              <p
                style={{
                  margin: "0 0 24px",
                  color: "var(--ink-secondary)",
                  fontSize: 14,
                  maxWidth: 240,
                  lineHeight: 1.6,
                }}
              >
                Start with a featured product or browse the full catalog.
              </p>
              <button
                className="btn primary"
                type="button"
                onClick={closeCart}
                style={{ minHeight: 40, padding: "0 20px", fontSize: 14 }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div>
              {detailedItems.map((item) => (
                <div className="cart-item" key={item.product.slug}>
                  <div className="cart-item-media">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={120}
                      height={120}
                      style={{ objectFit: "contain", transition: "transform 0.3s ease" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.product.name}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--accent)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {formatBdt(item.product.price)}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "rgba(0,0,0,0.04)",
                          borderRadius: 999,
                          padding: "4px 8px",
                        }}
                      >
                        <button
                          className="qty-btn"
                          type="button"
                          onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus style={{ width: 10, height: 10 }} />
                        </button>
                        <span
                          style={{
                            fontWeight: 750,
                            fontSize: 13,
                            width: 16,
                            textAlign: "center",
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          className="qty-btn"
                          type="button"
                          onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus style={{ width: 10, height: 10 }} />
                        </button>
                      </div>
                      <button
                        className="remove-link"
                        type="button"
                        onClick={() => removeFromCart(item.product.slug)}
                        aria-label="Remove item"
                      >
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {detailedItems.length > 0 && (
          <div className="drawer-bottom">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  color: "var(--muted-color)",
                }}
              >
                Subtotal
              </span>
              <strong
                style={{
                  fontSize: 26,
                  fontWeight: 750,
                  letterSpacing: "-0.035em",
                  color: "var(--ink)",
                }}
              >
                {formatBdt(subtotal)}
              </strong>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Link
                className="btn secondary flex items-center justify-center gap-2"
                href="/cart"
                onClick={closeCart}
                style={{ minHeight: 44, fontSize: 14 }}
              >
                View Cart
              </Link>
              <Link
                className="btn primary flex items-center justify-center gap-2"
                href="/checkout"
                onClick={closeCart}
                style={{ minHeight: 44, fontSize: 14 }}
              >
                Checkout
                <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
