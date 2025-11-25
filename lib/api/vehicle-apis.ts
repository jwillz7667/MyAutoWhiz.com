/**
 * MyAutoWhiz.com - Third-Party API Integrations
 * 
 * This file contains all real API endpoint integrations for:
 * - VIN Decoding (NHTSA)
 * - Vehicle History Reports (VinAudit, ClearVin, NMVTIS)
 * - Vehicle Recalls (NHTSA)
 * - Safety Ratings (NHTSA NCAP)
 * - Market Values (VinAudit, Vehicle Databases)
 * - Vehicle Images (VinAudit)
 * - Vehicle Specifications (VinAudit)
 */

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API_CONFIG = {
  // NHTSA vPIC API - FREE, no authentication required
  NHTSA: {
    BASE_URL: 'https://vpic.nhtsa.dot.gov/api',
    RECALLS_URL: 'https://api.nhtsa.gov/recalls/recallsByVehicle',
    SAFETY_RATINGS_URL: 'https://api.nhtsa.gov/SafetyRatings',
    COMPLAINTS_URL: 'https://api.nhtsa.gov/complaints',
  },
  
  // VinAudit API - Requires API key
  VINAUDIT: {
    BASE_URL: 'https://api.vinaudit.com',
    SPECIFICATIONS_URL: 'https://specifications.vinaudit.com/v3',
    IMAGES_URL: 'https://images.vinaudit.com/v3',
    OWNERSHIP_COST_URL: 'https://ownershipcost.vinaudit.com',
    MARKET_VALUE_URL: 'https://marketvalue.vinaudit.com',
  },
  
  // ClearVin NMVTIS API - Requires API key
  CLEARVIN: {
    BASE_URL: 'https://www.clearvin.com/rest/vendor',
    LOGIN_URL: 'https://www.clearvin.com/rest/vendor/login',
    REPORT_URL: 'https://www.clearvin.com/rest/vendor/report',
  },
  
  // Vehicle Databases API - Requires API key
  VEHICLE_DATABASES: {
    BASE_URL: 'https://api.vehicledatabases.com/v1',
    VIN_DECODE_URL: 'https://api.vehicledatabases.com/v1/vin-decode',
    HISTORY_URL: 'https://api.vehicledatabases.com/v1/vehicle-history',
    MARKET_VALUE_URL: 'https://api.vehicledatabases.com/v1/market-value',
    RECALLS_URL: 'https://api.vehicledatabases.com/v1/recalls',
  },
  
  // Auto.dev API - Requires API key
  AUTO_DEV: {
    BASE_URL: 'https://api.auto.dev',
    RECALLS_URL: 'https://api.auto.dev/recalls',
    SPECS_URL: 'https://api.auto.dev/specs',
  },
};

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface VINDecodeResult {
  success: boolean;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  bodyClass: string;
  vehicleType: string;
  driveType: string;
  engineCylinders: number;
  engineDisplacement: string;
  engineHP: number;
  fuelType: string;
  transmission: string;
  doors: number;
  plantCountry: string;
  plantCity: string;
  plantState: string;
  manufacturer: string;
  errorCode: string;
  errorText: string;
  rawData: Record<string, any>;
}

export interface VehicleHistoryReport {
  success: boolean;
  vin: string;
  source: string;
  reportId: string;
  titleInfo: {
    status: 'clean' | 'salvage' | 'rebuilt' | 'flood' | 'lemon' | 'junk' | 'unknown';
    state: string;
    issueDate: string;
    hasLien: boolean;
    lienHolder?: string;
  };
  ownershipHistory: Array<{
    ownerNumber: number;
    type: string;
    state: string;
    startDate: string;
    endDate: string | null;
    purchaseDate?: string;
    estimatedMileage?: number;
  }>;
  accidentHistory: Array<{
    date: string;
    severity: 'minor' | 'moderate' | 'severe';
    description: string;
    location: string;
    repairCost?: number;
    airbagDeployed: boolean;
    damageAreas?: string[];
  }>;
  serviceHistory: Array<{
    date: string;
    mileage: number;
    serviceType: string;
    description: string;
    location: string;
    source?: string;
  }>;
  odometerReadings: Array<{
    date: string;
    mileage: number;
    source: string;
  }>;
  recalls: Array<{
    date: string;
    component: string;
    description: string;
    remedy: string;
    status: 'open' | 'completed';
    nhtsaCampaignNumber?: string;
  }>;
  salvageRecords: Array<{
    date: string;
    type: string;
    state: string;
    source: string;
    details?: string;
  }>;
  theftRecords: Array<{
    date: string;
    status: 'stolen' | 'recovered';
    location?: string;
  }>;
  junkRecords: Array<{
    date: string;
    source: string;
    disposition: string;
  }>;
  rawData: Record<string, any>;
}

