-- ============================================================================
-- MyAutoWhiz.com - Enterprise-Grade Supabase Database Schema
-- Version: 1.0.0
-- Description: Complete database schema for AI-powered vehicle analysis platform
-- Supports: OAuth, user profiles, vehicle analyses, subscriptions, and more
-- Scalable to thousands of users with proper indexing and RLS policies
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- User roles for RBAC
CREATE TYPE user_role AS ENUM ('user', 'pro', 'enterprise', 'admin', 'super_admin');

-- Subscription status
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');

-- Subscription plan tiers
CREATE TYPE plan_tier AS ENUM ('free', 'starter', 'pro', 'enterprise');

-- Analysis status tracking
CREATE TYPE analysis_status AS ENUM ('pending', 'processing', 'visual_analysis', 'audio_analysis', 'history_check', 'generating_report', 'completed', 'failed');

-- Issue severity levels
CREATE TYPE issue_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Issue categories
CREATE TYPE issue_category AS ENUM ('visual', 'audio', 'history', 'mechanical', 'electrical', 'safety');

-- Vehicle title status
CREATE TYPE title_status AS ENUM ('clean', 'salvage', 'rebuilt', 'flood', 'lemon', 'junk', 'theft_recovery', 'unknown');

-- OAuth providers
CREATE TYPE auth_provider AS ENUM ('email', 'google', 'apple', 'facebook', 'github');

-- Notification types
CREATE TYPE notification_type AS ENUM ('analysis_complete', 'analysis_failed', 'subscription', 'system', 'marketing', 'recall_alert');

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded', 'disputed');

-- ============================================================================
-- CORE USER TABLES
-- ============================================================================

-- Extended user profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Role and permissions
    role user_role DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Preferences stored as JSONB for flexibility
    preferences JSONB DEFAULT '{
        "theme": "dark",
        "language": "en",
        "timezone": "America/Chicago",
        "notifications": {
            "email": true,
            "push": true,
            "sms": false,
            "marketing": false
        },
        "privacy": {
            "share_reports": false,
            "analytics_tracking": true
        }
    }'::jsonb,
    
    -- Location for localized pricing/services
    country TEXT DEFAULT 'US',
    state TEXT,
    city TEXT,
    zip_code TEXT,
    
    -- Usage tracking
    total_analyses INTEGER DEFAULT 0,
    analyses_this_month INTEGER DEFAULT 0,
    last_analysis_at TIMESTAMPTZ,
    
    -- Referral system
    referral_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
    referred_by UUID REFERENCES public.profiles(id),
    referral_count INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete
);

-- OAuth identity links (for multiple auth providers)
CREATE TABLE public.user_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider auth_provider NOT NULL,
    provider_id TEXT NOT NULL,
    provider_email TEXT,
    provider_data JSONB DEFAULT '{}'::jsonb,
    access_token_encrypted TEXT, -- Encrypted OAuth tokens
    refresh_token_encrypted TEXT,
    token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(provider, provider_id),
    UNIQUE(user_id, provider)
);

-- User sessions for device management
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_id TEXT,
    device_type TEXT, -- 'mobile', 'desktop', 'tablet'
    device_name TEXT,
    browser TEXT,
    os TEXT,
    ip_address INET,
    location_country TEXT,
    location_city TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- ============================================================================
-- SUBSCRIPTION & BILLING TABLES
-- ============================================================================

