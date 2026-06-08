"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBdt } from "@/lib/money";
import type { Product } from "@/lib/products";
import { useStore } from "@/components/provider/store-provider";
import { ShoppingBag, ArrowRight } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();

  return (
    <article className="store-card group">
      <Link className="store-card-media" href={`/products/${product.slug}`}>
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          sizes="(max-width: 820px) 100vw, 30vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge ? <span className="product-badge">{product.badge}</span> : null}
      </Link>
      <div className="store-card-body">
        <p className="store-card-category text-xs font-bold uppercase tracking-wider text-black/50 mb-2">
          {product.categoryName}
        </p>
        <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">
          <Link href={`/products/${product.slug}`} className="hover:text-black/70 transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-black/60 line-clamp-2 mb-4 flex-grow">
          {product.shortDescription}
        </p>
        <div className="price-row mt-auto mb-5">
          <strong className="text-xl font-bold tracking-tight">{formatBdt(product.price)}</strong>
          {product.compareAtPrice ? (
            <span className="text-sm text-black/40 line-through font-medium">
              {formatBdt(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
        <div className="store-card-actions grid grid-cols-[1fr_auto] gap-2">
          <button 
            className="btn primary w-full flex items-center justify-center gap-2" 
            type="button" 
            onClick={() => addToCart(product.slug)}
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
          <Link className="btn ghost px-4 flex items-center justify-center bg-black/5 hover:bg-black/10 rounded-full transition-colors" href={`/products/${product.slug}`}>
            <ArrowRight className="w-5 h-5 text-black/70" />
          </Link>
        </div>
      </div>
    </article>
  );
}
