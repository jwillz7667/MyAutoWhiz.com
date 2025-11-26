/**
 * MyAutoWhiz.com - Single Analysis API Route
 * 
 * Handles operations on a specific analysis:
 * - GET: Fetch analysis details
 * - PATCH: Update analysis
 * - DELETE: Delete analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/analysis/[id] - Get specific analysis
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('analyses')
      .select(`
        *,
        vehicle_history:vehicle_histories(*),
        visual_analysis:visual_analyses(*),
        audio_analysis:audio_analyses(*),
        market_value:market_values(*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Analysis GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/analysis/[id] - Update analysis
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('analyses')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { notes, tags, starred, mileage, askingPrice } = body;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (notes !== undefined) updates.notes = notes;
    if (tags !== undefined) updates.tags = tags;
    if (starred !== undefined) updates.starred = starred;
    if (mileage !== undefined) updates.mileage = mileage;
    if (askingPrice !== undefined) updates.asking_price = askingPrice;

    const { data, error } = await supabase
      .from('analyses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update analysis' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      message: 'Analysis updated successfully',
    });

  } catch (error) {
    console.error('Analysis PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/analysis/[id] - Delete analysis
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('analyses')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Delete (will cascade to related records)
    const { error } = await supabase
      .from('analyses')
      .delete()
      .eq('id', id);

    if (error) {
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
      resource_id: id,
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
