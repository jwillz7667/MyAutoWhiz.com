/**
 * MyAutoWhiz.com - Authentication Utilities
 * 
 * Comprehensive authentication system supporting:
 * - Email/Password authentication
 * - OAuth providers (Google, Apple, Facebook, GitHub)
 * - Session management
 * - Profile management
 * - Password reset
 * - Email verification
 */

import { createBrowserSupabaseClient, createServerSupabaseClient } from './client';
import type { Provider, AuthError, User, Session } from '@supabase/supabase-js';

// =============================================================================
// TYPES
// =============================================================================

export type AuthProvider = 'google' | 'apple' | 'facebook' | 'github';

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  referralCode?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: string;
}

export interface ProfileUpdateData {
  fullName?: string;
  displayName?: string;
  phone?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
}

// =============================================================================
// CLIENT-SIDE AUTH FUNCTIONS
// =============================================================================

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(data: SignUpData): Promise<AuthResult> {
  const supabase = createBrowserSupabaseClient();

  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          referral_code: data.referralCode,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: authData.user,
      session: authData.session,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(data: SignInData): Promise<AuthResult> {
  const supabase = createBrowserSupabaseClient();

  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: authData.user,
      session: authData.session,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(provider: AuthProvider): Promise<{ error?: string }> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        // Request offline access for refresh tokens
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error?: string }> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return {};
}

/**
 * Get the current session
 */
export async function getSession(): Promise<Session | null> {
  const supabase = createBrowserSupabaseClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createBrowserSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Request password reset email
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Update password with reset token
 */
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Resend email verification
 */
export async function resendVerificationEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Update user email
 */
export async function updateEmail(newEmail: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// =============================================================================
// PROFILE MANAGEMENT
// =============================================================================

/**
 * Get user profile from profiles table
 */
export async function getUserProfile(userId: string) {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: ProfileUpdateData
): Promise<{ success: boolean; error?: string }> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: updates.fullName,
      display_name: updates.displayName,
      phone: updates.phone,
      avatar_url: updates.avatarUrl,
      preferences: updates.preferences,
      country: updates.country,
      state: updates.state,
      city: updates.city,
      zip_code: updates.zipCode,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = createBrowserSupabaseClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('user-avatars')
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('user-avatars')
    .getPublicUrl(fileName);

  // Update profile with new avatar URL
  await updateUserProfile(userId, { avatarUrl: publicUrl });

  return { success: true, url: publicUrl };
}

// =============================================================================
// SUBSCRIPTION & USAGE
// =============================================================================

/**
 * Get user subscription
 */
export async function getUserSubscription(userId: string) {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:subscription_plans(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

/**
 * Check if user can perform an analysis
 */
export async function canPerformAnalysis(userId: string): Promise<{
  canAnalyze: boolean;
  reason?: string;
  remaining?: number;
}> {
  const supabase = createBrowserSupabaseClient();

  // Get subscription
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    // Check free tier limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('analyses_this_month')
      .eq('id', userId)
      .single();

    const usedThisMonth = profile?.analyses_this_month || 0;
    const freeLimit = 2;

    if (usedThisMonth >= freeLimit) {
      return {
        canAnalyze: false,
        reason: 'You have reached your free monthly limit. Please upgrade to continue.',
        remaining: 0,
      };
    }

    return {
      canAnalyze: true,
      remaining: freeLimit - usedThisMonth,
    };
  }

  // Check subscription limits
  const plan = subscription.plan;
  const used = subscription.analyses_used || 0;
  const limit = plan?.analyses_per_month || 0;

  if (used >= limit) {
    return {
      canAnalyze: false,
      reason: 'You have reached your monthly analysis limit. Please upgrade or wait until next month.',
      remaining: 0,
    };
  }

  return {
    canAnalyze: true,
    remaining: limit - used,
  };
}

/**
 * Increment analysis usage count
 */
export async function incrementAnalysisUsage(userId: string): Promise<void> {
  const supabase = createBrowserSupabaseClient();

  // Update profile count
  const { data: profile } = await supabase
    .from('profiles')
    .select('analyses_this_month')
    .eq('id', userId)
    .single();

  await supabase
    .from('profiles')
    .update({
      analyses_this_month: (profile?.analyses_this_month || 0) + 1,
      last_analysis_at: new Date().toISOString(),
    })
    .eq('id', userId);

  // Update subscription count if exists
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, analyses_used')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (subscription) {
    await supabase
      .from('subscriptions')
      .update({
        analyses_used: (subscription.analyses_used || 0) + 1,
      })
      .eq('id', subscription.id);
  }
}

// =============================================================================
// AUTH STATE LISTENER
// =============================================================================

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  const supabase = createBrowserSupabaseClient();

  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

// =============================================================================
// SERVER-SIDE AUTH FUNCTIONS
// =============================================================================

/**
 * Get session on server side
 */
export async function getServerSession(): Promise<Session | null> {
  const supabase = await createServerSupabaseClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get user on server side
 */
export async function getServerUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Protect a server action - throws if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getServerUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

/**
 * Protect a server action and require specific role
 */
export async function requireRole(allowedRoles: string[]): Promise<User> {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (!profile || !allowedRoles.includes(profile.role)) {
    throw new Error('Insufficient permissions');
  }
  
  return user;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if email is already registered
 */
export async function isEmailRegistered(email: string): Promise<boolean> {
  const supabase = createBrowserSupabaseClient();
  
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();
  
  return !!data;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Parse OAuth callback URL for errors
 */
export function parseAuthCallbackError(searchParams: URLSearchParams): string | null {
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  if (error) {
    return errorDescription || error;
  }
  
  return null;
}
