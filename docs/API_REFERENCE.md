# MyAutoWhiz.com - Third-Party API Reference

## Complete List of Real API Endpoints for Vehicle Data

This document contains all verified, production-ready API endpoints for vehicle history, VIN decoding, recalls, safety ratings, and market valuations.

---

## 1. NHTSA APIs (FREE - No Authentication Required)

The National Highway Traffic Safety Administration provides free APIs for vehicle data.

### 1.1 VIN Decoding API (vPIC)

**Base URL:** `https://vpic.nhtsa.dot.gov/api`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/vehicles/DecodeVinValues/{vin}?format=json` | GET | Basic VIN decode |
| `/vehicles/DecodeVinValuesExtended/{vin}?format=json` | GET | Extended VIN decode with NCSA data |
| `/vehicles/DecodeVinValuesBatch/` | POST | Batch decode multiple VINs |
| `/vehicles/DecodeWMI/{wmi}?format=json` | GET | Decode World Manufacturer Identifier |
| `/vehicles/GetMakesForVehicleType/{type}?format=json` | GET | Get makes for vehicle type |
| `/vehicles/GetModelsForMake/{make}?format=json` | GET | Get models for a make |
| `/vehicles/GetModelsForMakeYear/make/{make}/modelyear/{year}?format=json` | GET | Models by make and year |

**Example Request:**
```bash
curl "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/1HGBH41JXMN109186?format=json"
```

**Example Response:**
```json
{
  "Count": 136,
  "Message": "Results returned successfully",
  "SearchCriteria": "VIN:1HGBH41JXMN109186",
  "Results": [{
    "Make": "HONDA",
    "Model": "Accord",
    "ModelYear": "2021",
    "BodyClass": "Sedan/Saloon",
    "DriveType": "Front-Wheel Drive",
    "EngineHP": "192",
    "FuelTypePrimary": "Gasoline",
    "PlantCity": "MARYSVILLE",
    "PlantCountry": "UNITED STATES (USA)",
    "PlantState": "OHIO",
    "VehicleType": "PASSENGER CAR",
    "ErrorCode": "0",
    "ErrorText": "0 - VIN decoded clean"
  }]
}
```

### 1.2 Recalls API

**Base URL:** `https://api.nhtsa.gov`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/recalls/recallsByVehicle?make={make}&model={model}&modelYear={year}` | GET | Get recalls by vehicle |
| `/recalls/campaignNumber?campaignNumber={number}` | GET | Get recall by campaign number |

**Example Request:**
```bash
curl "https://api.nhtsa.gov/recalls/recallsByVehicle?make=Honda&model=Accord&modelYear=2022"
```

**Example Response:**
```json
{
  "Count": 2,
  "Message": "Results returned successfully",
  "results": [{
    "Manufacturer": "Honda (American Honda Motor Co.)",
    "NHTSACampaignNumber": "22V123000",
    "parkIt": false,
    "parkOutSide": false,
    "ReportReceivedDate": "15/03/2022",
    "Component": "FUEL SYSTEM, GASOLINE:DELIVERY:FUEL PUMP",
    "Summary": "The fuel pump may fail...",
    "Consequence": "If the fuel pump fails, the engine can stall...",
    "Remedy": "Dealers will replace the fuel pump, free of charge.",
    "Notes": "Owners may contact Honda customer service..."
  }]
}
```

### 1.3 Safety Ratings API (NCAP)

**Base URL:** `https://api.nhtsa.gov/SafetyRatings`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/modelyear/{year}?format=json` | GET | Get makes for a model year |
| `/modelyear/{year}/make/{make}?format=json` | GET | Get models for year and make |
| `/modelyear/{year}/make/{make}/model/{model}?format=json` | GET | Get vehicle variants |
| `/VehicleId/{vehicleId}?format=json` | GET | Get ratings by vehicle ID |

**Example Request:**
```bash
curl "https://api.nhtsa.gov/SafetyRatings/modelyear/2022/make/Honda/model/Accord?format=json"
```

### 1.4 Complaints API

**Base URL:** `https://api.nhtsa.gov/complaints`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/complaintsByVehicle?make={make}&model={model}&modelYear={year}` | GET | Get complaints by vehicle |

---

