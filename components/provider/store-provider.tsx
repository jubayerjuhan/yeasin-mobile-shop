"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/products";

type CartItem = {
  slug: string;
  quantity: number;
};

type StoreContextValue = {
  products: Product[];
  cartItems: CartItem[];
  isCartOpen: boolean;
  totalItems: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (slug: string) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const storageKey = "yeasin-mobile-shop-cart";

function getSubtotal(cartItems: CartItem[], products: Product[]) {
  return cartItems.reduce((sum, item) => {
    const product = products.find((entry) => entry.slug === item.slug);
    if (!product) {
      return sum;
    }
    return sum + product.price * item.quantity;
  }, 0);
}

export function StoreProvider({
  children,
  products,
}: {
  children: ReactNode;
  products: Product[];
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CartItem[];
        setCartItems(parsed);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    window.localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, isHydrated]);

  const addToCart = (slug: string) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.slug === slug);
      if (existing) {
        return current.map((item) =>
          item.slug === slug
            ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
            : item,
        );
      }
      return [...current, { slug, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (slug: string) => {
    setCartItems((current) => current.filter((item) => item.slug !== slug));
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(slug);
      return;
    }
    setCartItems((current) =>
      current.map((item) =>
        item.slug === slug
          ? { ...item, quantity: Math.min(quantity, 10) }
          : item,
      ),
    );
  };

  const value: StoreContextValue = {
    products,
    cartItems,
    isCartOpen,
    totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: getSubtotal(cartItems, products),
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart: () => setCartItems([]),
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
