import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/button/add-to-cart-button";
import { BuyNowButton } from "@/components/button/buy-now-button";
import { formatBdt } from "@/lib/money";
import { getProductBySlug } from "@/lib/products";
import { ChevronRight, CheckCircle2, Package, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="section product-page max-w-7xl mx-auto pt-32 pb-24 px-6 lg:px-8">
      <div className="breadcrumb flex items-center gap-2 text-sm font-medium text-black/50 mb-10">
        <Link href="/" className="hover:text-black transition-colors">Store</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-black">{product.categoryName}</span>
      </div>
      
      <div className="product-layout grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="product-visual bg-[#F5F5F7] rounded-3xl p-12 lg:p-20 flex items-center justify-center sticky top-32">
          <Image
            src={product.image}
            alt={product.name}
            width={1200}
            height={1200}
            priority
            className="w-full h-auto object-contain mix-blend-multiply drop-shadow-2xl"
          />
        </div>
        
        <div className="product-copy flex flex-col pt-4">
          <p className="eyebrow text-xs font-bold tracking-[0.2em] uppercase text-black/50 mb-4">{product.categoryName}</p>
          <h1 className="page-title text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6">{product.name}</h1>
          <p className="product-description text-lg text-black/60 leading-relaxed mb-8">{product.description}</p>
          
          <div className="price-row large flex items-baseline gap-4 mb-10 pb-10 border-b border-black/5">
            <strong className="text-4xl font-bold tracking-tighter">{formatBdt(product.price)}</strong>
            {product.compareAtPrice ? (
              <span className="text-xl text-black/40 line-through font-medium">{formatBdt(product.compareAtPrice)}</span>
            ) : null}
          </div>
          
          <div className="mb-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-black/50 mb-4">Specifications</h3>
            <ul className="spec-list space-y-3">
              {product.specs.map((spec) => (
                <li key={spec} className="flex items-start gap-3 text-black/80">
                  <CheckCircle2 className="w-5 h-5 text-black/30 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{spec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="product-actions grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <AddToCartButton slug={product.slug} />
            <BuyNowButton slug={product.slug} />
          </div>
          
          <div className="meta-grid grid grid-cols-2 gap-8 p-6 bg-black/[0.02] rounded-2xl border border-black/5">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/50">
                <Tag className="w-4 h-4" /> SKU
              </span>
              <strong className="text-sm font-semibold">{product.sku}</strong>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/50">
                <Package className="w-4 h-4" /> Status
              </span>
              <strong className="text-sm font-semibold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-orange-500"}`}></span>
                {product.inStock ? "In stock & ready to ship" : "Pre-order"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
