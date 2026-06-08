import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createOrder, getProducts } from "@/lib/db";

type RequestItem = {
  slug: string;
  quantity: number;
};

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_SITE_URL in .env.local.",
      },
      { status: 500 },
    );
  }

  const products = await getProducts();
  const body = (await request.json()) as { items?: RequestItem[] };
  const items = body.items ?? [];

  const lineItems = items.reduce<
    Array<{
      quantity: number;
      price_data: {
        currency: string;
        product_data: {
          name: string;
          description: string;
          images: string[];
        };
        unit_amount: number;
      };
    }>
  >((accumulator, item) => {
      const product = products.find((entry) => entry.slug === item.slug);
      if (!product || item.quantity <= 0) {
        return accumulator;
      }
      accumulator.push({
        quantity: item.quantity,
        price_data: {
          currency: "bdt",
          product_data: {
            name: product.name,
            description: product.shortDescription,
            images: [product.image.startsWith("http") ? product.image : `${getBaseUrl(request)}${product.image}`],
          },
          unit_amount: product.price * 100,
        },
      });
      return accumulator;
    }, []);

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: "Your cart is empty." },
      { status: 400 },
    );
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2026-05-27.dahlia" as any,
  });
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${getBaseUrl(request)}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl(request)}/checkout/cancel`,
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
    });

    await createOrder({
      stripeSessionId: session.id,
      customerEmail: null,
      amountTotal: lineItems.reduce(
        (sum, item) => sum + item.price_data.unit_amount * item.quantity,
        0,
      ) / 100,
      currency: "bdt",
      paymentStatus: "pending",
      fulfillmentStatus: "unfulfilled",
      items: lineItems.map((item) => ({
        productSlug:
          products.find((product) => product.name === item.price_data.product_data.name)
            ?.slug ?? "unknown",
        productName: item.price_data.product_data.name,
        quantity: item.quantity,
        unitPrice: item.price_data.unit_amount / 100,
      })),
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}

function getBaseUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const origin = request.headers.get("origin");
  if (origin) {
    return origin;
  }

  return "http://127.0.0.1:3000";
}
