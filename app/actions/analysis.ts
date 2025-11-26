/**
 * MyAutoWhiz.com - Vehicle Analysis Server Actions
 * 
 * Server-side actions for performing vehicle analyses using
 * real third-party APIs including NHTSA, VinAudit, ClearVin, etc.
 */

'use server';

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  decodeVinNHTSA,
  getRecallsNHTSA,
  getSafetyRatingsNHTSA,
  getVehicleHistoryVinAudit,
  getMarketValueVinAudit,
  getVehicleSpecsVinAudit,
  getClearVinReport,
  validateVIN,
  API_COSTS,
} from '@/lib/api/vehicle-apis';
import type { AnalysisStatus } from '@/types/database';

// =============================================================================
// TYPES
// =============================================================================

export interface ActionResult<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface CreateAnalysisInput {
  vin: string;
  mileage?: number;
  askingPrice?: number;
  includeHistory?: boolean;
  includeVisual?: boolean;
  includeAudio?: boolean;
}

export interface AnalysisProgress {
  status: AnalysisStatus;
  progress: number;
  currentStep: string;
  message: string;
}

// =============================================================================
// VIN DECODE ACTION (FREE - NHTSA)
// =============================================================================

/**
 * Decode a VIN using the free NHTSA API
 * This is always free and doesn't require authentication
 */
export async function decodeVin(vin: string): Promise<ActionResult> {
  try {
    // Validate VIN format
    const validation = validateVIN(vin);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Check if we have cached data
    const supabase = await createServerSupabaseClient();
    const { data: cachedVehicle } = await supabase
      .from('vehicles')
      .select('*')
      .eq('vin', vin.toUpperCase())
      .single();

    if (cachedVehicle) {
      return { success: true, data: cachedVehicle };
    }

    // Decode via NHTSA (FREE)
    const decoded = await decodeVinNHTSA(vin);

    if (!decoded.success) {
      return { 
        success: false, 
        error: decoded.errorText || 'Failed to decode VIN' 
      };
    }

    // Cache the vehicle data
    const adminSupabase = createAdminSupabaseClient();
    const { data: vehicle, error: insertError } = await adminSupabase
      .from('vehicles')
      .upsert({
        vin: vin.toUpperCase(),
        year: decoded.year,
        make: decoded.make,
        model: decoded.model,
        trim: decoded.trim,
        body_style: decoded.bodyClass,
        engine: `${decoded.engineDisplacement}L ${decoded.engineCylinders}-cyl`,
        engine_size: decoded.engineDisplacement,
        cylinders: decoded.engineCylinders,
        horsepower: decoded.engineHP,
        transmission: decoded.transmission,
        drivetrain: decoded.driveType,
        fuel_type: decoded.fuelType,
        doors: decoded.doors,
        made_in_country: decoded.plantCountry,
        made_in_city: decoded.plantCity,
        decoded_data: decoded.rawData,
        decode_source: 'nhtsa',
      } as Record<string, unknown>, { onConflict: 'vin' })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to cache vehicle:', insertError);
    }

    return { success: true, data: vehicle || decoded };
  } catch (err) {
    console.error('VIN decode error:', err);
    return { success: false, error: 'Failed to decode VIN' };
  }
}

// =============================================================================
// RECALLS ACTION (FREE - NHTSA)
// =============================================================================

/**
 * Get vehicle recalls from NHTSA (FREE)
 */
export async function getVehicleRecalls(
  make: string,
  model: string,
  year: number
): Promise<ActionResult> {
  try {
    const recalls = await getRecallsNHTSA(make, model, year);

    // Cache recalls
    const adminSupabase = createAdminSupabaseClient();
    
    for (const recall of recalls) {
      await adminSupabase
        .from('vehicle_recalls')
        .upsert({
          nhtsa_campaign_number: recall.nhtsaCampaignNumber,
          manufacturer: recall.manufacturer,
          make: recall.make,
          model: recall.model,
          model_year: recall.modelYear,
          component: recall.component,
          summary: recall.summary,
          consequence: recall.consequence,
          remedy: recall.remedy,
          notes: recall.notes,
          report_received_date: recall.reportReceivedDate,
          park_it: recall.parkIt,
          park_outside: recall.parkOutside,
          do_not_drive: recall.doNotDrive,
          raw_data: recall,
        } as Record<string, unknown>, { onConflict: 'nhtsa_campaign_number' });
    }

    return { success: true, data: recalls };
  } catch (err) {
    console.error('Recalls fetch error:', err);
    return { success: false, error: 'Failed to fetch recalls' };
  }
}

