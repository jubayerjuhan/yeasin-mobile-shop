"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckoutButton } from "@/components/button/checkout-button";
import { useStore } from "@/components/provider/store-provider";
import { formatBdt } from "@/lib/money";
import { ShoppingCart, ArrowRight, ShieldCheck, Lock } from "lucide-react";

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
    if (!product) return accumulator;
    accumulator.push({ ...item, product });
    return accumulator;
  }, []);

  if (detailedItems.length === 0) {
    return (
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "120px clamp(20px, 5vw, 64px) 100px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px",
            textAlign: "center",
            background: "rgba(0,0,0,0.02)",
            borderRadius: "var(--r-2xl)",
            border: "1px dashed var(--line)",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <ShoppingCart style={{ width: 32, height: 32, color: "var(--accent)" }} />
          </div>
          <h1
            style={{
              margin: "0 0 12px",
              fontSize: 28,
              fontWeight: 750,
              letterSpacing: "-0.025em",
            }}
          >
            Your checkout is empty
          </h1>
          <p
            style={{
              color: "var(--ink-secondary)",
              fontSize: 16,
              maxWidth: 400,
              margin: "0 0 32px",
              lineHeight: 1.6,
            }}
          >
            Select some products first, then come back to complete your order.
          </p>
          <Link className="btn primary flex items-center gap-2" href="/#catalog">
            Browse Products
            <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "120px clamp(20px, 5vw, 64px) 100px",
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: 48 }}>
        <p className="eyebrow">Checkout</p>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 750,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Secure{" "}
          <span className="gradient-text">Checkout</span>
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 32,
          alignItems: "start",
        }}
        className="cart-layout"
      >
        {/* Order items */}
        <div>
          <h3
            style={{
              margin: "0 0 20px",
              fontSize: 13,
              fontWeight: 750,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--muted-color)",
              paddingBottom: 16,
              borderBottom: "1px solid var(--line)",
            }}
          >
            Order Items
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {detailedItems.map((item) => (
              <article
                key={item.product.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: "var(--r-lg)",
                  border: "1px solid var(--line)",
                  background: "#fff",
                  boxShadow: "var(--shadow-xs)",
                  transition: "all 0.2s var(--ease)",
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    background: "hsl(220, 20%, 96%)",
                    borderRadius: "var(--r-md)",
                    padding: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={96}
                    height={96}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <h2
                    style={{
                      margin: "0 0 4px",
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.product.name}
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "var(--ink-secondary)",
                    }}
                  >
                    {item.quantity} ×{" "}
                    <span style={{ color: "var(--accent)", fontWeight: 650 }}>
                      {formatBdt(item.product.price)}
                    </span>
                  </p>
                </div>
                <strong
                  style={{
                    fontSize: 16,
                    fontWeight: 750,
                    letterSpacing: "-0.02em",
                    flexShrink: 0,
                  }}
                >
                  {formatBdt(item.product.price * item.quantity)}
                </strong>
              </article>
            ))}
          </div>
        </div>

        {/* Summary sidebar */}
        <aside
          style={{
            position: "sticky",
            top: 100,
            background: "hsl(220, 20%, 97%)",
            borderRadius: "var(--r-xl)",
            padding: "36px",
            border: "1px solid var(--line)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Secure badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              background: "hsla(142, 72%, 50%, 0.08)",
              borderRadius: "var(--r-md)",
              border: "1px solid hsla(142, 72%, 50%, 0.2)",
              marginBottom: 28,
            }}
          >
            <ShieldCheck style={{ width: 18, height: 18, color: "hsl(142, 72%, 42%)", flexShrink: 0 }} />
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 700,
                color: "hsl(142, 60%, 35%)",
              }}
            >
              Secure checkout powered by Stripe
            </p>
          </div>

          <p
            style={{
              margin: "0 0 24px",
              fontSize: 11,
              fontWeight: 750,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--muted-color)",
            }}
          >
            Order Summary
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingBottom: 24,
              marginBottom: 24,
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 500, color: "var(--ink-secondary)" }}>
              Subtotal
            </span>
            <strong
              style={{
                fontSize: 32,
                fontWeight: 750,
                letterSpacing: "-0.04em",
                color: "var(--ink)",
              }}
            >
              {formatBdt(subtotal)}
            </strong>
          </div>

          <p
            style={{
              margin: "0 0 28px",
              fontSize: 13,
              color: "var(--ink-secondary)",
              lineHeight: 1.6,
            }}
          >
            Taxes and shipping are calculated at checkout. Secure payment processing provided by Stripe.
          </p>

          <CheckoutButton />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginTop: 16,
            }}
          >
            <Lock style={{ width: 12, height: 12, color: "var(--muted-color)" }} />
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "var(--muted-color)",
                fontWeight: 500,
              }}
            >
              256-bit SSL encrypted
            </p>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
