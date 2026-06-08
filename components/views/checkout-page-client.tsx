"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckoutButton } from "@/components/button/checkout-button";
import { useStore } from "@/components/provider/store-provider";
import { formatBdt } from "@/lib/money";
import { ShoppingCart, ArrowRight, ShieldCheck } from "lucide-react";

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
      <section className="section cart-page max-w-7xl mx-auto pt-32 pb-24 px-6 lg:px-8">
        <div className="empty-state large flex flex-col items-center justify-center py-20 px-4 text-center bg-black/[0.02] rounded-3xl border border-black/5">
          <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mb-8">
            <ShoppingCart className="w-10 h-10 text-black/30" />
          </div>
          <h1 className="page-title text-4xl font-bold mb-4">Your checkout is empty</h1>
          <p className="text-lg text-black/60 max-w-md mb-8">Select some products first, then come back to Stripe checkout.</p>
          <Link className="btn primary flex items-center gap-2" href="/#catalog">
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section checkout-page max-w-7xl mx-auto pt-32 pb-24 px-6 lg:px-8">
      <div className="store-section-head mb-12">
        <div>
          <p className="eyebrow text-sm font-bold tracking-[0.2em] uppercase text-black/50 mb-4">Checkout</p>
          <h1 className="page-title text-4xl lg:text-5xl font-bold tracking-tight mb-2">Stripe-ready payment flow for your store.</h1>
        </div>
      </div>
      
      <div className="cart-layout grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
        <div className="cart-list checkout-list space-y-4">
          <h3 className="text-lg font-bold mb-4 pb-4 border-b border-black/5">Order Items</h3>
          {detailedItems.map((item) => (
            <article className="checkout-row flex items-center gap-6 p-4 rounded-2xl bg-white border border-black/5 shadow-sm" key={item.product.slug}>
              <div className="bg-black/5 rounded-xl p-2 w-24 h-24 flex items-center justify-center">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <div className="cart-row-copy flex-grow">
                <h2 className="text-lg font-bold mb-1">{item.product.name}</h2>
                <p className="text-black/60 font-medium">
                  {item.quantity} × <span className="text-black">{formatBdt(item.product.price)}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
        
        <aside className="summary-card sticky top-32 bg-[#F5F5F7] rounded-3xl p-8 lg:p-10 border border-black/5">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="w-6 h-6 text-green-600" />
            <p className="eyebrow text-xs font-bold tracking-[0.2em] uppercase text-black/50 mb-0">Secure Checkout</p>
          </div>
          
          <div className="totals-row flex items-center justify-between py-6 border-y border-black/10 mb-8">
            <span className="text-lg font-medium text-black/70">Subtotal</span>
            <strong className="text-3xl font-bold tracking-tight">{formatBdt(subtotal)}</strong>
          </div>
          
          <p className="summary-note text-sm text-black/60 leading-relaxed mb-10">
            Taxes and shipping calculated at checkout. Secure payment processing provided by Stripe.
          </p>
          
          <CheckoutButton />
        </aside>
      </div>
    </section>
  );
}
