"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="admin-page" style={{ maxWidth: "400px", margin: "100px auto" }}>
      <div className="admin-section">
        <h2>Admin Login</h2>
        <form action={action} className="admin-form-grid">
          <input
            name="email"
            type="email"
            placeholder="Email address"
            required
            defaultValue="admin@yeasin.com"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            defaultValue="password123"
          />
          {state?.error && <p style={{ color: "red", fontSize: "14px" }}>{state.error}</p>}
          <button className="btn primary" type="submit" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
