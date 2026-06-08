import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/button/add-to-cart-button";
import { BuyNowButton } from "@/components/button/buy-now-button";
import { formatBdt } from "@/lib/money";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="section product-page">
      <div className="breadcrumb">
        <Link href="/">Store</Link>
        <span>/</span>
        <span>{product.categoryName}</span>
      </div>
      <div className="product-layout">
        <div className="product-visual">
          <Image
            src={product.image}
            alt={product.name}
            width={1200}
            height={1200}
            priority
          />
        </div>
        <div className="product-copy">
          <p className="eyebrow">{product.categoryName}</p>
          <h1 className="page-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <div className="price-row large">
            <strong>{formatBdt(product.price)}</strong>
            {product.compareAtPrice ? (
              <span>{formatBdt(product.compareAtPrice)}</span>
            ) : null}
          </div>
          <ul className="spec-list">
            {product.specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
          <div className="product-actions">
            <AddToCartButton slug={product.slug} />
            <BuyNowButton slug={product.slug} />
          </div>
          <div className="meta-grid">
            <div>
              <span>SKU</span>
              <strong>{product.sku}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{product.inStock ? "In stock" : "Pre-order"}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
