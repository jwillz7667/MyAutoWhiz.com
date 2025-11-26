/**
 * MyAutoWhiz.com - Notifications API Routes
 * 
 * Handles user notification operations:
 * - GET: List notifications
 * - PATCH: Mark as read
 * - DELETE: Delete notification
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/notifications - Get user's notifications
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
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      );
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    return NextResponse.json({
      data,
      unreadCount: unreadCount || 0,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0),
      },
    });

  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - Mark notification(s) as read
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
    const { id, ids, markAll } = body;

    if (markAll) {
      // Mark all notifications as read
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update notifications' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'All notifications marked as read',
      });
    }

    const notificationIds = ids || (id ? [id] : []);

    if (notificationIds.length === 0) {
      return NextResponse.json(
        { error: 'Notification ID(s) required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .in('id', notificationIds);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update notifications' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Notifications marked as read',
    });

  } catch (error) {
    console.error('Notifications PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - Delete notification(s)
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
    const clearAll = searchParams.get('all') === 'true';
    const clearRead = searchParams.get('read') === 'true';

    if (clearAll) {
      // Delete all notifications
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        return NextResponse.json(
          { error: 'Failed to delete notifications' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'All notifications deleted',
      });
    }

    if (clearRead) {
      // Delete only read notifications
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)
        .eq('read', true);

      if (error) {
        return NextResponse.json(
          { error: 'Failed to delete notifications' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Read notifications deleted',
      });
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Notification deleted',
    });

  } catch (error) {
    console.error('Notifications DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
