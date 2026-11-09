"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Read at build time (NEXT_PUBLIC_* is inlined). If either is missing, the app
// runs exactly as before — fully local, no sign-in — so sync is purely opt-in.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