// =============================================================================
// SAFETY RATINGS ACTION (FREE - NHTSA)
// =============================================================================

/**
 * Get safety ratings from NHTSA NCAP (FREE)
 */
export async function getVehicleSafetyRatings(
  year: number,
  make: string,
  model: string
): Promise<ActionResult> {
  try {
    const ratings = await getSafetyRatingsNHTSA(year, make, model);
    return { success: true, data: ratings };
  } catch (err) {
    console.error('Safety ratings fetch error:', err);
    return { success: false, error: 'Failed to fetch safety ratings' };
  }
}

// =============================================================================
// VEHICLE HISTORY ACTION (PAID - VinAudit/ClearVin)
// =============================================================================

/**
 * Get vehicle history report (PAID API)
 * Uses VinAudit as primary, ClearVin as fallback
 */
export async function getVehicleHistory(vin: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check usage limits
    const canProceed = await checkHistoryReportLimit(user.id);
    if (!canProceed.allowed) {
      return { success: false, error: canProceed.reason };
    }

    // Check for cached recent report (within 24 hours)
    const { data: cachedReport } = await supabase
      .from('vehicle_history_reports')
      .select('*')
      .eq('vin', vin.toUpperCase())
      .gte('fetched_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single();

    if (cachedReport) {
      return { success: true, data: cachedReport };
    }

    // Try VinAudit first
    let historyReport = null;
    let source = '';
    let apiCost = 0;

    try {
      if (process.env.VINAUDIT_API_KEY) {
        historyReport = await getVehicleHistoryVinAudit(
          vin,
          process.env.VINAUDIT_API_KEY,
          process.env.VINAUDIT_API_USER!,
          process.env.VINAUDIT_API_PASS!
        );
        source = 'vinaudit';
        apiCost = API_COSTS.VINAUDIT_HISTORY;
      }
    } catch (vinauditError) {
      console.error('VinAudit error, trying ClearVin:', vinauditError);
    }

    // Fallback to ClearVin NMVTIS
    if (!historyReport && process.env.CLEARVIN_EMAIL) {
      try {
        historyReport = await getClearVinReport(
          vin,
          process.env.CLEARVIN_EMAIL,
          process.env.CLEARVIN_PASSWORD!
        );
        source = 'clearvin';
        apiCost = API_COSTS.CLEARVIN_NMVTIS;
      } catch (clearvinError) {
        console.error('ClearVin error:', clearvinError);
      }
    }

    if (!historyReport) {
      return { success: false, error: 'Unable to fetch vehicle history' };
    }

    // Store the report
    const adminSupabase = createAdminSupabaseClient();
    const { data: savedReport, error: saveError } = await adminSupabase
      .from('vehicle_history_reports')
      .insert({
        vin: vin.toUpperCase(),
        source: source,
        report_id: historyReport.reportId,
        title_status: historyReport.titleInfo.status,
        title_state: historyReport.titleInfo.state,
        title_issue_date: historyReport.titleInfo.issueDate,
        has_lien: historyReport.titleInfo.hasLien,
        lien_holder: historyReport.titleInfo.lienHolder,
        owner_count: historyReport.ownershipHistory.length,
        ownership_history: historyReport.ownershipHistory,
        accident_count: historyReport.accidentHistory.length,
        accident_history: historyReport.accidentHistory,
        service_record_count: historyReport.serviceHistory.length,
        service_history: historyReport.serviceHistory,
        odometer_readings: historyReport.odometerReadings,
        odometer_rollback_detected: false, // TODO: Implement detection
        open_recalls: historyReport.recalls.filter(r => r.status === 'open').length,
        recall_history: historyReport.recalls,
        salvage_records: historyReport.salvageRecords,
        junk_records: historyReport.junkRecords,
        theft_records: historyReport.theftRecords,
        raw_response: historyReport.rawData,
        api_cost: apiCost,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      } as Record<string, unknown>)
      .select()
      .single();

    // Increment usage
    await incrementHistoryReportUsage(user.id);

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'vehicle_history_fetched',
      resource_type: 'vehicle_history',
      details: { vin, source, cost: apiCost },
    } as Record<string, unknown>);

    return { success: true, data: savedReport || historyReport };
  } catch (err) {
    console.error('Vehicle history error:', err);
    return { success: false, error: 'Failed to fetch vehicle history' };
  }
}

