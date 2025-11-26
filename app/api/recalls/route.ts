/**
 * MyAutoWhiz.com - Safety Recalls API Route
 * 
 * Fetches safety recalls from NHTSA's free API
 * No authentication required
 */

import { NextRequest, NextResponse } from 'next/server';

const NHTSA_RECALLS_URL = 'https://api.nhtsa.gov/recalls/recallsByVehicle';

interface NHTSARecall {
  Manufacturer: string;
  NHTSACampaignNumber: string;
  ReportReceivedDate: string;
  Component: string;
  Summary: string;
  Consequence: string;
  Remedy: string;
  Notes: string;
}

// GET /api/recalls - Get recalls by VIN, or by make/model/year
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vin = searchParams.get('vin');
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const year = searchParams.get('year');

    let url: string;

    if (vin) {
      // First decode VIN to get make/model/year
      const decodeResponse = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`
      );
      const decodeData = await decodeResponse.json();
      const decoded = decodeData.Results[0];

      if (!decoded?.Make || !decoded?.Model || !decoded?.ModelYear) {
        return NextResponse.json(
          { error: 'Could not decode VIN' },
          { status: 400 }
        );
      }

      url = `${NHTSA_RECALLS_URL}?make=${encodeURIComponent(decoded.Make)}&model=${encodeURIComponent(decoded.Model)}&modelYear=${decoded.ModelYear}`;
    } else if (make && model && year) {
      url = `${NHTSA_RECALLS_URL}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`;
    } else {
      return NextResponse.json(
        { error: 'VIN or make/model/year required' },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch recalls' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const recalls: NHTSARecall[] = data.results || [];

    // Transform to cleaner format
    const formattedRecalls = recalls.map((recall) => ({
      campaignNumber: recall.NHTSACampaignNumber,
      manufacturer: recall.Manufacturer,
      reportedDate: recall.ReportReceivedDate,
      component: recall.Component,
      summary: recall.Summary,
      consequence: recall.Consequence,
      remedy: recall.Remedy,
      notes: recall.Notes,
    }));

    return NextResponse.json({
      data: {
        count: formattedRecalls.length,
        recalls: formattedRecalls,
        hasOpenRecalls: formattedRecalls.length > 0,
      },
    });

  } catch (error) {
    console.error('Recalls fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
