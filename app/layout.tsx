import type { Metadata } from "next";
import { Inter, Geist, Noto_Sans_Bengali } from "next/font/google";
import { CartDrawer } from "@/components/drawer/cart-drawer";
import { StoreProvider } from "@/components/provider/store-provider";
import { getProducts } from "@/lib/db";
import "./globals.css";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
});

export const metadata: Metadata = {
  title: "Yeasin Mobile Shop | Premium Tech Store & Accessories",
  description:
    "Yeasin Mobile Shop — Bangladesh's premier storefront for phones, wearables, accessories, and Stripe-ready checkout in Nawabgonj, Dhaka.",
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
    <html lang="en" className={cn("font-sans", geist.variable, inter.variable)}>
      <body className={`${geist.variable} ${inter.variable} ${notoSansBengali.variable}`}>
        <StoreProvider products={products}>
          {children}
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
