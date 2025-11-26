/**
 * MyAutoWhiz.com - Webhooks Hub
 * 
 * General webhook endpoint that routes to appropriate handlers
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');

  switch (provider) {
    case 'stripe':
      // Stripe webhooks are handled at /api/webhooks/stripe
      return NextResponse.json(
        { error: 'Use /api/webhooks/stripe for Stripe webhooks' },
        { status: 400 }
      );

    default:
      return NextResponse.json(
        { error: 'Unknown webhook provider' },
        { status: 400 }
      );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhooks endpoint',
    endpoints: {
      stripe: '/api/webhooks/stripe',
    },
  });
}
