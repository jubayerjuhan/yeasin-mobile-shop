"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBdt } from "@/lib/money";
import { useStore } from "@/components/provider/store-provider";
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, ShieldCheck, Tag } from "lucide-react";

export function CartPageClient() {
  const { cartItems, subtotal, updateQuantity, removeFromCart, products } = useStore();

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
    <section
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "120px clamp(20px, 5vw, 64px) 100px",
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: 48 }}>
        <p className="eyebrow">Shopping cart</p>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 750,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Review your selected{" "}
          <span className="gradient-text">tech picks.</span>
        </h1>
      </div>

      {detailedItems.length === 0 ? (
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
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: 28,
              fontWeight: 750,
              letterSpacing: "-0.025em",
            }}
          >
            No products in the cart yet
          </h2>
          <p
            style={{
              color: "var(--ink-secondary)",
              fontSize: 16,
              maxWidth: 400,
              margin: "0 0 32px",
              lineHeight: 1.6,
            }}
          >
            Add a featured phone, earbuds, or accessories bundle to keep going.
          </p>
          <Link className="btn primary flex items-center gap-2" href="/#catalog">
            Continue Shopping
            <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 32,
            alignItems: "start",
          }}
          className="cart-layout"
        >
          {/* Cart items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {detailedItems.map((item) => (
              <article
                key={item.product.slug}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: 24,
                  padding: "24px",
                  borderRadius: "var(--r-xl)",
                  border: "1px solid var(--line)",
                  background: "#fff",
                  boxShadow: "var(--shadow-xs)",
                  transition: "all 0.3s var(--spring)",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: "hsl(220, 20%, 96%)",
                    borderRadius: "var(--r-md)",
                    padding: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    aspectRatio: "1",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={180}
                    height={180}
                    style={{ objectFit: "contain", transition: "transform 0.4s ease" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--accent)",
                    }}
                  >
                    {item.product.categoryName}
                  </p>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 750,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.product.name}
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "var(--ink-secondary)",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.product.shortDescription}
                  </p>
                  <strong
                    style={{
                      fontSize: 20,
                      fontWeight: 750,
                      letterSpacing: "-0.025em",
                      color: "var(--ink)",
                    }}
                  >
                    {formatBdt(item.product.price)}
                  </strong>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      marginTop: 4,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: "rgba(0,0,0,0.04)",
                        borderRadius: 999,
                        padding: "6px 14px",
                      }}
                    >
                      <button
                        className="qty-btn"
                        type="button"
                        onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                        style={{ width: 32, height: 32 }}
                      >
                        <Minus style={{ width: 12, height: 12 }} />
                      </button>
                      <span
                        style={{
                          fontWeight: 750,
                          fontSize: 15,
                          minWidth: 20,
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn"
                        type="button"
                        onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                        style={{ width: 32, height: 32 }}
                      >
                        <Plus style={{ width: 12, height: 12 }} />
                      </button>
                    </div>

                    <button
                      className="remove-link flex items-center gap-1.5"
                      style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-color)" }}
                      type="button"
                      onClick={() => removeFromCart(item.product.slug)}
                    >
                      <Trash2 style={{ width: 13, height: 13 }} />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Order summary */}
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
                flexDirection: "column",
                gap: 14,
                paddingBottom: 24,
                marginBottom: 24,
                borderBottom: "1px solid var(--line)",
              }}
            >
              {detailedItems.map((item) => (
                <div
                  key={item.slug}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 12,
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: "var(--ink-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
                    {item.product.name}
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--muted-color)",
                      }}
                    >
                      ×{item.quantity}
                    </span>
                  </span>
                  <span style={{ fontWeight: 650, color: "var(--ink)", whiteSpace: "nowrap" }}>
                    {formatBdt(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 28,
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 16px",
                background: "var(--accent-light)",
                borderRadius: "var(--r-md)",
                marginBottom: 24,
                border: "1px solid hsla(262, 78%, 58%, 0.15)",
              }}
            >
              <Tag style={{ width: 14, height: 14, color: "var(--accent)", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 13, color: "var(--accent)", fontWeight: 600, lineHeight: 1.4 }}>
                Delivery &amp; final pricing confirmed at checkout.
              </p>
            </div>

            <Link
              className="btn primary w-full flex items-center justify-center gap-2"
              href="/checkout"
              style={{ width: "100%", minHeight: 52, fontSize: 15 }}
            >
              Proceed to Checkout
              <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </aside>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
