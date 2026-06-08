"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/components/provider/store-provider";

export function BuyNowButton({ slug }: { slug: string }) {
  const router = useRouter();
  const { addToCart } = useStore();

  return (
    <button
      className="btn ghost"
      type="button"
      onClick={() => {
        addToCart(slug);
        router.push("/checkout");
      }}
    >
      Buy Now
    </button>
  );
}
