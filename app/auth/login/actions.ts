"use server";

import { authService } from "@/lib/services/auth-service";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await authService.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  const { data, error } = await authService.signUp({
    email,
    password,
    options: {
      full_name: fullName,
      role: role || "cashier",
    },
  });

  if (error) {
    return { error: (error as any).message || "Sign up failed" };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  await authService.signOut();
  redirect("/auth/login");
}
