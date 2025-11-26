/**
 * MyAutoWhiz.com - Supabase Browser Client
 * 
 * Client-side only Supabase client
 * Safe to import in 'use client' components
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Create a Supabase client for browser/client-side usage
 * Use this in client components
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    }
  );
}
