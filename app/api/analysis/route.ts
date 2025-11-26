/**
 * MyAutoWhiz.com - Analysis API Routes
 * 
 * Handles vehicle analysis operations including:
 * - Creating new analyses
 * - Fetching analysis status
 * - Getting analysis results
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/analysis - Get user's analyses or specific analysis
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
    const analysisId = searchParams.get('id');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get specific analysis
    if (analysisId) {
      const { data, error } = await supabase
        .from('analyses')
        .select(`
          *,
          vehicle_history:vehicle_histories(*),
          visual_analysis:visual_analyses(*),
          audio_analysis:audio_analyses(*)
        `)
        .eq('id', analysisId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Analysis not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ data });
    }

    // Get all user's analyses
    let query = supabase
      .from('analyses')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch analyses' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0),
      },
    });
  } catch (error) {
    console.error('Analysis GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/analysis - Create new analysis
export async function POST(request: NextRequest) {
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
    const { vin, mileage, askingPrice, options } = body;

    // Validate VIN
    if (!vin || vin.length !== 17) {
      return NextResponse.json(
        { error: 'Invalid VIN. Must be 17 characters.' },
        { status: 400 }
      );
    }

    // Check user's analysis quota
    const { data: profile } = await supabase
      .from('profiles')
      .select('analyses_this_month, role')
      .eq('id', user.id)
      .single();

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, plan:subscription_plans(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    // Determine limits
    let limit = 2; // Free tier
    if (subscription?.plan) {
      limit = subscription.plan.analyses_per_month || 999;
    }
    if (['admin', 'super_admin', 'enterprise'].includes(profile?.role || '')) {
      limit = 9999;
    }

    const used = profile?.analyses_this_month || 0;
    if (used >= limit) {
      return NextResponse.json(
        { error: 'Monthly analysis limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Create analysis record
    const { data: analysis, error: createError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        vin: vin.toUpperCase(),
        mileage,
        asking_price: askingPrice,
        status: 'pending',
        analysis_options: options || {
          include_history: true,
          include_visual: false,
          include_audio: false,
        },
      })
      .select()
      .single();

    if (createError) {
      console.error('Create analysis error:', createError);
      return NextResponse.json(
        { error: 'Failed to create analysis' },
        { status: 500 }
      );
    }

    // Increment usage count
    await supabase
      .from('profiles')
      .update({
        analyses_this_month: used + 1,
        last_analysis_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'analysis_created',
      resource_type: 'analysis',
      resource_id: analysis.id,
      details: { vin, options },
    });

    return NextResponse.json({
      data: analysis,
      message: 'Analysis created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Analysis POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/analysis - Delete an analysis
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

    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get('id');

    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('analyses')
      .select('id')
      .eq('id', analysisId)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Delete analysis (cascades to related records)
    const { error: deleteError } = await supabase
      .from('analyses')
      .delete()
      .eq('id', analysisId);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete analysis' },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'analysis_deleted',
      resource_type: 'analysis',
      resource_id: analysisId,
    });

    return NextResponse.json({
      message: 'Analysis deleted successfully',
    });

  } catch (error) {
    console.error('Analysis DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
