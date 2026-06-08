import Image from "next/image";
import Link from "next/link";
import { CatalogSection } from "@/components/sections/catalog-section";
import { ProductCard } from "@/components/card/product-card";
import { StoreHeader } from "@/components/layout/store-header";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/db";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

const highlights = [
  { value: "Featured", label: "Phones and drops" },
  { value: "Stripe", label: "Checkout foundation" },
  { value: "Daily", label: "Accessories and support" },
  { value: "Nawabgonj", label: "Local trust, online reach" },
];

const perks = [
  {
    title: "Curated featured products",
    copy:
      "Hero SKUs, bundle offers, and premium daily-use gadgets are surfaced first for faster conversion.",
  },
  {
    title: "Commerce-first browsing",
    copy:
      "Category filtering, product pages, cart state, and clear pricing keep the journey focused on buying.",
  },
  {
    title: "Stripe-ready payment flow",
    copy:
      "Hosted checkout is wired in code so test keys can be dropped in without rebuilding the storefront architecture.",
  },
];

const featuredProducts = getFeaturedProducts();

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const products = getProducts();
  const categories = getCategories();

  return (
    <>
      <StoreHeader />
      <main>
        <section className="hero" id="home">
          <Image
            className="hero-media"
            src="/assets/shop-hero.png"
            alt="Mobile phones and accessories displayed inside a phone shop"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">Tech e-commerce storefront for phones and accessories</p>
            <h1>Bangladesh-ready gadget shopping with premium storefront energy.</h1>
            <p className="hero-copy">
              {siteConfig.name} now works like a modern store: featured products,
              searchable catalog, cart flow, product pages, and Stripe-backed
              checkout wiring.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href="#catalog">Shop Now</a>
              <Link className="btn secondary" href="/checkout">Stripe Checkout</Link>
            </div>
          </div>
        </section>

        <section className="quick-info" aria-label="Shop highlights">
          {highlights.map((item) => (
            <article key={item.label}>
              <span>{item.value}</span>
              <p>{item.label}</p>
            </article>
          ))}
        </section>

        <section className="section featured-section" id="featured">
          <div className="store-section-head">
            <div>
              <p className="eyebrow">Featured products</p>
              <h2>High-intent devices and accessories merchandised up front.</h2>
            </div>
            <p className="section-note">
              Inspired by the multi-rail layout of large gadget stores, but tuned
              into a cleaner, faster buying experience.
            </p>
          </div>
          <div className="store-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        <CatalogSection products={products} categoriesData={categories} />

        <section className="section why-section" id="why-us">
          <div className="store-section-head">
            <div>
              <p className="eyebrow">Why this works</p>
              <h2>Commerce building blocks that are ready to grow into a full store.</h2>
            </div>
          </div>
          <div className="perks-grid">
            {perks.map((perk) => (
              <article className="perk-card" key={perk.title}>
                <span />
                <div>
                  <h3>{perk.title}</h3>
                  <p>{perk.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="contact-main">
            <p className="eyebrow">Store contact</p>
            <h2>Need stock details, bundle pricing, or WhatsApp support?</h2>
            <p>
              This storefront is ready for product expansion, promo banners,
              checkout testing, and real inventory syncing when you want the next pass.
            </p>
            <div className="contact-actions">
              <a className="btn primary" href={`tel:${siteConfig.phoneHref}`}>
                {siteConfig.phone}
              </a>
              <a className="btn ghost" href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <a className="btn ghost" href={`mailto:${siteConfig.email}`}>
                Email
              </a>
              <a className="btn ghost" href={siteConfig.facebookUrl} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </div>
          </div>
          <aside className="contact-card" aria-label="Shop contact details">
            <dl>
              <div>
                <dt>Address</dt>
                <dd>{siteConfig.address}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${siteConfig.phoneHref}`}>{siteConfig.phone}</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </dd>
              </div>
            </dl>
            <a className="map-link" href={siteConfig.mapsUrl} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </aside>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Yeasin Mobile Shop. Tech e-commerce storefront with Stripe-ready checkout.</p>
      </footer>
    </>
  );
}