// =============================================================================
// MARKET VALUE ACTION (PAID - VinAudit)
// =============================================================================

/**
 * Get market value estimate (PAID API)
 */
export async function getVehicleMarketValue(
  vin: string,
  mileage?: number,
  zipCode?: string
): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    if (!process.env.VINAUDIT_API_KEY) {
      return { success: false, error: 'Market value API not configured' };
    }

    const marketValue = await getMarketValueVinAudit(
      vin,
      process.env.VINAUDIT_API_KEY,
      mileage,
      zipCode
    );

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'market_value_fetched',
      resource_type: 'market_value',
      details: { vin, mileage, zipCode },
    } as Record<string, unknown>);

    return { success: true, data: marketValue };
  } catch (err) {
    console.error('Market value error:', err);
    return { success: false, error: 'Failed to fetch market value' };
  }
}

// =============================================================================
// FULL ANALYSIS ACTION
// =============================================================================

/**
 * Create a new comprehensive vehicle analysis
 */
export async function createAnalysis(input: CreateAnalysisInput): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate VIN
    const validation = validateVIN(input.vin);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Check usage limits
    const canAnalyze = await checkAnalysisLimit(user.id);
    if (!canAnalyze.allowed) {
      return { success: false, error: canAnalyze.reason };
    }

    // Create analysis record
    const { data: analysis, error: createError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        vin: input.vin.toUpperCase(),
        mileage: input.mileage,
        asking_price: input.askingPrice,
        status: 'pending',
        progress: 0,
        processing_started_at: new Date().toISOString(),
      } as Record<string, unknown>)
      .select()
      .single();

    if (createError) {
      return { success: false, error: createError.message };
    }

    // Start background processing
    processAnalysisInBackground(analysis.id, input);

    revalidatePath('/dashboard');
    return { success: true, data: analysis };
  } catch (err) {
    console.error('Create analysis error:', err);
    return { success: false, error: 'Failed to create analysis' };
  }
}

/**
 * Process analysis in background (this would normally be a queue job)
 */
