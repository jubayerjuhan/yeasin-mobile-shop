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
          style={{ transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }}
        />
        {product.badge ? (
          <span className="product-badge">{product.badge}</span>
        ) : null}
      </Link>

      <div className="store-card-body">
        <p className="store-card-category">{product.categoryName}</p>
        <h3>
          <Link href={`/products/${product.slug}`} className="hover:opacity-70 transition-opacity">
            {product.name}
          </Link>
        </h3>
        <p style={{ flexGrow: 1, marginBottom: 0 }}>{product.shortDescription}</p>

        <div className="price-row">
          <strong>{formatBdt(product.price)}</strong>
          {product.compareAtPrice ? (
            <span>{formatBdt(product.compareAtPrice)}</span>
          ) : null}
        </div>

        <div className="store-card-actions">
          <button
            className="btn-add-cart"
            type="button"
            onClick={() => addToCart(product.slug)}
          >
            <ShoppingBag style={{ width: 15, height: 15 }} />
            Add to Cart
          </button>
          <Link
            className="btn-view"
            href={`/products/${product.slug}`}
            aria-label={`View ${product.name}`}
          >
            <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </div>
    </article>
  );
}
