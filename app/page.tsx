import Image from "next/image";
import Link from "next/link";
import { CatalogSection } from "@/components/sections/catalog-section";
import { ProductCard } from "@/components/card/product-card";
import { StoreHeader } from "@/components/layout/store-header";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/db";
import { siteConfig } from "@/lib/site";
import {
  ArrowRight,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";

export const dynamic = "force-dynamic";

const highlights = [
  { value: "100% Genuine", label: "Brand Warranty Devices" },
  { value: "Top Brands", label: "Apple, Samsung, Xiaomi &amp; more" },
  { value: "Premium Gear", label: "Cables, Chargers &amp; Audio" },
  { value: "Local Store", label: "Bagmara Bazar, Nawabgonj" },
];

const perks = [
  {
    title: "Authentic Gadgets",
    copy: "100% original smartphones and smart wearables sourced directly from official brand distributors.",
    icon: <Star className="w-5 h-5" style={{ color: "var(--accent)" }} />,
  },
  {
    title: "Premium Accessories",
    copy: "Top-quality chargers, cables, protective cases, and audio gear from trusted global brands like Anker, Baseus, and Oraimo.",
    icon: <Zap className="w-5 h-5" style={{ color: "var(--accent)" }} />,
  },
  {
    title: "Reliable Support",
    copy: "Get instant shopping assistance via WhatsApp or visit our physical storefront at Hazi Yusuf Market for hand-on support.",
    icon: <ShieldCheck className="w-5 h-5" style={{ color: "var(--accent)" }} />,
  },
];

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <>
      <StoreHeader />
      <main>
        {/* ── Hero ──────────────────────────────────────── */}
        <section className="hero" id="home">
          <Image
            className="hero-media animate-in fade-in duration-1000"
            src="/assets/shop-hero.png"
            alt="Mobile phones and accessories displayed inside a phone shop"
            fill
            priority
            sizes="100vw"
          />

          <div className="hero-content animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-both">
            <div className="hero-eyebrow animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
              Authentic Phones &amp; Accessories · Nawabgonj, Dhaka
            </div>

            <h1 className="animate-in slide-in-from-bottom-6 fade-in duration-900 fill-mode-both delay-100">
              Your Trusted Destination for{" "}
              <span className="gradient-text">Smartphones &amp; Gadgets</span>.
            </h1>

            <p className="hero-copy animate-in fade-in duration-900 fill-mode-both delay-200">
              Discover the latest smartphones, premium wearables, authentic chargers, and high-quality audio gear from top global brands. Shop online or visit our store in Nawabgonj.
            </p>

            <div className="hero-actions animate-in slide-in-from-bottom-4 fade-in duration-900 fill-mode-both delay-300">
              <a className="btn primary flex items-center gap-2" href="#catalog">
                <ShoppingBag className="w-4 h-4" />
                Shop Now
              </a>
              <a className="btn secondary flex items-center gap-2" href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer">
                <MessageSquare className="w-4 h-4" />
                WhatsApp Chat
              </a>
            </div>
          </div>
        </section>

        {/* ── Quick Info ─────────────────────────────────── */}
        <section className="quick-info" aria-label="Shop highlights">
          {highlights.map((item, i) => (
            <article key={item.label} className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="quick-info-value" dangerouslySetInnerHTML={{ __html: item.value }} />
              <p className="quick-info-label" dangerouslySetInnerHTML={{ __html: item.label }} />
            </article>
          ))}
        </section>

        {/* ── Featured Products ───────────────────────────── */}
        <section className="section featured-section" id="featured" style={{ paddingTop: "160px" }}>
          <div className="store-section-head">
            <p className="eyebrow">Featured products</p>
            <h2>
              Our Top Recommended{" "}
              <span className="gradient-text">Smartphones &amp; Accessories</span>
            </h2>
            <p className="section-note">
              Explore our handpicked selection of top-selling smartphones, smartwatches, and premium audio gear.
            </p>
          </div>
          <div className="store-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        {/* ── Catalog ────────────────────────────────────── */}
        <CatalogSection products={products} categoriesData={categories} />

        {/* ── Why Us ─────────────────────────────────────── */}
        <section className="section why-section" id="why-us">
          <div className="store-section-head">
            <p className="eyebrow">Why shop with us</p>
            <h2>
              Premium services{" "}
              <span className="gradient-text">you can trust.</span>
            </h2>
          </div>
          <div className="perks-grid">
            {perks.map((perk) => (
              <article className="perk-card" key={perk.title}>
                <div className="perk-icon">
                  {perk.icon}
                </div>
                <h3>{perk.title}</h3>
                <p>{perk.copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Contact ────────────────────────────────────── */}
        <section className="section contact" id="contact">
          <div className="contact-main">
            <p className="eyebrow">Store contact</p>
            <h2>Need stock details, bundle pricing, or WhatsApp support?</h2>
            <p>
              We're dedicated to bringing you the best tech devices in Nawabgonj. Contact us directly to verify stock availability, request bundle discounts, or place a special order.
            </p>
            <div className="contact-actions">
              <a className="btn primary flex items-center gap-2" href={`tel:${siteConfig.phoneHref}`}>
                <Phone className="w-4 h-4" />
                {siteConfig.phone}
              </a>
              <a className="btn secondary flex items-center gap-2" href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer">
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </a>
              <a className="btn ghost flex items-center gap-2" href={`mailto:${siteConfig.email}`}>
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>

          <aside className="contact-card" aria-label="Shop contact details">
            <dl>
              <div>
                <dt><MapPin style={{ display: "inline", width: 12, height: 12, marginRight: 4 }} />Address</dt>
                <dd>{siteConfig.address}</dd>
              </div>
              <div>
                <dt><Phone style={{ display: "inline", width: 12, height: 12, marginRight: 4 }} />Phone</dt>
                <dd>
                  <a href={`tel:${siteConfig.phoneHref}`}>{siteConfig.phone}</a>
                </dd>
              </div>
              <div>
                <dt><Mail style={{ display: "inline", width: 12, height: 12, marginRight: 4 }} />Email</dt>
                <dd>
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </dd>
              </div>
            </dl>
            <a className="map-link flex items-center gap-2" href={siteConfig.mapsUrl} target="_blank" rel="noreferrer">
              Open in Google Maps
              <ArrowRight style={{ width: 14, height: 14 }} />
            </a>
          </aside>
        </section>
      </main>

      <footer>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <Image src="/assets/yeasin-logo.svg" alt="Logo" width={20} height={20} style={{ opacity: 0.4 }} />
        </div>
        <p>© {new Date().getFullYear()} Yeasin Mobile Shop. All rights reserved.</p>
      </footer>
    </>
  );
}
