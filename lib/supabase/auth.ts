/**
 * MyAutoWhiz.com - Client-Side Authentication
 * 
 * Client-safe authentication functions
 * Safe to import in 'use client' components
 */

import { createBrowserSupabaseClient } from './client';
import type { Provider, User, Session } from '@supabase/supabase-js';

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
  preferences?: Record<string, unknown>;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
}

export interface PasswordValidation {
  isValid: boolean;
  requirements: {
    text: string;
    met: boolean;
  }[];
}

// =============================================================================
// AUTH FUNCTIONS
// =============================================================================

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(data: SignUpData) {
  const supabase = createBrowserSupabaseClient();

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
    return { error };
  }

  return { data: authData, error: null };
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(data: SignInData) {
  const supabase = createBrowserSupabaseClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { error };
  }

  return { data: authData, error: null };
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(provider: AuthProvider) {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return { error };
  }

  return { error: null };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.signOut();
  return { error };
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
export async function requestPasswordReset(email: string) {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  return { error };
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { error };
}

/**
 * Update user email
 */
export async function updateEmail(newEmail: string) {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  return { error };
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string) {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  });

  return { error };
}

// =============================================================================
// PROFILE FUNCTIONS
// =============================================================================

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
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
) {
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

  return { error };
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(userId: string, file: File) {
  const supabase = createBrowserSupabaseClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('user-avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    return { error: uploadError, url: null };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('user-avatars')
    .getPublicUrl(filePath);

  // Update profile with new avatar URL
  await updateUserProfile(userId, { avatarUrl: publicUrl });

  return { error: null, url: publicUrl };
}

// =============================================================================
// SUBSCRIPTION FUNCTIONS
// =============================================================================

/**
 * Get user subscription with plan details
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

  if (error) {
    return null;
  }

  return data;
}

/**
 * Check if user can perform analysis
 */
export async function canPerformAnalysis(userId: string) {
  const supabase = createBrowserSupabaseClient();

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('analyses_this_month, role')
    .eq('id', userId)
    .single();

  if (!profile) {
    return {
      canAnalyze: false,
      reason: 'Profile not found',
      remaining: 0,
    };
  }

  // Admin/enterprise users have unlimited
  if (['admin', 'super_admin', 'enterprise'].includes(profile.role)) {
    return {
      canAnalyze: true,
      remaining: Infinity,
    };
  }

  // Get subscription
  const subscription = await getUserSubscription(userId);

  // Free tier users
  if (!subscription) {
    const freeLimit = 2;
    const usedThisMonth = profile.analyses_this_month || 0;

    if (usedThisMonth >= freeLimit) {
      return {
        canAnalyze: false,
        reason: 'Free tier limit reached. Please upgrade for more analyses.',
        remaining: 0,
      };
    }

    return {
      canAnalyze: true,
      remaining: freeLimit - usedThisMonth,
    };
  }

  // Subscription users
  const plan = subscription.plan;
  const used = subscription.analyses_used || 0;
  const limit = plan?.analyses_per_month || 0;

  if (used >= limit) {
    return {
      canAnalyze: false,
      reason: 'Monthly limit reached. Please upgrade or wait until next month.',
      remaining: 0,
    };
  }

  return {
    canAnalyze: true,
    remaining: limit - used,
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validate password strength
 */
export function validatePassword(password: string): PasswordValidation {
  const requirements = [
    {
      text: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      text: 'Contains uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      text: 'Contains lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      text: 'Contains number',
      met: /\d/.test(password),
    },
    {
      text: 'Contains special character',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  return {
    isValid: requirements.every((req) => req.met),
    requirements,
  };
}

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
