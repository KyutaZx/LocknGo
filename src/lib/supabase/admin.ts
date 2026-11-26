import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();
  return Boolean(
    url &&
      key &&
      !url.includes('mock.supabase.co') &&
      !url.includes('your-project.supabase.co') &&
      !key.includes('your-')
  );
}

export function createAdminClient(): SupabaseClient<Database> {
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://mock.supabase.co';
  let supabaseUrl = rawUrl;
  try {
    supabaseUrl = new URL(rawUrl).origin;
  } catch {
    supabaseUrl = rawUrl;
  }

  const supabaseKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'mock-anon-key'
  ).trim();

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
    },
  });
}
