"use client";

import { useStore } from "@/components/provider/store-provider";

export function AddToCartButton({ slug }: { slug: string }) {
  const { addToCart } = useStore();

  return (
    <button className="btn primary" type="button" onClick={() => addToCart(slug)}>
      Add to Cart
    </button>
  );
}
