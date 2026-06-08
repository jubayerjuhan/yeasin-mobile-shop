"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBdt } from "@/lib/money";
import { useStore } from "@/components/provider/store-provider";
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from "lucide-react";

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
    <section className="section cart-page max-w-7xl mx-auto pt-32 pb-24 px-6 lg:px-8">
      <div className="store-section-head mb-12">
        <div>
          <p className="eyebrow text-sm font-bold tracking-[0.2em] uppercase text-black/50 mb-4">Shopping cart</p>
          <h1 className="page-title text-4xl lg:text-5xl font-bold tracking-tight mb-2">Review your selected tech picks.</h1>
        </div>
      </div>
      {detailedItems.length === 0 ? (
        <div className="empty-state large flex flex-col items-center justify-center py-20 px-4 text-center bg-black/[0.02] rounded-3xl border border-black/5">
          <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mb-8">
            <ShoppingCart className="w-10 h-10 text-black/30" />
          </div>
          <h2 className="text-3xl font-bold mb-4">No products in the cart yet</h2>
          <p className="text-lg text-black/60 max-w-md mb-8">Add a featured phone, earbuds, or accessories bundle to keep going.</p>
          <Link className="btn primary flex items-center gap-2" href="/#catalog">
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="cart-layout grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          <div className="cart-list space-y-6">
            {detailedItems.map((item) => (
              <article className="cart-row group grid grid-cols-[140px_1fr] gap-8 p-6 rounded-3xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow items-center" key={item.product.slug}>
                <div className="bg-black/5 rounded-2xl p-4 flex items-center justify-center mix-blend-multiply">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={180}
                    height={180}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="cart-row-copy flex flex-col justify-center">
                  <h2 className="text-xl font-bold mb-2">{item.product.name}</h2>
                  <p className="text-sm text-black/60 mb-4 line-clamp-1">{item.product.shortDescription}</p>
                  <strong className="text-lg font-bold mb-6">{formatBdt(item.product.price)}</strong>
                  
                  <div className="quantity-row flex items-center gap-6">
                    <div className="flex items-center gap-4 bg-black/5 rounded-full px-4 py-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.slug, item.quantity - 1)
                        }
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.slug, item.quantity + 1)
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      className="remove-link flex items-center gap-2 text-sm font-bold text-black/40 hover:text-red-500 transition-colors"
                      type="button"
                      onClick={() => removeFromCart(item.product.slug)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <aside className="summary-card sticky top-32 bg-[#F5F5F7] rounded-3xl p-8 lg:p-10 border border-black/5">
            <p className="eyebrow text-xs font-bold tracking-[0.2em] uppercase text-black/50 mb-8">Order summary</p>
            <div className="totals-row flex items-center justify-between py-6 border-y border-black/10 mb-8">
              <span className="text-lg font-medium text-black/70">Subtotal</span>
              <strong className="text-3xl font-bold tracking-tight">{formatBdt(subtotal)}</strong>
            </div>
            <p className="summary-note text-sm text-black/60 leading-relaxed mb-10">
              Delivery cost and final confirmation can be adjusted after Stripe
              checkout setup is connected to your live account.
            </p>
            <Link className="btn primary w-full flex items-center justify-center gap-2 py-4 text-lg" href="/checkout">
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
