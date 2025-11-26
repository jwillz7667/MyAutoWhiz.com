/**
 * MyAutoWhiz.com - Supabase Server Client
 * 
 * Server-side only Supabase client
 * Use in Server Components, Route Handlers, and Server Actions
 * DO NOT import in 'use client' components
 */

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Create a Supabase client for server-side usage
 * Use this in Server Components, Route Handlers, and Server Actions
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle cookie errors in Server Components
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase admin client with service role key
 * Use ONLY on server-side for admin operations
 * This bypasses RLS policies
 */
export function createAdminSupabaseClient() {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin client');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