async function processAnalysisInBackground(
  analysisId: string,
  input: CreateAnalysisInput
) {
  const adminSupabase = createAdminSupabaseClient();
  
  const updateProgress = async (
    status: AnalysisStatus,
    progress: number,
    additionalData?: any
  ) => {
    await adminSupabase
      .from('analyses')
      .update({
        status,
        progress,
        ...additionalData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', analysisId);
  };

  try {
    let totalCost = 0;
    let overallScore = 100;
    const issues: any[] = [];

    // Step 1: Decode VIN (FREE)
    await updateProgress('processing', 10);
    
    const decoded = await decodeVinNHTSA(input.vin);
    
    if (!decoded.success) {
      await updateProgress('failed', 0, { error_message: 'VIN decode failed' });
      return;
    }

    // Cache vehicle data
    const { data: vehicle } = await adminSupabase
      .from('vehicles')
      .upsert({
        vin: input.vin.toUpperCase(),
        year: decoded.year,
        make: decoded.make,
        model: decoded.model,
        trim: decoded.trim,
        body_style: decoded.bodyClass,
        drivetrain: decoded.driveType,
        engine: decoded.engineDisplacement,
        fuel_type: decoded.fuelType,
        decoded_data: decoded.rawData,
      } as Record<string, unknown>, { onConflict: 'vin' })
      .select()
      .single();

    await updateProgress('processing', 20, { vehicle_id: vehicle?.id });

    // Step 2: Get Recalls (FREE)
    const recalls = await getRecallsNHTSA(decoded.make, decoded.model, decoded.year);
    
    const openRecalls = recalls.filter(r => !r.parkIt); // Assuming incomplete
    if (openRecalls.length > 0) {
      overallScore -= openRecalls.length * 5;
      for (const recall of openRecalls) {
        issues.push({
          analysis_id: analysisId,
          category: 'safety',
          severity: recall.doNotDrive ? 'critical' : 'high',
          title: `Open Recall: ${recall.component}`,
          description: recall.summary,
          urgency: recall.doNotDrive ? 'immediate' : 'soon',
        });
      }
    }

    await updateProgress('processing', 30);

    // Step 3: Get Safety Ratings (FREE)
    const safetyRatings = await getSafetyRatingsNHTSA(
      decoded.year,
      decoded.make,
      decoded.model
    );

    let safetyScore = 100;
    if (safetyRatings.length > 0) {
      const avgRating = safetyRatings[0].overallRating || 3;
      safetyScore = (avgRating / 5) * 100;
    }

    await updateProgress('processing', 40);

    // Step 4: Get Vehicle History (PAID - if enabled)
    let historyScore = 100;
    let historyReport = null;

    if (input.includeHistory && process.env.VINAUDIT_API_KEY) {
      await updateProgress('history_check', 50);
      
      try {
        historyReport = await getVehicleHistoryVinAudit(
          input.vin,
          process.env.VINAUDIT_API_KEY,
          process.env.VINAUDIT_API_USER!,
          process.env.VINAUDIT_API_PASS!
        );
        totalCost += API_COSTS.VINAUDIT_HISTORY;

        // Calculate history score
        if (historyReport.titleInfo.status !== 'clean') {
          historyScore -= 30;
          issues.push({
            analysis_id: analysisId,
            category: 'history',
            severity: 'critical',
            title: `Title Status: ${historyReport.titleInfo.status}`,
            description: 'This vehicle has a branded title',
            urgency: 'immediate',
          });
        }

        if (historyReport.accidentHistory.length > 0) {
          historyScore -= historyReport.accidentHistory.length * 10;
          for (const accident of historyReport.accidentHistory) {
            issues.push({
              analysis_id: analysisId,
              category: 'history',
              severity: accident.severity === 'severe' ? 'critical' : 'medium',
              title: `Accident Reported: ${accident.date}`,
              description: accident.description,
              estimated_repair_cost: accident.repairCost,
              urgency: 'monitor',
            });
          }
        }

        // Store history report
        await adminSupabase.from('vehicle_history_reports').insert({
          analysis_id: analysisId,
          vin: input.vin.toUpperCase(),
          source: 'vinaudit',
          report_id: historyReport.reportId,
          title_status: historyReport.titleInfo.status,
          owner_count: historyReport.ownershipHistory.length,
          accident_count: historyReport.accidentHistory.length,
          ownership_history: historyReport.ownershipHistory,
          accident_history: historyReport.accidentHistory,
          service_history: historyReport.serviceHistory,
          odometer_readings: historyReport.odometerReadings,
          api_cost: API_COSTS.VINAUDIT_HISTORY,
        } as Record<string, unknown>);
      } catch (historyError) {
        console.error('History fetch error:', historyError);
      }
    }

    await updateProgress('processing', 70);

    // Step 5: Get Market Value (PAID - if configured)
    let marketValue = null;
    if (process.env.VINAUDIT_API_KEY) {
      try {
        marketValue = await getMarketValueVinAudit(
          input.vin,
          process.env.VINAUDIT_API_KEY,
          input.mileage
        );
        totalCost += API_COSTS.VINAUDIT_MARKET_VALUE;
      } catch (valueError) {
        console.error('Market value error:', valueError);
      }
    }

    await updateProgress('generating_report', 85);

    // Insert all issues
    if (issues.length > 0) {
      await adminSupabase.from('analysis_issues').insert(issues as Record<string, unknown>[]);
    }

    // Calculate overall score
    const visualScore = input.includeVisual ? 85 : null; // Would come from AI analysis
    const audioScore = input.includeAudio ? 90 : null; // Would come from AI analysis
    
    const scores = [historyScore, safetyScore, visualScore, audioScore].filter(s => s !== null);
    overallScore = Math.round(scores.reduce((a, b) => a! + b!, 0) / scores.length);
    overallScore = Math.max(0, Math.min(100, overallScore));

    // Determine buy recommendation
    let buyRecommendation = 'recommended';
    if (overallScore < 50) buyRecommendation = 'not_recommended';
    else if (overallScore < 70) buyRecommendation = 'conditional';

    // Calculate total repair cost
    const totalRepairCost = issues.reduce(
      (sum, issue) => sum + (issue.estimated_repair_cost || 0),
      0
    );

    // Final update
    await updateProgress('completed', 100, {
      overall_score: overallScore,
      visual_score: visualScore,
      audio_score: audioScore,
      history_score: historyScore,
      safety_score: safetyScore,
      estimated_market_value: marketValue?.averagePrice,
      total_repair_cost: totalRepairCost,
      buy_recommendation: buyRecommendation,
      summary: generateSummary(decoded, overallScore, issues.length, historyReport),
      processing_completed_at: new Date().toISOString(),
      processing_duration_ms: Date.now() - new Date().getTime(),
      api_costs: { total: totalCost, breakdown: {} },
      history_report_result: historyReport,
    });

    // Send notification
    const { data: analysis } = await adminSupabase
      .from('analyses')
      .select('user_id')
      .eq('id', analysisId)
      .single();

    if (analysis) {
      await adminSupabase.from('notifications').insert({
        user_id: analysis.user_id,
        type: 'analysis_complete',
        title: 'Analysis Complete',
        message: `Your ${decoded.year} ${decoded.make} ${decoded.model} analysis is ready. Score: ${overallScore}/100`,
        analysis_id: analysisId,
        action_url: `/dashboard/analysis/${analysisId}`,
        action_text: 'View Report',
      } as Record<string, unknown>);
    }

  } catch (err) {
    console.error('Background processing error:', err);
    await updateProgress('failed', 0, {
      error_message: err instanceof Error ? err.message : 'Analysis failed',
    });
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateSummary(
  decoded: any,
  score: number,
  issueCount: number,
  history: any
): string {
  const vehicle = `${decoded.year} ${decoded.make} ${decoded.model}`;
  
  if (score >= 80) {
    return `This ${vehicle} appears to be in excellent condition with minimal issues detected. ${issueCount === 0 ? 'No significant concerns were found.' : `${issueCount} minor issue(s) were identified.`}`;
  } else if (score >= 60) {
    return `This ${vehicle} is in fair condition with some notable concerns. ${issueCount} issue(s) were identified that should be addressed.`;
  } else {
    return `This ${vehicle} has significant concerns that warrant careful consideration. ${issueCount} issue(s) were found. We recommend a thorough pre-purchase inspection.`;
  }
}

async function checkAnalysisLimit(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const supabase = await createServerSupabaseClient();
  
  // Get user's subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, plan:subscription_plans(*)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  // Get current usage
  const { data: profile } = await supabase
    .from('profiles')
    .select('analyses_this_month')
    .eq('id', userId)
    .single();

  const used = profile?.analyses_this_month || 0;
  const limit = subscription?.plan?.analyses_per_month || 2; // Free tier default

  if (used >= limit) {
    return {
      allowed: false,
      reason: `You've reached your monthly limit of ${limit} analyses. Please upgrade to continue.`,
    };
  }

  return { allowed: true };
}

async function checkHistoryReportLimit(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const supabase = await createServerSupabaseClient();
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, plan:subscription_plans(*)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  const used = subscription?.history_reports_used || 0;
  const limit = subscription?.plan?.history_reports_per_month || 0;

  if (limit === 0) {
    return {
      allowed: false,
      reason: 'Vehicle history reports are not included in your plan. Please upgrade.',
    };
  }

  if (used >= limit) {
    return {
      allowed: false,
      reason: `You've used all ${limit} history reports this month. Please upgrade or wait until next month.`,
    };
  }

  return { allowed: true };
}

async function incrementHistoryReportUsage(userId: string): Promise<void> {
  const adminSupabase = createAdminSupabaseClient();
  
  await adminSupabase.rpc('increment_history_reports_used', { user_id: userId });
}

// =============================================================================
// ANALYSIS RETRIEVAL ACTIONS
// =============================================================================

/**
 * Get user's analyses
 */
export async function getUserAnalyses(options?: {
  limit?: number;
  status?: AnalysisStatus;
}): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    let query = supabase
      .from('analyses')
      .select(`
        *,
        vehicle:vehicles(*),
        issues:analysis_issues(*)
      `)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
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
    return { success: false, error: 'Failed to fetch analyses' };
  }
}

/**
 * Get single analysis by ID
 */
export async function getAnalysis(analysisId: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('analyses')
      .select(`
        *,
        vehicle:vehicles(*),
        issues:analysis_issues(*),
        history:vehicle_history_reports(*)
      `)
      .eq('id', analysisId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to fetch analysis' };
  }
}

/**
 * Delete an analysis (soft delete)
 */
export async function deleteAnalysis(analysisId: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('analyses')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', analysisId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to delete analysis' };
  }
}
