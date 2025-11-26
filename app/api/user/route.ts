/**
 * MyAutoWhiz.com - User API Routes
 * 
 * Handles user profile and account operations including:
 * - Getting user profile
 * - Updating profile
 * - Getting subscription info
 * - Account management
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/user - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include')?.split(',') || [];

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    let response: Record<string, unknown> = {
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.email_confirmed_at != null,
        createdAt: user.created_at,
      },
      profile,
    };

    // Include subscription if requested
    if (include.includes('subscription')) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      response.subscription = subscription;
    }

    // Include usage stats if requested
    if (include.includes('usage')) {
      const { data: analyses, count } = await supabase
        .from('analyses')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      const { data: savedVehicles } = await supabase
        .from('saved_vehicles')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      response.usage = {
        totalAnalyses: count || 0,
        analysesThisMonth: profile.analyses_this_month || 0,
        savedVehicles: savedVehicles?.length || 0,
      };
    }

    // Include activity if requested
    if (include.includes('activity')) {
      const { data: activity } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      response.recentActivity = activity;
    }

    return NextResponse.json({ data: response });

  } catch (error) {
    console.error('User GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/user - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      fullName,
      displayName,
      phone,
      country,
      state,
      city,
      zipCode,
      preferences,
    } = body;

    // Build update object
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (fullName !== undefined) updates.full_name = fullName;
    if (displayName !== undefined) updates.display_name = displayName;
    if (phone !== undefined) updates.phone = phone;
    if (country !== undefined) updates.country = country;
    if (state !== undefined) updates.state = state;
    if (city !== undefined) updates.city = city;
    if (zipCode !== undefined) updates.zip_code = zipCode;
    if (preferences !== undefined) updates.preferences = preferences;

    // Update profile
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'profile_updated',
      resource_type: 'profile',
      resource_id: user.id,
      details: { updatedFields: Object.keys(updates) },
    });

    return NextResponse.json({
      data: profile,
      message: 'Profile updated successfully',
    });

  } catch (error) {
    console.error('User PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/user - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { confirmation } = body;

    // Require confirmation
    if (confirmation !== 'DELETE MY ACCOUNT') {
      return NextResponse.json(
        { error: 'Please confirm account deletion by typing "DELETE MY ACCOUNT"' },
        { status: 400 }
      );
    }

    // Cancel any active subscriptions
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subscription?.stripe_subscription_id) {
      // Note: In production, you would cancel the Stripe subscription here
      // await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    }

    // Soft delete: Mark profile as deleted
    await supabase
      .from('profiles')
      .update({
        deleted_at: new Date().toISOString(),
        email: `deleted_${user.id}@deleted.local`,
        full_name: 'Deleted User',
      })
      .eq('id', user.id);

    // Sign out user
    await supabase.auth.signOut();

    return NextResponse.json({
      message: 'Account deleted successfully',
    });

  } catch (error) {
    console.error('User DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
