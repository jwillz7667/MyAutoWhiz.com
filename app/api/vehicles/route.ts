/**
 * MyAutoWhiz.com - Saved Vehicles API Routes
 * 
 * Handles saved vehicle operations:
 * - GET: List saved vehicles
 * - POST: Save a vehicle
 * - DELETE: Remove saved vehicle
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/vehicles - Get user's saved vehicles
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const { data, error, count } = await supabase
      .from('saved_vehicles')
      .select(`
        *,
        analysis:analyses(
          id,
          overall_score,
          status,
          vehicle_info
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch saved vehicles' },
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
    console.error('Vehicles GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/vehicles - Save a vehicle
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
    const {
      vin,
      analysisId,
      year,
      make,
      model,
      trim,
      listingUrl,
      listingPrice,
      dealerName,
      dealerLocation,
      notes,
      tags,
    } = body;

    // Validate required fields
    if (!vin) {
      return NextResponse.json(
        { error: 'VIN is required' },
        { status: 400 }
      );
    }

    // Check for duplicate
    const { data: existing } = await supabase
      .from('saved_vehicles')
      .select('id')
      .eq('user_id', user.id)
      .eq('vin', vin.toUpperCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Vehicle already saved' },
        { status: 409 }
      );
    }

    // Save vehicle
    const { data, error } = await supabase
      .from('saved_vehicles')
      .insert({
        user_id: user.id,
        vin: vin.toUpperCase(),
        analysis_id: analysisId,
        year,
        make,
        model,
        trim,
        listing_url: listingUrl,
        listing_price: listingPrice,
        dealer_name: dealerName,
        dealer_location: dealerLocation,
        notes,
        tags: tags || [],
      })
      .select()
      .single();

    if (error) {
      console.error('Save vehicle error:', error);
      return NextResponse.json(
        { error: 'Failed to save vehicle' },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'vehicle_saved',
      resource_type: 'saved_vehicle',
      resource_id: data.id,
      details: { vin, make, model },
    });

    return NextResponse.json({
      data,
      message: 'Vehicle saved successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Vehicles POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/vehicles - Remove saved vehicle
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
    const id = searchParams.get('id');
    const vin = searchParams.get('vin');

    if (!id && !vin) {
      return NextResponse.json(
        { error: 'ID or VIN required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('saved_vehicles')
      .delete()
      .eq('user_id', user.id);

    if (id) {
      query = query.eq('id', id);
    } else if (vin) {
      query = query.eq('vin', vin.toUpperCase());
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to remove vehicle' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Vehicle removed successfully',
    });

  } catch (error) {
    console.error('Vehicles DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/vehicles - Update saved vehicle
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
    const { id, notes, tags, listingPrice, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID required' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (notes !== undefined) updates.notes = notes;
    if (tags !== undefined) updates.tags = tags;
    if (listingPrice !== undefined) updates.listing_price = listingPrice;
    if (status !== undefined) updates.status = status;

    const { data, error } = await supabase
      .from('saved_vehicles')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update vehicle' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      message: 'Vehicle updated successfully',
    });

  } catch (error) {
    console.error('Vehicles PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