export interface RecallInfo {
  nhtsaCampaignNumber: string;
  manufacturer: string;
  make: string;
  model: string;
  modelYear: number;
  component: string;
  summary: string;
  consequence: string;
  remedy: string;
  notes: string;
  reportReceivedDate: string;
  parkIt: boolean;
  parkOutside: boolean;
  doNotDrive: boolean;
}

export interface SafetyRating {
  vehicleId: number;
  overallRating: number;
  frontalCrashRating: number;
  sideCrashRating: number;
  rolloverRating: number;
  frontalDriverRating: number;
  frontalPassengerRating: number;
  sideDriverRating: number;
  sidePassengerRating: number;
  sidePoleRating: number;
  rolloverRisk: number;
  vehicleDescription: string;
}

export interface MarketValue {
  vin: string;
  averagePrice: number;
  belowMarketPrice: number;
  aboveMarketPrice: number;
  tradeinValue: number;
  privatePartyValue: number;
  dealerRetailValue: number;
  priceRange: {
    low: number;
    high: number;
  };
  mileageAdjustment: number;
  conditionAdjustment: number;
  comparableListings: number;
}

// =============================================================================
// NHTSA API - FREE, NO AUTHENTICATION
// =============================================================================

/**
 * Decode VIN using NHTSA vPIC API
 * Documentation: https://vpic.nhtsa.dot.gov/api/
 * Rate Limit: Traffic controlled, no official limit
 * Cost: FREE
 */
export async function decodeVinNHTSA(vin: string, modelYear?: number): Promise<VINDecodeResult> {
  const url = modelYear
    ? `${API_CONFIG.NHTSA.BASE_URL}/vehicles/DecodeVinValuesExtended/${vin}?format=json&modelyear=${modelYear}`
    : `${API_CONFIG.NHTSA.BASE_URL}/vehicles/DecodeVinValuesExtended/${vin}?format=json`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`NHTSA API error: ${response.status}`);
  }

  const data = await response.json();
  const result = data.Results[0];

  return {
    success: result.ErrorCode === '0',
    vin: result.VIN || vin,
    year: parseInt(result.ModelYear) || 0,
    make: result.Make || '',
    model: result.Model || '',
    trim: result.Trim || '',
    bodyClass: result.BodyClass || '',
    vehicleType: result.VehicleType || '',
    driveType: result.DriveType || '',
    engineCylinders: parseInt(result.EngineCylinders) || 0,
    engineDisplacement: result.DisplacementL || '',
    engineHP: parseInt(result.EngineHP) || 0,
    fuelType: result.FuelTypePrimary || '',
    transmission: result.TransmissionStyle || '',
    doors: parseInt(result.Doors) || 0,
    plantCountry: result.PlantCountry || '',
    plantCity: result.PlantCity || '',
    plantState: result.PlantState || '',
    manufacturer: result.Manufacturer || '',
    errorCode: result.ErrorCode || '',
    errorText: result.ErrorText || '',
    rawData: result,
  };
}

/**
 * Batch decode multiple VINs using NHTSA API
 * Endpoint: POST https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch/
 */
