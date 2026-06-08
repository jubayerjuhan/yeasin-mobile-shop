"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBdt } from "@/lib/money";
import { useStore } from "@/components/provider/store-provider";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

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
      <aside className="drawer-panel flex flex-col h-full bg-white/95 backdrop-blur-2xl shadow-2xl">
        <div className="drawer-top flex items-center justify-between pb-6 border-b border-black/5">
          <div>
            <p className="eyebrow text-[11px] text-black/50 tracking-widest font-bold uppercase mb-1">Your Cart</p>
            <h2 className="text-2xl font-bold tracking-tight">
              {totalItems} item{totalItems === 1 ? "" : "s"}
            </h2>
          </div>
          <button 
            className="icon-button p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors" 
            type="button" 
            onClick={closeCart}
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5 text-black/70" />
          </button>
        </div>
        
        <div className="drawer-body flex-grow overflow-y-auto py-6 pr-2 -mr-2">
          {detailedItems.length === 0 ? (
            <div className="empty-state flex flex-col items-center justify-center h-full text-center opacity-70">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-8 h-8 text-black/40" />
              </div>
              <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
              <p className="text-black/60 max-w-[240px]">Start with a featured product or browse the full catalog.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {detailedItems.map((item) => (
                <div className="cart-item group relative grid grid-cols-[80px_1fr] gap-4 p-4 rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow" key={item.product.slug}>
                  <div className="cart-item-media bg-black/5 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={120}
                      height={120}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="cart-item-copy flex flex-col justify-center">
                    <h3 className="font-bold text-[15px] leading-tight mb-1 line-clamp-1 pr-8">{item.product.name}</h3>
                    <p className="text-black/60 text-sm font-medium mb-3">{formatBdt(item.product.price)}</p>
                    
                    <div className="quantity-row flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-black/5 rounded-full px-3 py-1">
                        <button
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                          type="button"
                          onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3 text-black/70" />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                          type="button"
                          onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3 text-black/70" />
                        </button>
                      </div>
                      <button
                        className="remove-link text-black/40 hover:text-red-500 p-2 transition-colors"
                        type="button"
                        onClick={() => removeFromCart(item.product.slug)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="drawer-bottom pt-6 border-t border-black/5 mt-auto">
          <div className="totals-row flex items-center justify-between mb-6">
            <span className="text-black/60 font-bold text-sm uppercase tracking-wider">Subtotal</span>
            <strong className="text-2xl font-bold tracking-tight">{formatBdt(subtotal)}</strong>
          </div>
          <div className="drawer-actions grid grid-cols-2 gap-3">
            <Link className="btn ghost w-full text-center bg-black/5 hover:bg-black/10 rounded-full transition-colors" href="/cart" onClick={closeCart}>
              View Cart
            </Link>
            <Link className="btn primary w-full text-center bg-black hover:bg-black/80 rounded-full transition-colors" href="/checkout" onClick={closeCart}>
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