-- Subscription plans
CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stripe_product_id TEXT UNIQUE,
    stripe_price_id TEXT UNIQUE,
    name TEXT NOT NULL,
    tier plan_tier NOT NULL,
    description TEXT,
    
    -- Pricing
    price_monthly DECIMAL(10, 2) NOT NULL,
    price_yearly DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    
    -- Limits
    analyses_per_month INTEGER NOT NULL,
    history_reports_per_month INTEGER,
    audio_analyses_per_month INTEGER,
    visual_analyses_per_month INTEGER,
    storage_gb DECIMAL(5, 2) DEFAULT 1.0,
    
    -- Features as JSONB for flexibility
    features JSONB DEFAULT '{
        "visual_analysis": true,
        "audio_analysis": false,
        "history_report": false,
        "export_pdf": false,
        "api_access": false,
        "priority_support": false,
        "white_label": false,
        "bulk_upload": false,
        "team_members": 1
    }'::jsonb,
    
    -- Display
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
    
    -- Stripe integration
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    
    -- Status
    status subscription_status DEFAULT 'trialing',
    
    -- Dates
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    
    -- Usage this period
    analyses_used INTEGER DEFAULT 0,
    history_reports_used INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment history
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id),
    
    -- Stripe
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_invoice_id TEXT,
    
    -- Amount
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status payment_status DEFAULT 'pending',
    
    -- Details
    description TEXT,
    receipt_url TEXT,
    invoice_pdf_url TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage credits (for pay-as-you-go or bonus credits)
CREATE TABLE public.usage_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    credit_type TEXT NOT NULL, -- 'analysis', 'history_report', 'bonus', 'referral'
    amount INTEGER NOT NULL,
    remaining INTEGER NOT NULL,
    source TEXT, -- 'purchase', 'referral', 'promotion', 'admin'
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- VEHICLE & ANALYSIS TABLES
-- ============================================================================

-- Cached vehicle data (from VIN decoding)
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vin TEXT UNIQUE NOT NULL,
    
    -- Basic info
    year INTEGER,
    make TEXT,
    model TEXT,
    trim TEXT,
    body_style TEXT,
    
    -- Specifications
    engine TEXT,
    engine_size TEXT,
    cylinders INTEGER,
    horsepower INTEGER,
    torque INTEGER,
    transmission TEXT,
    drivetrain TEXT,
    fuel_type TEXT,
    
    -- Dimensions
    doors INTEGER,
    seating_capacity INTEGER,
    curb_weight INTEGER,
    gross_weight INTEGER,
    
    -- Fuel economy
    mpg_city INTEGER,
    mpg_highway INTEGER,
    mpg_combined INTEGER,
    fuel_capacity DECIMAL(5, 2),
    
    -- Pricing
    msrp DECIMAL(10, 2),
    
    -- Manufacturing
    made_in_country TEXT,
    made_in_city TEXT,
    plant_code TEXT,
    
    -- Full decoded data from API
    decoded_data JSONB DEFAULT '{}'::jsonb,
    
    -- Cache management
    last_decoded_at TIMESTAMPTZ DEFAULT NOW(),
    decode_source TEXT DEFAULT 'nhtsa', -- 'nhtsa', 'vinaudit', 'clearvin'
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Main analysis records
CREATE TABLE public.analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id),
    vin TEXT NOT NULL,
    
    -- Status tracking
    status analysis_status DEFAULT 'pending',
    progress INTEGER DEFAULT 0, -- 0-100
    
    -- Scores (0-100)
    overall_score INTEGER,
    visual_score INTEGER,
    audio_score INTEGER,
    history_score INTEGER,
    mechanical_score INTEGER,
    safety_score INTEGER,
    
    -- Calculated values
    estimated_market_value DECIMAL(10, 2),
    total_repair_cost DECIMAL(10, 2),
    confidence_level DECIMAL(3, 2), -- 0.00 to 1.00
    
    -- Recommendations
    buy_recommendation TEXT, -- 'recommended', 'conditional', 'not_recommended'
    negotiation_points TEXT[],
    summary TEXT,
    
    -- Input data references
    mileage INTEGER,
    asking_price DECIMAL(10, 2),
    
    -- Processing metadata
    processing_started_at TIMESTAMPTZ,
    processing_completed_at TIMESTAMPTZ,
    processing_duration_ms INTEGER,
    error_message TEXT,
    
    -- API costs tracking
    api_costs JSONB DEFAULT '{}'::jsonb,
    
    -- Full results stored as JSONB
    visual_analysis_result JSONB,
    audio_analysis_result JSONB,
    history_report_result JSONB,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete
);

