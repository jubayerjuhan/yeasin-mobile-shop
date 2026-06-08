"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Lock, Zap } from "lucide-react";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "var(--admin-accent-bg)",
              border: "1px solid hsla(262, 78%, 62%, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Zap style={{ width: 24, height: 24, color: "var(--admin-accent)" }} />
          </div>
          <h1
            style={{
              margin: "0 0 6px",
              fontSize: 26,
              fontWeight: 750,
              letterSpacing: "-0.03em",
              color: "var(--admin-text)",
            }}
          >
            Admin Console
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "var(--admin-text-2)",
              fontWeight: 400,
            }}
          >
            Sign in to manage your store
          </p>
        </div>

        {/* Form */}
        <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              htmlFor="admin-email"
              className="admin-label"
            >
              Email address
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              placeholder="admin@yeasin.com"
              required
              defaultValue="admin@yeasin.com"
              className="admin-input"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="admin-label"
            >
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              defaultValue="password123"
              className="admin-input"
            />
          </div>

          {state?.error && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "var(--r-md)",
                background: "var(--admin-red-bg)",
                border: "1px solid hsla(0, 84%, 62%, 0.2)",
                color: "var(--admin-red)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {state.error}
            </div>
          )}

          <button
            className="admin-btn admin-btn-primary"
            type="submit"
            disabled={isPending}
            style={{
              width: "100%",
              minHeight: 44,
              marginTop: 8,
              fontSize: 15,
              borderRadius: 12,
            }}
          >
            {isPending ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Signing in…
              </>
            ) : (
              <>
                <Lock style={{ width: 15, height: 15 }} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Trust signal */}
        <p
          style={{
            margin: "24px 0 0",
            fontSize: 12,
            color: "var(--admin-text-2)",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          Secured · Admin access only
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
