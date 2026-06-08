"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";
import { useStore } from "@/components/provider/store-provider";
import { ShoppingBag, Menu, X, MessageCircle } from "lucide-react";

const links = [
  { href: "#featured", label: "Featured" },
  { href: "#catalog", label: "Shop" },
  { href: "#why-us", label: "Why Us" },
  { href: "#contact", label: "Contact" },
];

export function StoreHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, openCart } = useStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <header className={`store-header${isScrolled ? " is-scrolled" : ""}`}>
        {/* Brand */}
        <Link className="brand" href="/" onClick={() => setIsOpen(false)}>
          <span className="brand-mark">
            <Image
              src="/assets/yeasin-logo.svg"
              alt={`${siteConfig.name} logo`}
              width={24}
              height={24}
            />
          </span>
          <span className="hidden sm:block">
            <strong>{siteConfig.name}</strong>
            <small>Smart devices &amp; accessories</small>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="store-nav hidden md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="header-actions">

          <a
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all hover:bg-black/5"
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--ink-secondary)", fontSize: "14px" }}
          >
            <MessageCircle style={{ width: 15, height: 15 }} />
            Support
          </a>

          {/* Cart Button */}
          <button
            className="cart-button"
            type="button"
            onClick={openCart}
            aria-label="Open cart"
          >
            <ShoppingBag style={{ width: 16, height: 16 }} />
            <span className="cart-badge">{totalItems}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all hover:bg-black/5"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
            style={{ border: "1.5px solid var(--line)" }}
          >
            {isOpen
              ? <X style={{ width: 18, height: 18 }} />
              : <Menu style={{ width: 18, height: 18 }} />
            }
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <div className={`mobile-nav-overlay${isOpen ? " is-open" : ""}`}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <div style={{ marginTop: 40, display: "flex", gap: 12 }}>
          <Link
            className="btn primary"
            href="/#catalog"
            onClick={() => setIsOpen(false)}
          >
            Shop Now
          </Link>
        </div>
      </div>
    </>
  );
}