-- Analysis issues detected
CREATE TABLE public.analysis_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    
    category issue_category NOT NULL,
    severity issue_severity NOT NULL,
    
    title TEXT NOT NULL,
    description TEXT,
    location TEXT, -- Where on vehicle
    component TEXT, -- Specific component affected
    
    -- Cost estimates
    estimated_repair_cost DECIMAL(10, 2),
    repair_cost_low DECIMAL(10, 2),
    repair_cost_high DECIMAL(10, 2),
    
    -- Urgency
    urgency TEXT, -- 'immediate', 'soon', 'monitor', 'cosmetic'
    
    -- For visual issues
    bounding_box JSONB, -- {x, y, width, height}
    image_index INTEGER,
    
    -- For audio issues
    frequency DECIMAL(10, 2),
    timestamp_start DECIMAL(10, 2),
    timestamp_end DECIMAL(10, 2),
    
    -- AI confidence
    confidence DECIMAL(3, 2),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uploaded files (images and audio)
CREATE TABLE public.analysis_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    file_type TEXT NOT NULL, -- 'image', 'audio'
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    
    -- Storage
    storage_bucket TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    
    -- Image specific
    width INTEGER,
    height INTEGER,
    
    -- Audio specific
    duration_seconds DECIMAL(10, 2),
    sample_rate INTEGER,
    
    -- Processing
    is_processed BOOLEAN DEFAULT FALSE,
    processing_result JSONB,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle history reports (cached from third-party APIs)
CREATE TABLE public.vehicle_history_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE SET NULL,
    vin TEXT NOT NULL,
    
    -- Source tracking
    source TEXT NOT NULL, -- 'vinaudit', 'clearvin', 'nmvtis', 'carfax'
    report_id TEXT, -- External report ID
    
    -- Title information
    title_status title_status DEFAULT 'unknown',
    title_state TEXT,
    title_issue_date DATE,
    has_lien BOOLEAN,
    lien_holder TEXT,
    
    -- Ownership
    owner_count INTEGER,
    ownership_history JSONB DEFAULT '[]'::jsonb,
    
    -- Accidents
    accident_count INTEGER DEFAULT 0,
    accident_history JSONB DEFAULT '[]'::jsonb,
    
    -- Service records
    service_record_count INTEGER DEFAULT 0,
    service_history JSONB DEFAULT '[]'::jsonb,
    
    -- Odometer
    odometer_readings JSONB DEFAULT '[]'::jsonb,
    odometer_rollback_detected BOOLEAN DEFAULT FALSE,
    
    -- Recalls
    open_recalls INTEGER DEFAULT 0,
    recall_history JSONB DEFAULT '[]'::jsonb,
    
    -- Salvage/Junk
    salvage_records JSONB DEFAULT '[]'::jsonb,
    junk_records JSONB DEFAULT '[]'::jsonb,
    
    -- Theft
    theft_records JSONB DEFAULT '[]'::jsonb,
    
    -- Full raw response
    raw_response JSONB,
    
    -- Pricing
    api_cost DECIMAL(10, 2),
    
    -- Cache management
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RECALL & SAFETY TABLES
-- ============================================================================

-- Vehicle recalls (cached from NHTSA)
CREATE TABLE public.vehicle_recalls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vin TEXT,
    
    -- NHTSA campaign info
    nhtsa_campaign_number TEXT UNIQUE,
    manufacturer TEXT,
    make TEXT,
    model TEXT,
    model_year INTEGER,
    
    -- Recall details
    component TEXT,
    summary TEXT,
    consequence TEXT,
    remedy TEXT,
    notes TEXT,
    
    -- Dates
    report_received_date DATE,
    recall_date DATE,
    
    -- Status flags
    is_incomplete BOOLEAN DEFAULT TRUE,
    park_it BOOLEAN DEFAULT FALSE,
    park_outside BOOLEAN DEFAULT FALSE,
    do_not_drive BOOLEAN DEFAULT FALSE,
    
    -- Raw data
    raw_data JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safety ratings (from NHTSA NCAP)