## 2. VinAudit API (Paid - Requires API Key)

**Website:** https://www.vinaudit.com/api
**Pricing:** Volume-based, approximately $0.50-$3.00 per report
**Sign Up:** https://www.vinaudit.com/partner-signup

### 2.1 Vehicle History API

**Base URL:** `https://api.vinaudit.com`

| Endpoint | Method | Description | Cost |
|----------|--------|-------------|------|
| `/query.php?vin={vin}&key={key}&format=json` | GET | Check if data exists for VIN | Free |
| `/order.php` | GET/POST | Order a new report | ~$2.50 |
| `/v2/pullreport?id={id}&key={key}&vin={vin}&user={user}&pass={pass}&format=json` | GET | Pull full vehicle history | Included |

**Query Parameters:**
- `vin` - 17-character VIN
- `key` - Your API key
- `format` - Response format (json, xml)
- `user` - API username
- `pass` - API password
- `id` - Unique report ID (for billing)
- `mode` - "test" for sandbox

**Example Query Request:**
```bash
curl "https://api.vinaudit.com/query.php?vin=1NXBR32E85Z505904&key=YOUR_API_KEY&format=json"
```

**Example Query Response:**
```json
{
  "id": "7742103371467",
  "vin": "1NXBR32E85Z505904",
  "attributes": {
    "VIN": "1NXBR32E85Z505904",
    "Make": "TOYOTA",
    "Model": "COROLLA CE",
    "Style": "4 DOOR SEDAN",
    "Engine": "1.8L L4 DOHC 16V",
    "Made In": "JAPAN",
    "Type": "PASSENGER CAR"
  },
  "success": true,
  "error": ""
}
```

**Example Full Report Response:**
```json
{
  "vin": "1VXBR12EXCP901214",
  "id": "00000000000002",
  "date": "2024-01-15 09:47:20 PST",
  "attributes": {
    "vin": "1VXBR12EXCP901214",
    "year": "2005",
    "make": "Toyota",
    "model": "Corolla",
    "trim": "CE",
    "engine": "1.8L L4 DOHC 16V",
    "style": "Sedan (4-Door)",
    "type": "PASSENGER CAR",
    "made_in": "JAPAN"
  },
  "titles": [
    {
      "date": "2011-08-31",
      "state": "WA",
      "meter": "59396",
      "meter_unit": "M",
      "current": "true"
    }
  ],
  "jsi": [
    {
      "date": "2007-10-25",
      "record_type": "Junk And Salvage",
      "brander_name": "Insurance Salvage, Inc.",
      "brander_city": "Milwaukee",
      "brander_state": "WI",
      "vehicle_disposition": "SOLD"
    }
  ]
}
```

### 2.2 Vehicle Specifications API

**Base URL:** `https://specifications.vinaudit.com/v3`

| Endpoint | Method | Description | Cost |
|----------|--------|-------------|------|
| `/specifications?vin={vin}&key={key}&format=json` | GET | Get vehicle specs by VIN | ~$0.50 |
| `/specifications?year={year}&make={make}&model={model}&key={key}` | GET | Get specs by YMMT | ~$0.50 |

**Include Parameter Options:**
- `selections` - Year/Make/Model/Trim selections
- `attributes` - Vehicle attributes
- `equipment` - Standard/optional equipment
- `colors` - Available colors
- `warranties` - Warranty information
- `photos` - Vehicle photos

**Example Request:**
```bash
curl "https://specifications.vinaudit.com/v3/specifications?vin=1NXBR32E85Z505904&key=YOUR_KEY&format=json&include=selections,attributes,equipment,colors,warranties"
```

### 2.3 Market Value API

**Base URL:** `https://marketvalue.vinaudit.com`

| Endpoint | Method | Description | Cost |
|----------|--------|-------------|------|
| `/getmarketvalue.php?vin={vin}&key={key}&format=json` | GET | Get market value | ~$0.25 |

**Optional Parameters:**
- `mileage` - Current mileage
- `zip` - ZIP code for regional pricing

**Example Request:**
```bash
curl "https://marketvalue.vinaudit.com/getmarketvalue.php?vin=1NXBR32E85Z505904&key=YOUR_KEY&mileage=75000&zip=55401&format=json"
```

