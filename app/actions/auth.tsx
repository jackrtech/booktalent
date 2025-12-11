"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase()
  const password = (formData.get("password") as string) || ""

  // Basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    }
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters long.",
    }
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => {
        cookieStore.set({ name, value, ...options })
      },
      remove: (name: string, options: any) => {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/verification`,
    },
  })

  if (authError) {
    console.error("[v0] Auth signup error:", authError)
    return {
      success: false,
      error: authError.message,
    }
  }

  if (!authData.user) {
    return {
      success: false,
      error: "Failed to create user account.",
    }
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    email: email,
    user_type: null, // Will be set during verification flow
    is_verified: false,
    verification_status: "pending",
    onboarding_completed: false,
  })

  if (profileError) {
    console.error("[v0] Profile creation error:", profileError)
    return {
      success: false,
      error: "Account created but profile setup failed. Please contact support.",
    }
  }

  console.log("[v0] User successfully created:", { email, userId: authData.user.id })

  return {
    success: true,
    userId: authData.user.id,
  }
}

export async function signIn(formData: FormData) {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase()
  const password = (formData.get("password") as string) || ""

  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => {
        cookieStore.set({ name, value, ...options })
      },
      remove: (name: string, options: any) => {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    console.error("[v0] Auth signin error:", authError)
    return {
      success: false,
      error: "Invalid email or password.",
    }
  }

  if (!authData.user) {
    return {
      success: false,
      error: "Failed to sign in.",
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_type, onboarding_completed, is_verified")
    .eq("id", authData.user.id)
    .single()

  if (profileError) {
    console.error("[v0] Profile fetch error:", profileError)
    return {
      success: false,
      error: "Failed to load user profile.",
    }
  }

  console.log("[v0] User signed in:", { email, userId: authData.user.id, profile })

  return {
    success: true,
    userId: authData.user.id,
    needsVerification: !profile.user_type || !profile.is_verified,
    needsOnboarding: !profile.onboarding_completed,
    userType: profile.user_type,
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => {
        cookieStore.set({ name, value, ...options })
      },
      remove: (name: string, options: any) => {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  await supabase.auth.signOut()
  redirect("/")
}