export async function decodeVinBatchNHTSA(vins: string[]): Promise<VINDecodeResult[]> {
  const vinString = vins.join(';');
  
  const response = await fetch(
    `${API_CONFIG.NHTSA.BASE_URL}/vehicles/DecodeVINValuesBatch/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(vinString)}&format=json`,
    }
  );

  if (!response.ok) {
    throw new Error(`NHTSA Batch API error: ${response.status}`);
  }

  const data = await response.json();
  
  return data.Results.map((result: any) => ({
    success: result.ErrorCode === '0',
    vin: result.VIN,
    year: parseInt(result.ModelYear) || 0,
    make: result.Make || '',
    model: result.Model || '',
    trim: result.Trim || '',
    bodyClass: result.BodyClass || '',
    vehicleType: result.VehicleType || '',
    driveType: result.DriveType || '',
    engineCylinders: parseInt(result.EngineCylinders) || 0,
    engineDisplacement: result.DisplacementL || '',
    engineHP: parseInt(result.EngineHP) || 0,
    fuelType: result.FuelTypePrimary || '',
    transmission: result.TransmissionStyle || '',
    doors: parseInt(result.Doors) || 0,
    plantCountry: result.PlantCountry || '',
    plantCity: result.PlantCity || '',
    plantState: result.PlantState || '',
    manufacturer: result.Manufacturer || '',
    errorCode: result.ErrorCode || '',
    errorText: result.ErrorText || '',
    rawData: result,
  }));
}

/**
 * Get vehicle recalls from NHTSA
 * Endpoint: GET https://api.nhtsa.gov/recalls/recallsByVehicle
 * Cost: FREE
 */