**Example Response:**
```json
{
  "vin": "1NXBR32E85Z505904",
  "mean": "8500",
  "below": "7200",
  "above": "9800",
  "tradein": "6500",
  "private": "8000",
  "dealer": "9200",
  "mileage_adjustment": "-450",
  "count": "127"
}
```

### 2.4 Ownership Cost API

**Base URL:** `https://ownershipcost.vinaudit.com`

| Endpoint | Method | Description | Cost |
|----------|--------|-------------|------|
| `/getownershipcost.php?vin={vin}&key={key}&state={state}` | GET | 5-year ownership cost | ~$0.25 |

**Example Response:**
```json
{
  "vin": "1NXBR32E85Z505904",
  "mileage_start": 150000,
  "mileage_year": 15000,
  "vehicle": "2005 Toyota Corolla",
  "trim": "CE",
  "depreciation_cost": [1682, 807, 706, 639, 572],
  "insurance_cost": [1487, 1539, 1592, 1648, 1706],
  "fuel_cost": [2722, 2803, 2887, 2974, 3063],
  "maintenance_cost": [2763, 1748, 845, 545, 2291],
  "repairs_cost": [977, 1138, 1298, 1417, 1627],
  "fees_cost": [599, 21, 21, 21, 21],
  "total_cost": [10230, 8057, 7350, 7245, 9281],
  "total_cost_sum": 42164
}
```

### 2.5 Vehicle Images API

**Base URL:** `https://images.vinaudit.com/v3`

| Endpoint | Method | Description | Cost |
|----------|--------|-------------|------|
| `/images?vin={vin}&key={key}&format=html` | GET | Get vehicle image | ~$0.10 |

**Parameters:**
- `pose` - front, front_right, front_left, rear, rear_right, rear_left, side
- `color` - Vehicle color
- `size` - Image dimensions (e.g., 1024x1024)
- `background` - white, transparent, gallery

---

## 3. ClearVin NMVTIS API (Paid - Official NMVTIS Provider)

**Website:** https://www.clearvin.com/en/api-subscribers/
**Pricing:** ~$3.00 per NMVTIS report
**Sign Up:** Contact sales@clearvin.com

ClearVin is an official NMVTIS (National Motor Vehicle Title Information System) data provider authorized by the U.S. Department of Justice.

### 3.1 Authentication

**Endpoint:** `POST https://www.clearvin.com/rest/vendor/login`

**Request Body:**
```json
{
  "email": "your_email@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "status": "ok",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3.2 Get NMVTIS Report

**Endpoint:** `GET https://www.clearvin.com/rest/vendor/report?vin={vin}`

**Headers:**
```
Authorization: Bearer {token}
```

**Example Response:**
```json
{
  "status": "ok",
  "result": {
    "id": "3646F9E2",
    "vin": "WBAFR7C57CC811956",
    "report": {
      "nmvtis": {
        "junkAndSalvageInformation": [
          {
            "ReportingEntityAbstract": {
              "ReportingEntityCategoryCode": "J",
              "ReportingEntityCategoryText": "Junk and Salvage",
              "EntityName": "Copart, Inc.",
              "LocationCityName": "Dallas",
              "LocationStateUSPostalServiceCode": "TX"
            },
            "VehicleObtainedDate": "2016-12-06T00:00:00.000Z",
            "VehicleDispositionText": "SOLD"
          }
        ],
        "titleRecords": [
          {
            "state": "CA",
            "date": "2015-07-01",
            "brand": "Salvage"
          }
        ],
        "vehicleBrands": [
          {
            "code": "11",
            "name": "Salvage",
            "description": "Vehicle has been damaged..."
          }
        ],
        "odometerReadings": [
          {
            "date": "2016-01-15",
            "mileage": 45000,
            "source": "CA DMV"
          }
        ]
      }
    }
  }
}
```

---

## 4. Vehicle Databases API (Paid)

**Website:** https://vehicledatabases.com
**Documentation:** https://vehicledatabases.com/vehicle-history-api
**Sign Up:** https://vehicledatabases.com/signup

### 4.1 VIN Decode

**Endpoint:** `GET https://api.vehicledatabases.com/v1/vin-decode/{vin}`

**Headers:**
```
Authorization: Bearer {api_key}
Content-Type: application/json
```

