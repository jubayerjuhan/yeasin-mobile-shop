"use client";

import { useDeferredValue, useState } from "react";
import type { Product } from "@/lib/products";
import type { CategoryRecord, ProductCategory } from "@/lib/store-data";
import { ProductCard } from "@/components/card/product-card";
import { Search, SlidersHorizontal } from "lucide-react";

const categories: Array<"all" | ProductCategory> = [
  "all",
  "smartphones",
  "audio",
  "wearables",
  "computing",
  "accessories",
];

export function CatalogSection({
  products,
  categoriesData,
}: {
  products: Product[];
  categoriesData: CategoryRecord[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ProductCategory>("all");
  const deferredQuery = useDeferredValue(query);

  const normalized = deferredQuery.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === "all" ? true : product.categorySlug === category;
    const matchesQuery = normalized
      ? [product.name, product.shortDescription, product.description, ...product.specs]
          .join(" ")
          .toLowerCase()
          .includes(normalized)
      : true;
    return matchesCategory && matchesQuery;
  });

  return (
    <section className="section" id="catalog" style={{ maxWidth: "1400px" }}>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          marginBottom: "56px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "640px",
          }}
        >
          <p className="eyebrow">Shop the catalog</p>
          <h2>
            Phones, audio, wearables,{" "}
            <span className="gradient-text">accessories</span> &amp; daily tech picks.
          </h2>
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Search */}
          <div className="search-input-wrap" style={{ maxWidth: "440px", position: "relative" }}>
            <Search style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "var(--muted-color)", pointerEvents: "none", zIndex: 1 }} />
            <input
              aria-label="Search products"
              className="search-input"
              placeholder="Search by product or feature…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Category pills */}
          <div className="segment-row">
            {categories.map((entry) => (
              <button
                key={entry}
                className={`segment${entry === category ? " active" : ""}`}
                type="button"
                onClick={() => setCategory(entry)}
              >
                {entry === "all"
                  ? "All"
                  : categoriesData.find((item) => item.slug === entry)?.name ?? entry}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredProducts.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px",
            textAlign: "center",
            background: "rgba(0,0,0,0.02)",
            borderRadius: "var(--r-xl)",
            border: "1px dashed var(--line)",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "var(--accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <SlidersHorizontal style={{ width: 24, height: 24, color: "var(--accent)" }} />
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 22 }}>No products found</h3>
          <p style={{ color: "var(--muted-color)", margin: 0, maxWidth: 320 }}>
            Try adjusting your search or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="store-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
