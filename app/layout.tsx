import type { Metadata } from "next";
import { Manrope, Noto_Sans_Bengali } from "next/font/google";
import { CartDrawer } from "@/components/drawer/cart-drawer";
import { StoreProvider } from "@/components/provider/store-provider";
import { getProducts } from "@/lib/db";
import "./globals.css";

export const dynamic = "force-dynamic";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
});

export const metadata: Metadata = {
  title: "Yeasin Mobile Shop | Tech Store & Accessories",
  description:
    "Yeasin Mobile Shop storefront for phones, wearables, accessories, and Stripe-ready checkout in Nawabgonj, Dhaka.",
  icons: {
    icon: "/assets/yeasin-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = getProducts();

  return (
    <html lang="en">
      <body className={`${manrope.variable} ${notoSansBengali.variable}`}>
        <StoreProvider products={products}>
          {children}
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
