/**
 * MyAutoWhiz.com - Database Types
 * 
 * TypeScript types generated from Supabase schema
 * These types provide full type safety for database operations
 * 
 * To regenerate after schema changes:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          display_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          phone_verified: boolean;
          role: UserRole;
          is_verified: boolean;
          is_active: boolean;
          preferences: UserPreferences;
          country: string;
          state: string | null;
          city: string | null;
          zip_code: string | null;
          total_analyses: number;
          analyses_this_month: number;
          last_analysis_at: string | null;
          referral_code: string;
          referred_by: string | null;
          referral_count: number;
          metadata: Json;
          created_at: string;
          updated_at: string;
          last_seen_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          phone_verified?: boolean;
          role?: UserRole;
          is_verified?: boolean;
          is_active?: boolean;
          preferences?: UserPreferences;
          country?: string;
          state?: string | null;
          city?: string | null;
          zip_code?: string | null;
          total_analyses?: number;
          analyses_this_month?: number;
          last_analysis_at?: string | null;
          referral_code?: string;
          referred_by?: string | null;
          referral_count?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          last_seen_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          phone_verified?: boolean;
          role?: UserRole;
          is_verified?: boolean;
          is_active?: boolean;
          preferences?: UserPreferences;
          country?: string;
          state?: string | null;
          city?: string | null;
          zip_code?: string | null;
          total_analyses?: number;
          analyses_this_month?: number;
          last_analysis_at?: string | null;
          referral_code?: string;
          referred_by?: string | null;
          referral_count?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          last_seen_at?: string;
          deleted_at?: string | null;
        };
      };
      user_identities: {
        Row: {
          id: string;
          user_id: string;
          provider: AuthProvider;
          provider_id: string;
          provider_email: string | null;
          provider_data: Json;
          access_token_encrypted: string | null;
          refresh_token_encrypted: string | null;
          token_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: AuthProvider;
          provider_id: string;
          provider_email?: string | null;
          provider_data?: Json;
          access_token_encrypted?: string | null;
          refresh_token_encrypted?: string | null;
          token_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: AuthProvider;
          provider_id?: string;
          provider_email?: string | null;
          provider_data?: Json;
          access_token_encrypted?: string | null;
          refresh_token_encrypted?: string | null;
          token_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscription_plans: {
        Row: {
          id: string;
          stripe_product_id: string | null;
          stripe_price_id: string | null;
          name: string;
          tier: PlanTier;
          description: string | null;
          price_monthly: number;
          price_yearly: number | null;
          currency: string;
          analyses_per_month: number;
          history_reports_per_month: number | null;
          audio_analyses_per_month: number | null;
          visual_analyses_per_month: number | null;
          storage_gb: number;
          features: PlanFeatures;
          is_popular: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          stripe_product_id?: string | null;
          stripe_price_id?: string | null;
          name: string;
          tier: PlanTier;
          description?: string | null;
          price_monthly: number;
          price_yearly?: number | null;
          currency?: string;
          analyses_per_month: number;
          history_reports_per_month?: number | null;
          audio_analyses_per_month?: number | null;
          visual_analyses_per_month?: number | null;
          storage_gb?: number;
          features?: PlanFeatures;
          is_popular?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          stripe_product_id?: string | null;
          stripe_price_id?: string | null;
          name?: string;
          tier?: PlanTier;
          description?: string | null;
          price_monthly?: number;
          price_yearly?: number | null;
          currency?: string;
          analyses_per_month?: number;
          history_reports_per_month?: number | null;
          audio_analyses_per_month?: number | null;
          visual_analyses_per_month?: number | null;
          storage_gb?: number;
          features?: PlanFeatures;
          is_popular?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          status: SubscriptionStatus;
          current_period_start: string | null;
          current_period_end: string | null;
          trial_start: string | null;
          trial_end: string | null;
          canceled_at: string | null;
          cancel_at_period_end: boolean;
          analyses_used: number;
          history_reports_used: number;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status?: SubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
          canceled_at?: string | null;
          cancel_at_period_end?: boolean;
          analyses_used?: number;
          history_reports_used?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status?: SubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
          canceled_at?: string | null;
          cancel_at_period_end?: boolean;
          analyses_used?: number;
          history_reports_used?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          vin: string;
          year: number | null;
          make: string | null;
          model: string | null;
          trim: string | null;
          body_style: string | null;
          engine: string | null;
          engine_size: string | null;
          cylinders: number | null;
          horsepower: number | null;
          torque: number | null;
          transmission: string | null;
          drivetrain: string | null;
          fuel_type: string | null;
          doors: number | null;
          seating_capacity: number | null;
          curb_weight: number | null;
          gross_weight: number | null;
          mpg_city: number | null;
          mpg_highway: number | null;
          mpg_combined: number | null;
          fuel_capacity: number | null;
          msrp: number | null;
          made_in_country: string | null;
          made_in_city: string | null;
          plant_code: string | null;
          decoded_data: Json;
          last_decoded_at: string;
          decode_source: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vin: string;
          year?: number | null;
          make?: string | null;
          model?: string | null;
          trim?: string | null;
          body_style?: string | null;
          engine?: string | null;
          engine_size?: string | null;
          cylinders?: number | null;
          horsepower?: number | null;
          torque?: number | null;
          transmission?: string | null;
          drivetrain?: string | null;
          fuel_type?: string | null;
          doors?: number | null;
          seating_capacity?: number | null;
          curb_weight?: number | null;
          gross_weight?: number | null;
          mpg_city?: number | null;
          mpg_highway?: number | null;
          mpg_combined?: number | null;
          fuel_capacity?: number | null;
          msrp?: number | null;
          made_in_country?: string | null;
          made_in_city?: string | null;
          plant_code?: string | null;
          decoded_data?: Json;
          last_decoded_at?: string;
          decode_source?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vin?: string;
          year?: number | null;
          make?: string | null;
          model?: string | null;
          trim?: string | null;
          body_style?: string | null;
          engine?: string | null;
          engine_size?: string | null;
          cylinders?: number | null;
          horsepower?: number | null;
          torque?: number | null;
          transmission?: string | null;
          drivetrain?: string | null;
          fuel_type?: string | null;
          doors?: number | null;
          seating_capacity?: number | null;
          curb_weight?: number | null;
          gross_weight?: number | null;
          mpg_city?: number | null;
          mpg_highway?: number | null;
          mpg_combined?: number | null;
          fuel_capacity?: number | null;
          msrp?: number | null;
          made_in_country?: string | null;
          made_in_city?: string | null;
          plant_code?: string | null;
          decoded_data?: Json;
          last_decoded_at?: string;
          decode_source?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      analyses: {
        Row: {
          id: string;
          user_id: string;
          vehicle_id: string | null;
          vin: string;
          status: AnalysisStatus;
          progress: number;
          overall_score: number | null;
          visual_score: number | null;
          audio_score: number | null;
          history_score: number | null;
          mechanical_score: number | null;
          safety_score: number | null;
          estimated_market_value: number | null;
          total_repair_cost: number | null;
          confidence_level: number | null;
          buy_recommendation: string | null;
          negotiation_points: string[] | null;
          summary: string | null;
          mileage: number | null;
          asking_price: number | null;
          processing_started_at: string | null;
          processing_completed_at: string | null;
          processing_duration_ms: number | null;
          error_message: string | null;
          api_costs: Json;
          visual_analysis_result: Json | null;
          audio_analysis_result: Json | null;
          history_report_result: Json | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          vehicle_id?: string | null;
          vin: string;
          status?: AnalysisStatus;
          progress?: number;
          overall_score?: number | null;
          visual_score?: number | null;
          audio_score?: number | null;
          history_score?: number | null;
          mechanical_score?: number | null;
          safety_score?: number | null;
          estimated_market_value?: number | null;
          total_repair_cost?: number | null;
          confidence_level?: number | null;
          buy_recommendation?: string | null;
          negotiation_points?: string[] | null;
          summary?: string | null;
          mileage?: number | null;
          asking_price?: number | null;
          processing_started_at?: string | null;
          processing_completed_at?: string | null;
          processing_duration_ms?: number | null;
          error_message?: string | null;
          api_costs?: Json;
          visual_analysis_result?: Json | null;
          audio_analysis_result?: Json | null;
          history_report_result?: Json | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          vehicle_id?: string | null;
          vin?: string;
          status?: AnalysisStatus;
          progress?: number;
          overall_score?: number | null;
          visual_score?: number | null;
          audio_score?: number | null;
          history_score?: number | null;
          mechanical_score?: number | null;
          safety_score?: number | null;
          estimated_market_value?: number | null;
          total_repair_cost?: number | null;
          confidence_level?: number | null;
          buy_recommendation?: string | null;
          negotiation_points?: string[] | null;
          summary?: string | null;
          mileage?: number | null;
          asking_price?: number | null;
          processing_started_at?: string | null;
          processing_completed_at?: string | null;
          processing_duration_ms?: number | null;
          error_message?: string | null;
          api_costs?: Json;
          visual_analysis_result?: Json | null;
          audio_analysis_result?: Json | null;
          history_report_result?: Json | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      analysis_issues: {
        Row: {
          id: string;
          analysis_id: string;
          category: IssueCategory;
          severity: IssueSeverity;
          title: string;
          description: string | null;
          location: string | null;
          component: string | null;
          estimated_repair_cost: number | null;
          repair_cost_low: number | null;
          repair_cost_high: number | null;
          urgency: string | null;
          bounding_box: Json | null;
          image_index: number | null;
          frequency: number | null;
          timestamp_start: number | null;
          timestamp_end: number | null;
          confidence: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          analysis_id: string;
          category: IssueCategory;
          severity: IssueSeverity;
          title: string;
          description?: string | null;
          location?: string | null;
          component?: string | null;
          estimated_repair_cost?: number | null;
          repair_cost_low?: number | null;
          repair_cost_high?: number | null;
          urgency?: string | null;
          bounding_box?: Json | null;
          image_index?: number | null;
          frequency?: number | null;
          timestamp_start?: number | null;
          timestamp_end?: number | null;
          confidence?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          analysis_id?: string;
          category?: IssueCategory;
          severity?: IssueSeverity;
          title?: string;
          description?: string | null;
          location?: string | null;
          component?: string | null;
          estimated_repair_cost?: number | null;
          repair_cost_low?: number | null;
          repair_cost_high?: number | null;
          urgency?: string | null;
          bounding_box?: Json | null;
          image_index?: number | null;
          frequency?: number | null;
          timestamp_start?: number | null;
          timestamp_end?: number | null;
          confidence?: number | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          message: string | null;
          analysis_id: string | null;
          vehicle_id: string | null;
          action_url: string | null;
          action_text: string | null;
          is_read: boolean;
          read_at: string | null;
          email_sent: boolean;
          push_sent: boolean;
          sms_sent: boolean;
          metadata: Json;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          title: string;
          message?: string | null;
          analysis_id?: string | null;
          vehicle_id?: string | null;
          action_url?: string | null;
          action_text?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          email_sent?: boolean;
          push_sent?: boolean;
          sms_sent?: boolean;
          metadata?: Json;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: NotificationType;
          title?: string;
          message?: string | null;
          analysis_id?: string | null;
          vehicle_id?: string | null;
          action_url?: string | null;
          action_text?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          email_sent?: boolean;
          push_sent?: boolean;
          sms_sent?: boolean;
          metadata?: Json;
          created_at?: string;
          expires_at?: string | null;
        };
      };
      saved_vehicles: {
        Row: {
          id: string;
          user_id: string;
          vin: string;
          vehicle_id: string | null;
          nickname: string | null;
          notes: string | null;
          listing_url: string | null;
          listing_price: number | null;
          listing_source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vin: string;
          vehicle_id?: string | null;
          nickname?: string | null;
          notes?: string | null;
          listing_url?: string | null;
          listing_price?: number | null;
          listing_source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vin?: string;
          vehicle_id?: string | null;
          nickname?: string | null;
          notes?: string | null;
          listing_url?: string | null;
          listing_price?: number | null;
          listing_source?: string | null;
          created_at?: string;
        };
      };
    };
    Enums: {
      user_role: UserRole;
      subscription_status: SubscriptionStatus;
      plan_tier: PlanTier;
      analysis_status: AnalysisStatus;
      issue_severity: IssueSeverity;
      issue_category: IssueCategory;
      title_status: TitleStatus;
      auth_provider: AuthProvider;
      notification_type: NotificationType;
      payment_status: PaymentStatus;
    };
  };
};

// =============================================================================
// ENUM TYPES
// =============================================================================

export type UserRole = 'user' | 'pro' | 'enterprise' | 'admin' | 'super_admin';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused';
export type PlanTier = 'free' | 'starter' | 'pro' | 'enterprise';
export type AnalysisStatus = 'pending' | 'processing' | 'visual_analysis' | 'audio_analysis' | 'history_check' | 'generating_report' | 'completed' | 'failed';
export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IssueCategory = 'visual' | 'audio' | 'history' | 'mechanical' | 'electrical' | 'safety';
export type TitleStatus = 'clean' | 'salvage' | 'rebuilt' | 'flood' | 'lemon' | 'junk' | 'theft_recovery' | 'unknown';
export type AuthProvider = 'email' | 'google' | 'apple' | 'facebook' | 'github';
export type NotificationType = 'analysis_complete' | 'analysis_failed' | 'subscription' | 'system' | 'marketing' | 'recall_alert';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded' | 'disputed';

// =============================================================================
// JSONB TYPES
// =============================================================================

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    share_reports: boolean;
    analytics_tracking: boolean;
  };
}

export interface PlanFeatures {
  visual_analysis: boolean;
  audio_analysis: boolean;
  history_report: boolean;
  export_pdf: boolean;
  api_access: boolean;
  priority_support: boolean;
  white_label: boolean;
  bulk_upload: boolean;
  team_members: number;
}

// =============================================================================
// COMPOSITE TYPES FOR QUERIES
// =============================================================================

export type ProfileWithSubscription = Database['public']['Tables']['profiles']['Row'] & {
  subscription: (Database['public']['Tables']['subscriptions']['Row'] & {
    plan: Database['public']['Tables']['subscription_plans']['Row'];
  }) | null;
};

export type AnalysisWithIssues = Database['public']['Tables']['analyses']['Row'] & {
  issues: Database['public']['Tables']['analysis_issues']['Row'][];
  vehicle: Database['public']['Tables']['vehicles']['Row'] | null;
};

export type AnalysisListItem = Pick<
  Database['public']['Tables']['analyses']['Row'],
  'id' | 'vin' | 'status' | 'overall_score' | 'created_at' | 'updated_at'
> & {
  vehicle: Pick<
    Database['public']['Tables']['vehicles']['Row'],
    'year' | 'make' | 'model'
  > | null;
};

// =============================================================================
// HELPER TYPES
// =============================================================================

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