export async function getRecallsNHTSA(
  make: string,
  model: string,
  modelYear: number
): Promise<RecallInfo[]> {
  const url = `${API_CONFIG.NHTSA.RECALLS_URL}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${modelYear}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`NHTSA Recalls API error: ${response.status}`);
  }

  const data = await response.json();

  return (data.results || []).map((recall: any) => ({
    nhtsaCampaignNumber: recall.NHTSACampaignNumber || '',
    manufacturer: recall.Manufacturer || '',
    make: recall.Make || make,
    model: recall.Model || model,
    modelYear: recall.ModelYear || modelYear,
    component: recall.Component || '',
    summary: recall.Summary || '',
    consequence: recall.Consequence || '',
    remedy: recall.Remedy || '',
    notes: recall.Notes || '',
    reportReceivedDate: recall.ReportReceivedDate || '',
    parkIt: recall.ParkIt === true,
    parkOutside: recall.ParkOutSide === true,
    doNotDrive: recall.ParkIt === true || recall.ParkOutSide === true,
  }));
}

/**
 * Get safety ratings from NHTSA NCAP
 * Endpoint: GET https://api.nhtsa.gov/SafetyRatings/modelyear/{year}/make/{make}/model/{model}
 * Cost: FREE
 */
export async function getSafetyRatingsNHTSA(
  year: number,
  make: string,
  model: string
): Promise<SafetyRating[]> {
  // First get vehicle variants
  const variantsUrl = `${API_CONFIG.NHTSA.SAFETY_RATINGS_URL}/modelyear/${year}/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}?format=json`;
  
  const variantsResponse = await fetch(variantsUrl);
  
  if (!variantsResponse.ok) {
    throw new Error(`NHTSA Safety Ratings API error: ${variantsResponse.status}`);
  }

  const variantsData = await variantsResponse.json();
  const variants = variantsData.Results || [];

  // Get ratings for each variant
  const ratings: SafetyRating[] = [];
  
  for (const variant of variants) {
    const vehicleId = variant.VehicleId;
    if (!vehicleId) continue;

    const ratingUrl = `${API_CONFIG.NHTSA.SAFETY_RATINGS_URL}/VehicleId/${vehicleId}?format=json`;
    const ratingResponse = await fetch(ratingUrl);
    
    if (ratingResponse.ok) {
      const ratingData = await ratingResponse.json();
      const result = ratingData.Results[0];
      
      if (result) {
        ratings.push({
          vehicleId: vehicleId,
          overallRating: parseInt(result.OverallRating) || 0,
          frontalCrashRating: parseInt(result.OverallFrontCrashRating) || 0,
          sideCrashRating: parseInt(result.OverallSideCrashRating) || 0,
          rolloverRating: parseInt(result.RolloverRating) || 0,
          frontalDriverRating: parseInt(result.FrontCrashDriversideRating) || 0,
          frontalPassengerRating: parseInt(result.FrontCrashPassengersideRating) || 0,
          sideDriverRating: parseInt(result.SideCrashDriversideRating) || 0,
          sidePassengerRating: parseInt(result.SideCrashPassengersideRating) || 0,
          sidePoleRating: parseInt(result.SidePoleCrashRating) || 0,
          rolloverRisk: parseFloat(result.RolloverPossibility) || 0,
          vehicleDescription: variant.VehicleDescription || '',
        });
      }
    }
  }

  return ratings;
}

/**
 * Get vehicle complaints from NHTSA
 * Endpoint: GET https://api.nhtsa.gov/complaints/complaintsByVehicle
 * Cost: FREE
 */
export async function getComplaintsNHTSA(
  make: string,
  model: string,
  modelYear: number
): Promise<any[]> {
  const url = `${API_CONFIG.NHTSA.COMPLAINTS_URL}/complaintsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${modelYear}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`NHTSA Complaints API error: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

// =============================================================================
// VINAUDIT API - REQUIRES API KEY
// =============================================================================

/**
 * VinAudit Vehicle History Report
 * Documentation: https://www.vinaudit.com/vehicle-history-api
 * Endpoint: https://api.vinaudit.com/query.php (check), https://api.vinaudit.com/v2/pullreport (full report)
 * Cost: ~$0.50-$3.00 per report depending on volume
 */
export async function getVehicleHistoryVinAudit(
  vin: string,
  apiKey: string,
  apiUser: string,
  apiPass: string
): Promise<VehicleHistoryReport> {
  // First query to check if data exists
  const queryUrl = `${API_CONFIG.VINAUDIT.BASE_URL}/query.php?vin=${vin}&key=${apiKey}&format=json`;
  
  const queryResponse = await fetch(queryUrl);
  const queryData = await queryResponse.json();

  if (!queryData.success) {
    throw new Error(`VinAudit query failed: ${queryData.error || 'Unknown error'}`);
  }

  // Generate unique report ID
  const reportId = Date.now().toString();

  // Pull full report
  const reportUrl = `${API_CONFIG.VINAUDIT.BASE_URL}/v2/pullreport?id=${reportId}&key=${apiKey}&vin=${vin}&user=${apiUser}&pass=${apiPass}&format=json`;
  
  const reportResponse = await fetch(reportUrl);
  const reportData = await reportResponse.json();

  if (!reportData.success && reportData.success !== undefined) {
    throw new Error(`VinAudit report failed: ${reportData.error || 'Unknown error'}`);
  }

  // Parse and normalize the response
  return parseVinAuditResponse(vin, reportData);
}

function parseVinAuditResponse(vin: string, data: any): VehicleHistoryReport {
  return {
    success: true,
    vin: vin,
    source: 'vinaudit',
    reportId: data.id || '',
    titleInfo: {
      status: parseTitleStatus(data.titles),
      state: data.titles?.[0]?.state || '',
      issueDate: data.titles?.[0]?.date || '',
      hasLien: false,
      lienHolder: undefined,
    },
    ownershipHistory: (data.titles || []).map((title: any, index: number) => ({
      ownerNumber: index + 1,
      type: 'personal',
      state: title.state || '',
      startDate: title.date || '',
      endDate: null,
      estimatedMileage: parseInt(title.meter) || undefined,
    })),
    accidentHistory: (data.accidents || []).map((accident: any) => ({
      date: accident.date || '',
      severity: 'moderate' as const,
      description: accident.description || '',
      location: accident.location || '',
      repairCost: undefined,
      airbagDeployed: false,
      damageAreas: [],
    })),
    serviceHistory: (data.service || []).map((service: any) => ({
      date: service.date || '',
      mileage: parseInt(service.mileage) || 0,
      serviceType: service.type || '',
      description: service.description || '',
      location: service.location || '',
      source: 'vinaudit',
    })),
    odometerReadings: (data.titles || []).filter((t: any) => t.meter).map((title: any) => ({
      date: title.date || '',
      mileage: parseInt(title.meter) || 0,
      source: title.state || 'DMV',
    })),
    recalls: [],
    salvageRecords: (data.jsi || []).filter((r: any) => r.record_type?.includes('Salvage')).map((record: any) => ({
      date: record.date || '',
      type: record.record_type || '',
      state: record.brander_state || '',
      source: record.brander_name || '',
      details: record.vehicle_disposition || '',
    })),
    theftRecords: [],
    junkRecords: (data.jsi || []).filter((r: any) => r.record_type?.includes('Junk')).map((record: any) => ({
      date: record.date || '',
      source: record.brander_name || '',
      disposition: record.vehicle_disposition || '',
    })),
    rawData: data,
  };
}

function parseTitleStatus(titles: any[]): 'clean' | 'salvage' | 'rebuilt' | 'flood' | 'lemon' | 'junk' | 'unknown' {
  if (!titles || titles.length === 0) return 'unknown';
  
  // Check for brand indicators in title data
  const latestTitle = titles[0];
  const brand = latestTitle?.brand?.toLowerCase() || '';
  
  if (brand.includes('salvage')) return 'salvage';
  if (brand.includes('rebuilt')) return 'rebuilt';
  if (brand.includes('flood')) return 'flood';
  if (brand.includes('lemon')) return 'lemon';
  if (brand.includes('junk')) return 'junk';
  
  return 'clean';
}

/**
 * VinAudit Vehicle Specifications
 * Endpoint: https://specifications.vinaudit.com/v3/specifications
 */
export async function getVehicleSpecsVinAudit(
  vin: string,
  apiKey: string
): Promise<any> {
  const url = `${API_CONFIG.VINAUDIT.SPECIFICATIONS_URL}/specifications?vin=${vin}&key=${apiKey}&format=json&include=selections,attributes,equipment,colors,warranties,photos`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`VinAudit Specs API error: ${response.status}`);
  }

  return response.json();
}

/**
 * VinAudit Market Value
 * Endpoint: https://marketvalue.vinaudit.com/getmarketvalue.php
 */
export async function getMarketValueVinAudit(
  vin: string,
  apiKey: string,
  mileage?: number,
  zipCode?: string
): Promise<MarketValue> {
  let url = `${API_CONFIG.VINAUDIT.MARKET_VALUE_URL}/getmarketvalue.php?vin=${vin}&key=${apiKey}&format=json`;
  
  if (mileage) url += `&mileage=${mileage}`;
  if (zipCode) url += `&zip=${zipCode}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`VinAudit Market Value API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    vin: vin,
    averagePrice: parseFloat(data.mean) || 0,
    belowMarketPrice: parseFloat(data.below) || 0,
    aboveMarketPrice: parseFloat(data.above) || 0,
    tradeinValue: parseFloat(data.tradein) || 0,
    privatePartyValue: parseFloat(data.private) || 0,
    dealerRetailValue: parseFloat(data.dealer) || 0,
    priceRange: {
      low: parseFloat(data.below) || 0,
      high: parseFloat(data.above) || 0,
    },
    mileageAdjustment: parseFloat(data.mileage_adjustment) || 0,
    conditionAdjustment: 0,
    comparableListings: parseInt(data.count) || 0,
  };
}

/**
 * VinAudit Ownership Cost
 * Endpoint: https://ownershipcost.vinaudit.com/getownershipcost.php
 */
export async function getOwnershipCostVinAudit(
  vin: string,
  apiKey: string,
  state: string = 'MN'
): Promise<any> {
  const url = `${API_CONFIG.VINAUDIT.OWNERSHIP_COST_URL}/getownershipcost.php?vin=${vin}&key=${apiKey}&state=${state}&format=json`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`VinAudit Ownership Cost API error: ${response.status}`);
  }

  return response.json();
}

/**
 * VinAudit Vehicle Images
 * Endpoint: https://images.vinaudit.com/v3/images
 */
export async function getVehicleImagesVinAudit(
  vin: string,
  apiKey: string,
  options?: {
    pose?: 'front' | 'front_right' | 'front_left' | 'rear' | 'rear_right' | 'rear_left' | 'side';
    color?: string;
    size?: string;
    background?: 'white' | 'transparent' | 'gallery';
  }
): Promise<string> {
  let url = `${API_CONFIG.VINAUDIT.IMAGES_URL}/images?vin=${vin}&key=${apiKey}&format=html`;
  
  if (options?.pose) url += `&pose=${options.pose}`;
  if (options?.color) url += `&color=${options.color}`;
  if (options?.size) url += `&size=${options.size}`;
  if (options?.background) url += `&background=${options.background}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`VinAudit Images API error: ${response.status}`);
  }

  return response.text(); // Returns HTML with embedded image
}

