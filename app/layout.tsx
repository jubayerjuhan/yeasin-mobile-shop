import type { Metadata } from "next";
import { Manrope, Noto_Sans_Bengali, Geist } from "next/font/google";
import { CartDrawer } from "@/components/drawer/cart-drawer";
import { StoreProvider } from "@/components/provider/store-provider";
import { getProducts } from "@/lib/db";
import "./globals.css";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getProducts();

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${geist.variable} ${notoSansBengali.variable}`}>
        <StoreProvider products={products}>
          {children}
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
