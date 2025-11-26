/**
 * MyAutoWhiz.com - VIN Decode API Route
 * 
 * Provides VIN decoding using NHTSA's free API
 * No authentication required for basic decode
 */

import { NextRequest, NextResponse } from 'next/server';

const NHTSA_API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

interface NHTSAResult {
  Variable: string;
  Value: string | null;
  ValueId: string | null;
  VariableId: number;
}

interface NHTSAResponse {
  Results: NHTSAResult[];
  Message: string;
  SearchCriteria: string;
}

// GET /api/vin?vin=XXXXX - Decode VIN
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vin = searchParams.get('vin');

    if (!vin) {
      return NextResponse.json(
        { error: 'VIN parameter is required' },
        { status: 400 }
      );
    }

    // Validate VIN format
    const cleanVin = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleanVin.length !== 17) {
      return NextResponse.json(
        { error: 'VIN must be exactly 17 characters' },
        { status: 400 }
      );
    }

    // Invalid characters
    if (/[IOQ]/.test(cleanVin)) {
      return NextResponse.json(
        { error: 'VIN contains invalid characters (I, O, or Q)' },
        { status: 400 }
      );
    }

    // Fetch from NHTSA
    const response = await fetch(
      `${NHTSA_API_URL}/DecodeVinValuesExtended/${cleanVin}?format=json`,
      {
        headers: { Accept: 'application/json' },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to decode VIN' },
        { status: 502 }
      );
    }

    const data: NHTSAResponse = await response.json();
    const results = data.Results[0];

    if (!results) {
      return NextResponse.json(
        { error: 'No results found for VIN' },
        { status: 404 }
      );
    }

    // Transform to cleaner format
    const decoded = {
      vin: cleanVin,
      year: parseInt(getValue(results, 'ModelYear') || '0'),
      make: getValue(results, 'Make'),
      model: getValue(results, 'Model'),
      trim: getValue(results, 'Trim'),
      bodyClass: getValue(results, 'BodyClass'),
      vehicleType: getValue(results, 'VehicleType'),
      driveType: getValue(results, 'DriveType'),
      fuelType: getValue(results, 'FuelTypePrimary'),
      engine: {
        displacement: getValue(results, 'DisplacementL'),
        cylinders: getValue(results, 'EngineCylinders'),
        hp: getValue(results, 'EngineHP'),
        model: getValue(results, 'EngineModel'),
      },
      transmission: {
        type: getValue(results, 'TransmissionStyle'),
        speeds: getValue(results, 'TransmissionSpeeds'),
      },
      manufacturer: {
        name: getValue(results, 'Manufacturer'),
        country: getValue(results, 'PlantCountry'),
        city: getValue(results, 'PlantCity'),
        state: getValue(results, 'PlantState'),
      },
      doors: getValue(results, 'Doors'),
      gvwr: getValue(results, 'GVWR'),
      wheelbase: getValue(results, 'WheelBaseShort'),
      // Safety
      abs: getValue(results, 'ABS'),
      airbags: {
        front: getValue(results, 'AirBagLocFront'),
        side: getValue(results, 'AirBagLocSide'),
        curtain: getValue(results, 'AirBagLocCurtain'),
      },
      // Errors
      errorCode: getValue(results, 'ErrorCode'),
      errorText: getValue(results, 'ErrorText'),
    };

    // Check for errors from NHTSA
    if (decoded.errorCode && decoded.errorCode !== '0') {
      return NextResponse.json({
        data: decoded,
        warning: decoded.errorText || 'VIN may have issues',
      });
    }

    return NextResponse.json({ data: decoded });

  } catch (error) {
    console.error('VIN decode error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getValue(results: Record<string, string | null>, key: string): string | null {
  const value = results[key];
  return value && value.trim() !== '' ? value.trim() : null;
}

// POST /api/vin - Batch decode VINs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vins } = body;

    if (!vins || !Array.isArray(vins)) {
      return NextResponse.json(
        { error: 'vins array is required' },
        { status: 400 }
      );
    }

    if (vins.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 VINs per request' },
        { status: 400 }
      );
    }

    // Clean and validate VINs
    const cleanVins = vins
      .map((vin: string) => vin.toUpperCase().replace(/[^A-Z0-9]/g, ''))
      .filter((vin: string) => vin.length === 17 && !/[IOQ]/.test(vin));

    if (cleanVins.length === 0) {
      return NextResponse.json(
        { error: 'No valid VINs provided' },
        { status: 400 }
      );
    }

    // Batch decode using NHTSA's batch endpoint
    const response = await fetch(
      `${NHTSA_API_URL}/DecodeVINValuesBatch/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${cleanVins.join(';')}&format=json`,
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to decode VINs' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const results = data.Results.map((result: Record<string, string | null>) => ({
      vin: result.VIN,
      year: parseInt(result.ModelYear || '0'),
      make: result.Make,
      model: result.Model,
      trim: result.Trim,
      bodyClass: result.BodyClass,
      vehicleType: result.VehicleType,
      errorCode: result.ErrorCode,
      errorText: result.ErrorText,
    }));

    return NextResponse.json({ data: results });

  } catch (error) {
    console.error('VIN batch decode error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