// =============================================================================
// CLEARVIN NMVTIS API - REQUIRES API KEY
// =============================================================================

/**
 * ClearVin NMVTIS Report
 * Documentation: https://www.clearvin.com/en/api-subscribers/nmvtis-history-api/
 * This is an official NMVTIS data provider
 * Cost: Varies by volume
 */
export async function getClearVinReport(
  vin: string,
  email: string,
  password: string
): Promise<VehicleHistoryReport> {
  // First, authenticate to get token
  const loginResponse = await fetch(API_CONFIG.CLEARVIN.LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!loginResponse.ok) {
    throw new Error(`ClearVin login failed: ${loginResponse.status}`);
  }

  const loginData = await loginResponse.json();
  
  if (loginData.status !== 'ok') {
    throw new Error(`ClearVin login failed: ${loginData.error || 'Unknown error'}`);
  }

  const token = loginData.token;

  // Get report
  const reportResponse = await fetch(`${API_CONFIG.CLEARVIN.REPORT_URL}?vin=${vin}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!reportResponse.ok) {
    throw new Error(`ClearVin report failed: ${reportResponse.status}`);
  }

  const reportData = await reportResponse.json();

  return parseClearVinResponse(vin, reportData);
}

function parseClearVinResponse(vin: string, data: any): VehicleHistoryReport {
  const nmvtis = data.result?.report?.nmvtis || {};
  
  return {
    success: data.status === 'ok',
    vin: vin,
    source: 'clearvin',
    reportId: data.result?.id || '',
    titleInfo: {
      status: parseClearVinTitleStatus(nmvtis),
      state: nmvtis.titleRecords?.[0]?.state || '',
      issueDate: nmvtis.titleRecords?.[0]?.date || '',
      hasLien: false,
      lienHolder: undefined,
    },
    ownershipHistory: (nmvtis.titleRecords || []).map((record: any, index: number) => ({
      ownerNumber: index + 1,
      type: 'personal',
      state: record.ReportingEntityAbstract?.LocationStateUSPostalServiceCode || '',
      startDate: record.VehicleBrandDate?.Date || '',
      endDate: null,
    })),
    accidentHistory: [],
    serviceHistory: [],
    odometerReadings: (nmvtis.odometerReadings || []).map((reading: any) => ({
      date: reading.date || '',
      mileage: parseInt(reading.mileage) || 0,
      source: 'NMVTIS',
    })),
    recalls: [],
    salvageRecords: (nmvtis.junkAndSalvageInformation || []).map((record: any) => ({
      date: record.VehicleObtainedDate || '',
      type: record.ReportingEntityAbstract?.ReportingEntityCategoryText || '',
      state: record.ReportingEntityAbstract?.LocationStateUSPostalServiceCode || '',
      source: record.ReportingEntityAbstract?.EntityName || '',
      details: record.VehicleDispositionText || '',
    })),
    theftRecords: [],
    junkRecords: (nmvtis.junkAndSalvageInformation || [])
      .filter((r: any) => r.ReportingEntityAbstract?.ReportingEntityCategoryCode === 'J')
      .map((record: any) => ({
        date: record.VehicleObtainedDate || '',
        source: record.ReportingEntityAbstract?.EntityName || '',
        disposition: record.VehicleDispositionText || '',
      })),
    rawData: data,
  };
}

function parseClearVinTitleStatus(nmvtis: any): 'clean' | 'salvage' | 'rebuilt' | 'flood' | 'lemon' | 'junk' | 'unknown' {
  const brands = nmvtis.vehicleBrands || [];
  
  for (const brand of brands) {
    const name = brand.name?.toLowerCase() || '';
    if (name.includes('salvage')) return 'salvage';
    if (name.includes('rebuilt')) return 'rebuilt';
    if (name.includes('flood')) return 'flood';
    if (name.includes('lemon')) return 'lemon';
    if (name.includes('junk')) return 'junk';
  }
  
  return 'clean';
}

// =============================================================================
// VEHICLE DATABASES API - REQUIRES API KEY
// =============================================================================

/**
 * Vehicle Databases VIN Decode
 * Documentation: https://vehicledatabases.com/vin-decoder-api
 * Cost: Varies by volume
 */
export async function decodeVinVehicleDatabases(
  vin: string,
  apiKey: string
): Promise<VINDecodeResult> {
  const response = await fetch(
    `${API_CONFIG.VEHICLE_DATABASES.VIN_DECODE_URL}/${vin}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Vehicle Databases API error: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    success: true,
    vin: vin,
    year: parseInt(data.year) || 0,
    make: data.make || '',
    model: data.model || '',
    trim: data.trim || '',
    bodyClass: data.body_class || '',
    vehicleType: data.vehicle_type || '',
    driveType: data.drive_type || '',
    engineCylinders: parseInt(data.cylinders) || 0,
    engineDisplacement: data.engine_displacement || '',
    engineHP: parseInt(data.horsepower) || 0,
    fuelType: data.fuel_type || '',
    transmission: data.transmission || '',
    doors: parseInt(data.doors) || 0,
    plantCountry: data.made_in_country || '',
    plantCity: data.made_in_city || '',
    plantState: '',
    manufacturer: data.manufacturer || '',
    errorCode: '',
    errorText: '',
    rawData: data,
  };
}

