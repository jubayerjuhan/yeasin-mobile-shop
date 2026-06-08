"use client";

import { useDeferredValue, useState } from "react";
import type { Product } from "@/lib/products";
import type { CategoryRecord, ProductCategory } from "@/lib/store-data";
import { ProductCard } from "@/components/card/product-card";

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
      ? [
          product.name,
          product.shortDescription,
          product.description,
          ...product.specs,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized)
      : true;
    return matchesCategory && matchesQuery;
  });

  return (
    <section className="section" id="catalog">
      <div className="store-section-head">
        <div>
          <p className="eyebrow">Shop the catalog</p>
          <h2>Phones, audio, wearables, accessories, and daily tech picks.</h2>
        </div>
        <div className="catalog-controls">
          <input
            aria-label="Search products"
            className="search-input"
            placeholder="Search by product or feature"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="segment-row">
            {categories.map((entry) => (
              <button
                key={entry}
                className={entry === category ? "segment active" : "segment"}
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
      <div className="store-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
