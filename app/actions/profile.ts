/**
 * MyAutoWhiz.com - Profile Server Actions
 * 
 * Server-side actions for managing user profiles, preferences,
 * and account settings. These run on the server with full
 * database access and proper authentication.
 */

'use server';

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server-client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { UserPreferences } from '@/types/database';

// =============================================================================
// TYPES
// =============================================================================

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export interface ProfileUpdateInput {
  fullName?: string;
  displayName?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
}

export interface PreferencesUpdateInput {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    marketing?: boolean;
  };
  privacy?: {
    share_reports?: boolean;
    analytics_tracking?: boolean;
  };
}

// =============================================================================
// PROFILE ACTIONS
// =============================================================================

/**
 * Get the current user's profile
 */
export async function getProfile(): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        subscription:subscriptions(
          *,
          plan:subscription_plans(*)
        )
      `)
      .eq('id', user.id)
      .single();

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    return { success: true, data: profile };
  } catch (err) {
    return { success: false, error: 'Failed to fetch profile' };
  }
}

/**
 * Update the current user's profile
 */
export async function updateProfile(input: ProfileUpdateInput): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: input.fullName,
        display_name: input.displayName,
        phone: input.phone,
        country: input.country,
        state: input.state,
        city: input.city,
        zip_code: input.zipCode,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'profile_updated',
      resource_type: 'profile',
      resource_id: user.id,
      details: { fields: Object.keys(input) },
    });

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to update profile' };
  }
}

/**
 * Update user preferences
 */
export async function updatePreferences(input: PreferencesUpdateInput): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get current preferences
    const { data: profile } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', user.id)
      .single();

    const currentPrefs = profile?.preferences as UserPreferences || {};

    // Merge with new preferences
    const newPreferences: UserPreferences = {
      theme: input.theme || currentPrefs.theme || 'dark',
      language: input.language || currentPrefs.language || 'en',
      timezone: input.timezone || currentPrefs.timezone || 'America/Chicago',
      notifications: {
        ...currentPrefs.notifications,
        ...input.notifications,
      },
      privacy: {
        ...currentPrefs.privacy,
        ...input.privacy,
      },
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        preferences: newPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: newPreferences };
  } catch (err) {
    return { success: false, error: 'Failed to update preferences' };
  }
}

/**
 * Upload and update avatar
 */
export async function updateAvatar(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const file = formData.get('avatar') as File;
    
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return { success: false, error: 'File size must be less than 5MB' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('user-avatars')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(fileName);

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath('/dashboard/settings');
    return { success: true, data: { avatarUrl: publicUrl } };
  } catch (err) {
    return { success: false, error: 'Failed to upload avatar' };
  }
}

/**
 * Delete user account (soft delete)
 */
export async function deleteAccount(): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Soft delete the profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'account_deleted',
      resource_type: 'profile',
      resource_id: user.id,
    });

    // Sign out
    await supabase.auth.signOut();

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to delete account' };
  }
}

// =============================================================================
// NOTIFICATION ACTIONS
// =============================================================================

/**
 * Get user notifications
 */
export async function getNotifications(options?: {
  limit?: number;
  unreadOnly?: boolean;
}): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (options?.unreadOnly) {
      query = query.eq('is_read', false);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to fetch notifications' };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to mark notification as read' };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to mark all notifications as read' };
  }
}

// =============================================================================
// SESSION ACTIONS
// =============================================================================

/**
 * Get user sessions
 */
export async function getSessions(): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('last_active_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to fetch sessions' };
  }
}

/**
 * Revoke a session
 */
export async function revokeSession(sessionId: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to revoke session' };
  }
}

// =============================================================================
// SAVED VEHICLES ACTIONS
// =============================================================================

/**
 * Get saved vehicles
 */
export async function getSavedVehicles(): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('saved_vehicles')
      .select(`
        *,
        vehicle:vehicles(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to fetch saved vehicles' };
  }
}

/**
 * Save a vehicle
 */
export async function saveVehicle(input: {
  vin: string;
  vehicleId?: string;
  nickname?: string;
  notes?: string;
  listingUrl?: string;
  listingPrice?: number;
  listingSource?: string;
}): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('saved_vehicles')
      .upsert({
        user_id: user.id,
        vin: input.vin,
        vehicle_id: input.vehicleId,
        nickname: input.nickname,
        notes: input.notes,
        listing_url: input.listingUrl,
        listing_price: input.listingPrice,
        listing_source: input.listingSource,
      }, {
        onConflict: 'user_id,vin',
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/saved');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to save vehicle' };
  }
}

/**
 * Remove saved vehicle
 */
export async function removeSavedVehicle(savedVehicleId: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('saved_vehicles')
      .delete()
      .eq('id', savedVehicleId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/saved');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to remove saved vehicle' };
  }
}

// =============================================================================
// ACTIVITY LOG ACTIONS
// =============================================================================

/**
 * Get user activity history
 */
export async function getActivityHistory(options?: {
  limit?: number;
  offset?: number;
}): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    let query = supabase
      .from('activity_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: { logs: data, total: count } };
  } catch (err) {
    return { success: false, error: 'Failed to fetch activity history' };
  }
}