/**
 * Vehicle Databases Vehicle History
 * Documentation: https://vehicledatabases.com/vehicle-history-api
 */
export async function getVehicleHistoryVehicleDatabases(
  vin: string,
  apiKey: string
): Promise<VehicleHistoryReport> {
  const response = await fetch(
    `${API_CONFIG.VEHICLE_DATABASES.HISTORY_URL}/${vin}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Vehicle Databases History API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Parse and return normalized format
  return {
    success: true,
    vin: vin,
    source: 'vehicle_databases',
    reportId: data.report_id || '',
    titleInfo: {
      status: data.title_status || 'unknown',
      state: data.title_state || '',
      issueDate: data.title_issue_date || '',
      hasLien: data.has_lien || false,
      lienHolder: data.lien_holder,
    },
    ownershipHistory: data.ownership_history || [],
    accidentHistory: data.accident_history || [],
    serviceHistory: data.service_history || [],
    odometerReadings: data.odometer_readings || [],
    recalls: data.recalls || [],
    salvageRecords: data.salvage_records || [],
    theftRecords: data.theft_records || [],
    junkRecords: data.junk_records || [],
    rawData: data,
  };
}

/**
 * Vehicle Databases Market Value
 */
export async function getMarketValueVehicleDatabases(
  vin: string,
  apiKey: string,
  mileage?: number
): Promise<MarketValue> {
  let url = `${API_CONFIG.VEHICLE_DATABASES.MARKET_VALUE_URL}/${vin}`;
  if (mileage) url += `?mileage=${mileage}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Vehicle Databases Market Value API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    vin: vin,
    averagePrice: data.average_price || 0,
    belowMarketPrice: data.below_market || 0,
    aboveMarketPrice: data.above_market || 0,
    tradeinValue: data.tradein_value || 0,
    privatePartyValue: data.private_party_value || 0,
    dealerRetailValue: data.dealer_retail_value || 0,
    priceRange: {
      low: data.price_range_low || 0,
      high: data.price_range_high || 0,
    },
    mileageAdjustment: data.mileage_adjustment || 0,
    conditionAdjustment: data.condition_adjustment || 0,
    comparableListings: data.comparable_listings || 0,
  };
}

