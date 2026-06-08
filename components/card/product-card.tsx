"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBdt } from "@/lib/money";
import type { Product } from "@/lib/products";
import { useStore } from "@/components/provider/store-provider";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();

  return (
    <article className="store-card">
      <Link className="store-card-media" href={`/products/${product.slug}`}>
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          sizes="(max-width: 820px) 100vw, 30vw"
        />
        {product.badge ? <span className="product-badge">{product.badge}</span> : null}
      </Link>
      <div className="store-card-body">
        <p className="store-card-category">{product.categoryName}</p>
        <h3>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p>{product.shortDescription}</p>
        <div className="price-row">
          <strong>{formatBdt(product.price)}</strong>
          {product.compareAtPrice ? (
            <span>{formatBdt(product.compareAtPrice)}</span>
          ) : null}
        </div>
        <div className="store-card-actions">
          <button className="btn primary" type="button" onClick={() => addToCart(product.slug)}>
            Add to Cart
          </button>
          <Link className="btn ghost" href={`/products/${product.slug}`}>
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
