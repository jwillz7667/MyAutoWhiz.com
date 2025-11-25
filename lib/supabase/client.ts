/**
 * MyAutoWhiz.com - Supabase Client Configuration
 * 
 * Configures Supabase client with:
 * - Server-side and client-side clients
 * - OAuth provider support
 * - Type-safe database access
 * - Session management
 */

import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

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

// Server-side functions moved to server-client.ts

/**
 * Standard Supabase client (for backwards compatibility)
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