// =============================================================================
// AUTO.DEV API - REQUIRES API KEY
// =============================================================================

/**
 * Auto.dev Recalls by VIN
 * Documentation: https://docs.auto.dev/v2/products/vehicle-recalls
 * Cost: Varies by plan
 */
export async function getRecallsAutodev(
  vin: string,
  apiKey: string
): Promise<RecallInfo[]> {
  const response = await fetch(`${API_CONFIG.AUTO_DEV.RECALLS_URL}/${vin}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Auto.dev Recalls API error: ${response.status}`);
  }

  const data = await response.json();

  return (data.data || []).map((recall: any) => ({
    nhtsaCampaignNumber: recall.nhtsaCampaignNumber || '',
    manufacturer: recall.manufacturer || '',
    make: recall.make || '',
    model: recall.model || '',
    modelYear: parseInt(recall.modelYear) || 0,
    component: recall.component || '',
    summary: recall.summary || '',
    consequence: recall.consequence || '',
    remedy: recall.remedy || '',
    notes: recall.notes || '',
    reportReceivedDate: recall.reportReceivedDate || '',
    parkIt: recall.parkIt === true,
    parkOutside: recall.parkOutSide === true,
    doNotDrive: recall.parkIt === true || recall.parkOutSide === true,
  }));
}

