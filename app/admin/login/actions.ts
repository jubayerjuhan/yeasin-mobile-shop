"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { encrypt } from "@/lib/auth";

export async function loginAction(state: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  await connectToDatabase();
  const user = await User.findOne({ email });

  if (!user) {
    return { error: "Invalid credentials" };
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return { error: "Invalid credentials" };
  }

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ user: { id: user._id.toString(), email: user.email, role: user.role }, expires });

  const cookieStore = await cookies();
  cookieStore.set("session", session, { expires, httpOnly: true });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
  redirect("/admin/login");
}