CREATE TABLE public.safety_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES public.vehicles(id),
    
    -- NHTSA vehicle ID
    nhtsa_vehicle_id INTEGER,
    
    -- Overall
    overall_rating INTEGER, -- 1-5 stars
    
    -- Crash test ratings
    frontal_crash_rating INTEGER,
    side_crash_rating INTEGER,
    rollover_rating INTEGER,
    
    -- Sub-ratings
    frontal_driver_rating INTEGER,
    frontal_passenger_rating INTEGER,
    side_driver_rating INTEGER,
    side_passenger_rating INTEGER,
    side_pole_rating INTEGER,
    
    -- Rollover details
    rollover_risk DECIMAL(5, 2),
    dynamic_tip_result TEXT,
    
    -- Raw data
    raw_data JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER ACTIVITY & NOTIFICATIONS
-- ============================================================================

-- Saved/favorite vehicles
CREATE TABLE public.saved_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vin TEXT NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id),
    
    nickname TEXT,
    notes TEXT,
    
    -- Listing info if from external source
    listing_url TEXT,
    listing_price DECIMAL(10, 2),
    listing_source TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, vin)
);

-- User notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    
    -- Related entities
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    
    -- Action
    action_url TEXT,
    action_text TEXT,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Delivery
    email_sent BOOLEAN DEFAULT FALSE,
    push_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Activity/audit log
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    
    -- Details
    details JSONB DEFAULT '{}'::jsonb,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- API KEYS & INTEGRATIONS
-- ============================================================================

-- API keys for enterprise users
CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL, -- Hashed API key
    key_prefix TEXT NOT NULL, -- First 8 chars for identification
    
    -- Permissions
    scopes TEXT[] DEFAULT ARRAY['read'],
    
    -- Limits
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_day INTEGER DEFAULT 1000,
    
    -- Usage
    last_used_at TIMESTAMPTZ,
    total_requests INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- Webhook endpoints for enterprise users
CREATE TABLE public.webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    secret_hash TEXT NOT NULL,
    
    -- Events to trigger
    events TEXT[] DEFAULT ARRAY['analysis.completed'],
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Health
    last_triggered_at TIMESTAMPTZ,
    last_success_at TIMESTAMPTZ,
    last_failure_at TIMESTAMPTZ,
    failure_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TEAM/ORGANIZATION SUPPORT (Enterprise)
-- ============================================================================

-- Organizations for enterprise accounts
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    
    -- Contact
    email TEXT,
    phone TEXT,
    website TEXT,
    
    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'US',
    
    -- Branding
    logo_url TEXT,
    primary_color TEXT,
    
    -- Settings
    settings JSONB DEFAULT '{}'::jsonb,
    
    -- Billing
    stripe_customer_id TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization members
CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member', 'viewer'
    
    invited_by UUID REFERENCES public.profiles(id),
    invited_at TIMESTAMPTZ,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(organization_id, user_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profile indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX idx_profiles_last_seen ON public.profiles(last_seen_at);

-- Vehicle indexes
CREATE INDEX idx_vehicles_vin ON public.vehicles(vin);
CREATE INDEX idx_vehicles_year_make_model ON public.vehicles(year, make, model);
CREATE INDEX idx_vehicles_make ON public.vehicles(make);

-- Analysis indexes
CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_analyses_vin ON public.analyses(vin);
CREATE INDEX idx_analyses_status ON public.analyses(status);
CREATE INDEX idx_analyses_created_at ON public.analyses(created_at);
CREATE INDEX idx_analyses_user_status ON public.analyses(user_id, status);

-- Analysis issues indexes
CREATE INDEX idx_analysis_issues_analysis_id ON public.analysis_issues(analysis_id);
CREATE INDEX idx_analysis_issues_severity ON public.analysis_issues(severity);

-- History report indexes
CREATE INDEX idx_vehicle_history_vin ON public.vehicle_history_reports(vin);
CREATE INDEX idx_vehicle_history_fetched ON public.vehicle_history_reports(fetched_at);

-- Subscription indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON public.notifications(created_at);

-- Activity log indexes
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX idx_activity_logs_created ON public.activity_logs(created_at);

-- Full text search index for vehicles
CREATE INDEX idx_vehicles_fts ON public.vehicles 
USING gin(to_tsvector('english', coalesce(make, '') || ' ' || coalesce(model, '') || ' ' || coalesce(trim, '')));

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_history_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_recalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles" ON public.profiles
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- User identities policies
CREATE POLICY "Users can view own identities" ON public.user_identities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own identities" ON public.user_identities
    FOR ALL USING (auth.uid() = user_id);

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON public.user_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Subscription policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Subscription plans are readable by all authenticated users
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
    FOR SELECT USING (is_active = TRUE);

-- Payments policies
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

-- Usage credits policies
CREATE POLICY "Users can view own credits" ON public.usage_credits
    FOR SELECT USING (auth.uid() = user_id);

-- Vehicles are readable by all authenticated users (cached data)
CREATE POLICY "Authenticated users can view vehicles" ON public.vehicles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can manage vehicles" ON public.vehicles
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Analysis policies
CREATE POLICY "Users can view own analyses" ON public.analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analyses" ON public.analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses" ON public.analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses" ON public.analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Analysis issues (inherit from analysis ownership)
CREATE POLICY "Users can view issues for own analyses" ON public.analysis_issues
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.analyses 
            WHERE analyses.id = analysis_issues.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

-- Analysis files policies
CREATE POLICY "Users can view own analysis files" ON public.analysis_files
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own analysis files" ON public.analysis_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analysis files" ON public.analysis_files
    FOR DELETE USING (auth.uid() = user_id);

-- History reports (tied to analysis ownership)
CREATE POLICY "Users can view history for own analyses" ON public.vehicle_history_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.analyses 
            WHERE analyses.id = vehicle_history_reports.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

-- Recalls are public data
CREATE POLICY "Anyone can view recalls" ON public.vehicle_recalls
    FOR SELECT USING (TRUE);

-- Safety ratings are public data
CREATE POLICY "Anyone can view safety ratings" ON public.safety_ratings
    FOR SELECT USING (TRUE);

-- Saved vehicles policies
CREATE POLICY "Users can manage own saved vehicles" ON public.saved_vehicles
    FOR ALL USING (auth.uid() = user_id);

-- Notification policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Users can view own activity" ON public.activity_logs
    FOR SELECT USING (auth.uid() = user_id);

-- API keys policies
CREATE POLICY "Users can manage own API keys" ON public.api_keys
    FOR ALL USING (auth.uid() = user_id);

-- Webhooks policies
CREATE POLICY "Users can manage own webhooks" ON public.webhooks
    FOR ALL USING (auth.uid() = user_id);

-- Organization policies
CREATE POLICY "Org members can view org" ON public.organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_members.organization_id = organizations.id
            AND organization_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Org admins can update org" ON public.organizations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_members.organization_id = organizations.id
            AND organization_members.user_id = auth.uid()
            AND organization_members.role IN ('owner', 'admin')
        )
    );

-- Organization members policies
CREATE POLICY "Org members can view members" ON public.organization_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.organization_id = organization_members.organization_id
            AND om.user_id = auth.uid()
        )
    );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analyses_updated_at BEFORE UPDATE ON public.analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to increment analysis count
CREATE OR REPLACE FUNCTION increment_analysis_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE public.profiles
        SET 
            total_analyses = total_analyses + 1,
            analyses_this_month = analyses_this_month + 1,
            last_analysis_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_analysis_completed
    AFTER UPDATE ON public.analyses
    FOR EACH ROW EXECUTE FUNCTION increment_analysis_count();

