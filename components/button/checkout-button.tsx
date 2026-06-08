"use client";

import { useState } from "react";
import { useStore } from "@/components/provider/store-provider";

export function CheckoutButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const { cartItems } = useStore();

  const handleCheckout = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cartItems }),
      });

      const payload = (await response.json()) as
        | { url: string }
        | { error: string };

      if (!response.ok || !("url" in payload)) {
        throw new Error("error" in payload ? payload.error : "Checkout failed");
      }

      window.location.href = payload.url;
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Stripe checkout could not be started.",
      );
    }
  };

  return (
    <div className="checkout-action">
      <button
        className="btn primary"
        type="button"
        onClick={handleCheckout}
        disabled={cartItems.length === 0 || status === "loading"}
      >
        {status === "loading" ? "Redirecting to Stripe..." : "Pay with Stripe"}
      </button>
      {message ? <p className="error-text">{message}</p> : null}
    </div>
  );
}
