/**
 * MyAutoWhiz.com - Server-Side Authentication
 * 
 * Server-only authentication functions
 * Use in Server Components, Route Handlers, and Server Actions
 * DO NOT import in 'use client' components
 */

import { createServerSupabaseClient, createAdminSupabaseClient } from './server';
import type { User, Session } from '@supabase/supabase-js';

// =============================================================================
// SERVER AUTH FUNCTIONS
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

/**
 * Get user profile on server side
 */
export async function getServerUserProfile(userId: string) {
  const supabase = await createServerSupabaseClient();
  
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
 * Get user subscription on server side
 */
export async function getServerUserSubscription(userId: string) {
  const supabase = await createServerSupabaseClient();
  
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

// =============================================================================
// ADMIN FUNCTIONS
// =============================================================================

/**
 * Get user by ID (admin only)
 */
export async function adminGetUser(userId: string) {
  const supabase = createAdminSupabaseClient();
  
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  
  if (error) {
    return null;
  }
  
  return data.user;
}

/**
 * Delete user (admin only)
 */
export async function adminDeleteUser(userId: string) {
  const supabase = createAdminSupabaseClient();
  
  const { error } = await supabase.auth.admin.deleteUser(userId);
  
  return { error };
}

/**
 * Update user (admin only)
 */
export async function adminUpdateUser(
  userId: string,
  updates: { email?: string; password?: string; user_metadata?: Record<string, unknown> }
) {
  const supabase = createAdminSupabaseClient();
  
  const { data, error } = await supabase.auth.admin.updateUserById(userId, updates);
  
  return { data, error };
}