-- Function to reset monthly analysis count (run via cron)
CREATE OR REPLACE FUNCTION reset_monthly_analysis_counts()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles SET analyses_this_month = 0;
    UPDATE public.subscriptions SET analyses_used = 0, history_reports_used = 0
    WHERE status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type notification_type,
    p_title TEXT,
    p_message TEXT DEFAULT NULL,
    p_analysis_id UUID DEFAULT NULL,
    p_action_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, type, title, message, analysis_id, action_url)
    VALUES (p_user_id, p_type, p_title, p_message, p_analysis_id, p_action_url)
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
    p_user_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SEED DATA - Subscription Plans
-- ============================================================================

INSERT INTO public.subscription_plans (name, tier, description, price_monthly, price_yearly, analyses_per_month, history_reports_per_month, audio_analyses_per_month, visual_analyses_per_month, features, is_popular, sort_order) VALUES
(
    'Free',
    'free',
    'Basic vehicle checks for casual buyers',
    0.00,
    0.00,
    2,
    0,
    0,
    2,
    '{"visual_analysis": true, "audio_analysis": false, "history_report": false, "export_pdf": false, "api_access": false, "priority_support": false, "white_label": false, "bulk_upload": false, "team_members": 1}'::jsonb,
    FALSE,
    1
),
(
    'Starter',
    'starter',
    'For individual car buyers doing research',
    9.99,
    99.00,
    10,
    5,
    5,
    10,
    '{"visual_analysis": true, "audio_analysis": true, "history_report": true, "export_pdf": true, "api_access": false, "priority_support": false, "white_label": false, "bulk_upload": false, "team_members": 1}'::jsonb,
    FALSE,
    2
),
(
    'Pro',
    'pro',
    'For serious buyers and small dealers',
    29.99,
    299.00,
    50,
    25,
    25,
    50,
    '{"visual_analysis": true, "audio_analysis": true, "history_report": true, "export_pdf": true, "api_access": false, "priority_support": true, "white_label": false, "bulk_upload": true, "team_members": 3}'::jsonb,
    TRUE,
    3
),
(
    'Enterprise',
    'enterprise',
    'For dealerships and automotive businesses',
    99.99,
    999.00,
    500,
    250,
    250,
    500,
    '{"visual_analysis": true, "audio_analysis": true, "history_report": true, "export_pdf": true, "api_access": true, "priority_support": true, "white_label": true, "bulk_upload": true, "team_members": 25}'::jsonb,
    FALSE,
    4
);

-- ============================================================================
-- STORAGE BUCKETS (run in Supabase dashboard or via API)
-- ============================================================================

-- Create storage buckets for uploaded files
-- Note: Run these via Supabase dashboard or API
/*
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('analysis-images', 'analysis-images', false),
    ('analysis-audio', 'analysis-audio', false),
    ('user-avatars', 'user-avatars', true),
    ('reports', 'reports', false);

-- Storage policies
CREATE POLICY "Users can upload own analysis images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'analysis-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own analysis images"
ON storage.objects FOR SELECT
USING (bucket_id = 'analysis-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own analysis audio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'analysis-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own analysis audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'analysis-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view user avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
*/

-- ============================================================================
-- CRON JOBS (set up in Supabase dashboard under Database > Extensions > pg_cron)
-- ============================================================================

/*
-- Reset monthly counts on 1st of each month
SELECT cron.schedule('reset-monthly-counts', '0 0 1 * *', $$SELECT reset_monthly_analysis_counts()$$);

-- Clean up expired notifications
SELECT cron.schedule('cleanup-expired-notifications', '0 2 * * *', $$DELETE FROM public.notifications WHERE expires_at < NOW()$$);

-- Clean up old activity logs (keep 90 days)
SELECT cron.schedule('cleanup-old-activity-logs', '0 3 * * *', $$DELETE FROM public.activity_logs WHERE created_at < NOW() - INTERVAL '90 days'$$);

-- Clean up expired usage credits
SELECT cron.schedule('cleanup-expired-credits', '0 4 * * *', $$DELETE FROM public.usage_credits WHERE expires_at < NOW() AND remaining = 0$$);
*/

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
