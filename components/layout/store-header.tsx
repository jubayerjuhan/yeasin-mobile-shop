"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";
import { useStore } from "@/components/provider/store-provider";

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
        <span className="brand-mark brand-mark-large">
          <Image
            src="/assets/yeasin-logo.svg"
            alt={`${siteConfig.name} logo`}
            width={52}
            height={52}
          />
        </span>
        <span>
          <strong>{siteConfig.name}</strong>
          <small>Smart devices and accessories</small>
        </span>
      </Link>

      <button
        className="nav-toggle"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span />
        <span />
      </button>

      <nav className={isOpen ? "site-nav store-nav is-open" : "site-nav store-nav"}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <Link className="header-link" href="/admin">
          Admin
        </Link>
        <a className="header-link" href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <button className="cart-button" type="button" onClick={openCart}>
          Cart
          <span>{totalItems}</span>
        </button>
      </div>
    </header>
  );
}
