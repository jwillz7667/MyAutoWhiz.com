/**
 * MyAutoWhiz.com - Stripe Webhook Handler
 * 
 * Handles Stripe webhook events for subscription management:
 * - checkout.session.completed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.paid
 * - invoice.payment_failed
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabase, session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(supabase, invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(supabase, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.user_id;
  const priceId = session.metadata?.price_id;

  if (!userId || !priceId) {
    console.error('Missing user_id or price_id in session metadata');
    return;
  }

  // Get plan by price ID
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('*')
    .or(`stripe_price_id_monthly.eq.${priceId},stripe_price_id_yearly.eq.${priceId}`)
    .single();

  if (!plan) {
    console.error('Plan not found for price:', priceId);
    return;
  }

  // Update or create subscription
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan_id: plan.id,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      analyses_used: 0,
    }, {
      onConflict: 'user_id',
    });

  // Update user role
  await supabase
    .from('profiles')
    .update({
      role: plan.name === 'Enterprise' ? 'enterprise' : 'pro',
      stripe_customer_id: session.customer as string,
    })
    .eq('id', userId);

  // Log activity
  await supabase.from('activity_logs').insert({
    user_id: userId,
    action: 'subscription_created',
    resource_type: 'subscription',
    details: {
      plan: plan.name,
      amount: session.amount_total,
    },
  });

  console.log(`Subscription created for user ${userId}, plan: ${plan.name}`);
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Get price ID from subscription
  const priceId = subscription.items.data[0]?.price.id;

  // Get plan
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('*')
    .or(`stripe_price_id_monthly.eq.${priceId},stripe_price_id_yearly.eq.${priceId}`)
    .single();

  // Map Stripe status to our status
  const statusMap: Record<string, string> = {
    active: 'active',
    past_due: 'past_due',
    canceled: 'canceled',
    unpaid: 'unpaid',
    incomplete: 'incomplete',
    incomplete_expired: 'canceled',
    trialing: 'trialing',
    paused: 'paused',
  };

  await supabase
    .from('subscriptions')
    .update({
      plan_id: plan?.id,
      status: statusMap[subscription.status] || subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('stripe_subscription_id', subscription.id);

  console.log(`Subscription updated for user ${profile.id}: ${subscription.status}`);
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  // Find user
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  // Downgrade user role
  await supabase
    .from('profiles')
    .update({ role: 'user' })
    .eq('id', profile.id);

  // Log activity
  await supabase.from('activity_logs').insert({
    user_id: profile.id,
    action: 'subscription_canceled',
    resource_type: 'subscription',
  });

  console.log(`Subscription canceled for user ${profile.id}`);
}

async function handleInvoicePaid(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  // Find user
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) return;

  // Reset monthly usage on renewal
  await supabase
    .from('subscriptions')
    .update({
      analyses_used: 0,
      status: 'active',
    })
    .eq('stripe_subscription_id', subscriptionId);

  // Reset profile usage
  await supabase
    .from('profiles')
    .update({ analyses_this_month: 0 })
    .eq('id', profile.id);

  // Record payment
  await supabase.from('payments').insert({
    user_id: profile.id,
    stripe_payment_intent_id: invoice.payment_intent as string,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    description: `Subscription payment - ${invoice.lines.data[0]?.description || 'Monthly'}`,
  });

  console.log(`Invoice paid for user ${profile.id}: $${(invoice.amount_paid / 100).toFixed(2)}`);
}

async function handlePaymentFailed(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  // Find user
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) return;

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId);

  // Create notification
  await supabase.from('notifications').insert({
    user_id: profile.id,
    type: 'payment_failed',
    title: 'Payment Failed',
    message: 'Your subscription payment failed. Please update your payment method to avoid service interruption.',
    priority: 'high',
    action_url: '/dashboard/settings?tab=billing',
  });

  // Log activity
  await supabase.from('activity_logs').insert({
    user_id: profile.id,
    action: 'payment_failed',
    resource_type: 'payment',
    details: {
      invoice_id: invoice.id,
      amount: invoice.amount_due,
    },
  });

  console.log(`Payment failed for user ${profile.id}`);
}
