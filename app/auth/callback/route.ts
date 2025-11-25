/**
 * MyAutoWhiz.com - OAuth Callback Handler
 * 
 * This route handles the OAuth callback from all providers:
 * - Google
 * - Apple
 * - Facebook
 * - GitHub
 * 
 * It exchanges the code for a session and redirects to the dashboard.
 */

import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    );
  }

  // No code provided
  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/login?error=No authorization code provided', requestUrl.origin)
    );
  }

  try {
    const supabase = await createServerSupabaseClient();

    // Exchange code for session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      );
    }

    // Check if this is a new user (profile might need setup)
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', data.user.id)
        .single();

      // If no profile exists yet, the database trigger should create it
      // But we can do additional setup here if needed
      if (!profile) {
        // Profile will be created by the database trigger
        // Wait a moment for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Log the OAuth sign-in
      await supabase.from('activity_logs').insert({
        user_id: data.user.id,
        action: 'oauth_sign_in',
        resource_type: 'auth',
        details: {
          provider: data.user.app_metadata?.provider || 'unknown',
          email: data.user.email,
        },
      });

      // Update last seen
      await supabase
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', data.user.id);
    }

    // Redirect to the intended destination
    return NextResponse.redirect(new URL(next, requestUrl.origin));

  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(
      new URL('/auth/login?error=Authentication failed', requestUrl.origin)
    );
  }
}
