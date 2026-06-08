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
];

export function StoreHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, openCart } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`store-header${isScrolled ? " is-scrolled" : ""}${
        isOpen ? " is-open" : ""
      }`}
    >
      <Link className="brand brand-ecom" href="/">
        <span className="brand-mark brand-mark-large flex items-center justify-center bg-white shadow-sm border border-black/5">
          <Image
            src="/assets/yeasin-logo.svg"
            alt={`${siteConfig.name} logo`}
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </span>
        <span className="hidden sm:block">
          <strong className="text-lg font-bold tracking-tight">{siteConfig.name}</strong>
          <small className="text-muted-foreground text-xs font-medium">Smart devices and accessories</small>
        </span>
      </Link>

      <nav className={isOpen ? "site-nav store-nav is-open" : "site-nav store-nav hidden md:flex"}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-sm font-medium text-black/70 hover:text-black transition-colors">
            {link.label}
          </a>
        ))}
      </nav>

      <div className="header-actions flex items-center gap-4">
        <Link className="hidden md:flex text-sm font-medium text-black/70 hover:text-black transition-colors" href="/admin">
          Admin
        </Link>
        <a 
          className="hidden md:flex items-center gap-1.5 text-sm font-medium text-black/70 hover:text-black transition-colors" 
          href={siteConfig.whatsappUrl} 
          target="_blank" 
          rel="noreferrer"
        >
          <MessageCircle className="w-4 h-4" />
          Support
        </a>
        <button 
          className="cart-button flex items-center gap-2 bg-black/5 hover:bg-black/10 px-4 py-2 rounded-full transition-all" 
          type="button" 
          onClick={openCart}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="bg-black text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        </button>
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-black/5 transition-colors"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}