### 4.2 Vehicle History

**Endpoint:** `GET https://api.vehicledatabases.com/v1/vehicle-history/{vin}`

### 4.3 Market Value

**Endpoint:** `GET https://api.vehicledatabases.com/v1/market-value/{vin}?mileage={mileage}`

### 4.4 Recalls

**Endpoint:** `GET https://api.vehicledatabases.com/v1/recalls/{vin}`

---

## 5. Auto.dev API (Paid)

**Website:** https://auto.dev
**Documentation:** https://docs.auto.dev
**Pricing:** Tiered based on usage

### 5.1 Recalls by VIN

**Endpoint:** `GET https://api.auto.dev/recalls/{vin}`

**Headers:**
```
Authorization: Bearer {api_key}
Content-Type: application/json
```

**Example Response:**
```json
{
  "data": [
    {
      "manufacturer": "Porsche Cars North America, Inc.",
      "nhtsaCampaignNumber": "21V201000",
      "parkIt": false,
      "parkOutSide": false,
      "overTheAirUpdate": false,
      "reportReceivedDate": "24/03/2021",
      "component": "SUSPENSION:REAR",
      "summary": "The screw connection on the rear axle...",
      "consequence": "A loose connection may fail...",
      "remedy": "Dealers will rework and tighten...",
      "modelYear": "2019",
      "make": "PORSCHE",
      "model": "911"
    }
  ]
}
```

---

## 6. Additional Data Sources

### 6.1 Kelley Blue Book (Enterprise Only)

**Contact:** https://b2b.kbb.com/contact/
**Base URL:** `https://developer.kbb.com/`

KBB provides enterprise API access for:
- Vehicle pricing and values
- Cost to own calculations
- Expert ratings
- Vehicle specs

### 6.2 Black Book (Enterprise Only)

**Website:** https://www.blackbook.com/
**Contact:** Sales inquiry required

### 6.3 CARFAX (Enterprise Partners)

**Website:** https://www.carfaxforlife.com/
**API Access:** Partnership required

---

## API Cost Summary

| Provider | Service | Approx. Cost |
|----------|---------|--------------|
| NHTSA | All services | **FREE** |
| VinAudit | History Report | $2.50/report |
| VinAudit | Specifications | $0.50/lookup |
| VinAudit | Market Value | $0.25/lookup |
| VinAudit | Ownership Cost | $0.25/lookup |
| VinAudit | Images | $0.10/image |
| ClearVin | NMVTIS Report | $3.00/report |
| Vehicle Databases | Full History | $2.00/report |
| Auto.dev | Recalls | $0.05/lookup |

**Estimated cost per full MyAutoWhiz analysis: $5-8**

---

## Rate Limits

| Provider | Rate Limit |
|----------|------------|
| NHTSA | Traffic controlled, no official limit |
| VinAudit | Contact for enterprise limits |
| ClearVin | Contact for limits |
| Vehicle Databases | Varies by plan |
| Auto.dev | Varies by plan |

---

## Error Handling

### NHTSA Error Codes
- `0` - VIN decoded clean
- `1` - Check digit (position 9) is incorrect
- `5` - VIN has errors in one or more decoded fields
- `6` - Incomplete VIN
- `7` - Manufacturer not recognized
- `11` - VIN decoding failed

### VinAudit Error Codes
- `invalid vin` - VIN format is incorrect
- `charge_failed` - Payment/credit issue
- `no_data` - No records found for VIN
- `rate_limit` - Too many requests

### ClearVin Error Codes
- `invalid_token` - Authentication failed
- `invalid_vin` - VIN format incorrect
- `no_records` - No NMVTIS data found

---

## Implementation Notes

1. **Always validate VINs** before making API calls to avoid wasted requests
2. **Cache vehicle data** - VIN decodes don't change, cache indefinitely
3. **Cache history reports** - Expire after 24-48 hours
4. **Use NHTSA first** - It's free, use paid APIs only when needed
5. **Implement fallbacks** - If one provider fails, try another
6. **Track API costs** - Log each API call cost for billing purposes
7. **Handle maintenance windows** - NMVTIS has scheduled maintenance (1am-2am ET daily, 2am-5am ET Sundays)