// =============================================================================
// AGGREGATED API CALLS - COMBINE MULTIPLE SOURCES
// =============================================================================

/**
 * Get comprehensive vehicle information from multiple sources
 */
export async function getComprehensiveVehicleData(
  vin: string,
  config: {
    vinauditApiKey?: string;
    vinauditUser?: string;
    vinauditPass?: string;
    clearvinEmail?: string;
    clearvinPassword?: string;
    vehicleDbApiKey?: string;
    autodevApiKey?: string;
  }
): Promise<{
  decoded: VINDecodeResult;
  history: VehicleHistoryReport | null;
  recalls: RecallInfo[];
  safetyRatings: SafetyRating[];
  marketValue: MarketValue | null;
}> {
  // Always decode VIN first (free NHTSA)
  const decoded = await decodeVinNHTSA(vin);

  // Get recalls (free NHTSA)
  const recalls = decoded.make && decoded.model && decoded.year
    ? await getRecallsNHTSA(decoded.make, decoded.model, decoded.year)
    : [];

  // Get safety ratings (free NHTSA)
  const safetyRatings = decoded.make && decoded.model && decoded.year
    ? await getSafetyRatingsNHTSA(decoded.year, decoded.make, decoded.model)
    : [];

  // Get history report (paid API)
  let history: VehicleHistoryReport | null = null;
  if (config.vinauditApiKey && config.vinauditUser && config.vinauditPass) {
    try {
      history = await getVehicleHistoryVinAudit(
        vin,
        config.vinauditApiKey,
        config.vinauditUser,
        config.vinauditPass
      );
    } catch (error) {
      console.error('VinAudit history error:', error);
    }
  }

  // Get market value (paid API)
  let marketValue: MarketValue | null = null;
  if (config.vinauditApiKey) {
    try {
      marketValue = await getMarketValueVinAudit(vin, config.vinauditApiKey);
    } catch (error) {
      console.error('VinAudit market value error:', error);
    }
  }

  return {
    decoded,
    history,
    recalls,
    safetyRatings,
    marketValue,
  };
}

// =============================================================================
// API COST TRACKING
// =============================================================================

export const API_COSTS = {
  // NHTSA - All free
  NHTSA_VIN_DECODE: 0,
  NHTSA_RECALLS: 0,
  NHTSA_SAFETY_RATINGS: 0,
  NHTSA_COMPLAINTS: 0,
  
  // VinAudit - Estimated costs (actual varies by volume)
  VINAUDIT_HISTORY: 2.50, // Per report
  VINAUDIT_SPECS: 0.50,
  VINAUDIT_MARKET_VALUE: 0.25,
  VINAUDIT_OWNERSHIP_COST: 0.25,
  VINAUDIT_IMAGES: 0.10,
  
  // ClearVin NMVTIS
  CLEARVIN_NMVTIS: 3.00, // Per report
  
  // Vehicle Databases
  VEHICLE_DATABASES_DECODE: 0.10,
  VEHICLE_DATABASES_HISTORY: 2.00,
  VEHICLE_DATABASES_MARKET_VALUE: 0.25,
  
  // Auto.dev
  AUTODEV_RECALLS: 0.05,
  AUTODEV_SPECS: 0.10,
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function formatVIN(vin: string): string {
  return vin.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
}

export function validateVIN(vin: string): { valid: boolean; error?: string } {
  const cleanVIN = formatVIN(vin);
  
  if (cleanVIN.length !== 17) {
    return { valid: false, error: 'VIN must be exactly 17 characters' };
  }
  
  if (/[IOQ]/i.test(cleanVIN)) {
    return { valid: false, error: 'VIN cannot contain I, O, or Q' };
  }
  
  return { valid: true };
}

export function getVINCheckDigit(vin: string): string {
  // VIN check digit calculation (9th position)
  const transliteration: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
  };
  
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin[i];
    const value = /\d/.test(char) ? parseInt(char) : transliteration[char] || 0;
    sum += value * weights[i];
  }
  
  const remainder = sum % 11;
  return remainder === 10 ? 'X' : remainder.toString();
}
