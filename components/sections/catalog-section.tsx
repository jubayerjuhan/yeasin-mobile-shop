"use client";

import { useDeferredValue, useState } from "react";
import type { Product } from "@/lib/products";
import type { CategoryRecord, ProductCategory } from "@/lib/store-data";
import { ProductCard } from "@/components/card/product-card";
import { Search } from "lucide-react";

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
    <section className="section max-w-7xl mx-auto py-24 px-6 lg:px-8" id="catalog">
      <div className="store-section-head flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div className="max-w-2xl">
          <p className="eyebrow text-sm font-bold tracking-[0.2em] uppercase text-black/50 mb-4">Shop the catalog</p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Phones, audio, wearables, accessories, and daily tech picks.</h2>
        </div>
        <div className="catalog-controls w-full md:w-auto flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
            <input
              aria-label="Search products"
              className="search-input w-full md:w-80 h-14 pl-12 pr-4 bg-black/5 hover:bg-black/10 focus:bg-white border border-transparent focus:border-black/10 rounded-2xl outline-none transition-all shadow-sm focus:shadow-md text-base"
              placeholder="Search by product or feature"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="segment-row flex flex-wrap gap-2">
            {categories.map((entry) => (
              <button
                key={entry}
                className={entry === category ? "segment active bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md transition-all" : "segment bg-black/5 hover:bg-black/10 text-black/70 px-5 py-2.5 rounded-full text-sm font-bold transition-all"}
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
