# MyAutoWhiz.com

<p align="center">
  <img src="public/logo.svg" alt="MyAutoWhiz Logo" width="200">
</p>

<p align="center">
  <strong>Enterprise-Grade AI-Powered Vehicle Analysis Platform</strong>
</p>

<p align="center">
  AI Visual Inspection • Engine Sound Analysis • Complete Vehicle History • Market Valuations
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-integrations">APIs</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 🚀 Overview

**MyAutoWhiz** is a comprehensive Progressive Web App (PWA) that leverages advanced AI and third-party data sources to help prospective used vehicle buyers make informed purchasing decisions. The platform provides:

1. **AI Visual Analysis** - Upload vehicle photos for automated damage detection, wear assessment, and condition evaluation
2. **AI Audio Analysis** - Record/upload engine sounds to detect mechanical issues like knocks, squeals, and misfires
3. **Vehicle History Reports** - Complete NMVTIS-sourced history including accidents, title status, ownership, and service records
4. **Market Valuations** - Real-time market value estimates based on condition, mileage, and location
5. **Recall Alerts** - Comprehensive safety recall information from NHTSA

## ✨ Features

### Core Analysis Features
- **VIN Decoding** - Instant vehicle identification with 130+ data points
- **Visual AI** - Detect paint damage, rust, dents, tire wear, and interior condition
- **Audio AI** - Identify engine knock, belt squeal, exhaust leaks, and transmission issues
- **History Reports** - Accidents, title brands, ownership, odometer, salvage records
- **Market Value** - Trade-in, private party, and dealer retail valuations
- **Safety Scores** - NHTSA crash test ratings and rollover risk

### Platform Features
- **OAuth Authentication** - Sign in with Google, Apple, Facebook, or GitHub
- **Subscription Tiers** - Free, Starter, Pro, and Enterprise plans
- **Team Support** - Multi-user organizations for dealerships
- **API Access** - RESTful API for enterprise integrations
- **White Labeling** - Custom branding for enterprise customers
- **PDF Reports** - Downloadable professional analysis reports
- **Push Notifications** - Real-time alerts for analysis completion
- **Offline Support** - PWA with service worker caching

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PWA**: next-pwa

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (OAuth + Email)
- **Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions
- **Real-time**: Supabase Realtime

### Third-Party APIs
| API Provider | Data | Cost | Documentation |
|--------------|------|------|---------------|
| NHTSA vPIC | VIN Decoding, Recalls, Safety Ratings | **FREE** | [docs](https://vpic.nhtsa.dot.gov/api/) |
| VinAudit | Vehicle History, Market Value, Specs | ~$0.50-3/report | [docs](https://www.vinaudit.com/vehicle-history-api) |
| ClearVin | NMVTIS Official Reports | ~$3/report | [docs](https://www.clearvin.com/en/api-subscribers/) |
| Vehicle Databases | VIN Decode, History, Values | Variable | [docs](https://vehicledatabases.com) |
| Auto.dev | Recalls by VIN, Specs | Variable | [docs](https://docs.auto.dev) |

### Payments
- **Stripe** - Subscriptions and one-time payments

### AI/ML
- **OpenAI GPT-4V** - Visual analysis
- **OpenAI Whisper** - Audio transcription
- **Custom Models** - Engine sound classification (via Replicate)

## 📦 Project Structure

```
myautowhiz/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication routes
│   ├── (dashboard)/         # Protected dashboard routes
│   ├── api/                 # API route handlers
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── analysis/            # Analysis-specific components
│   └── dashboard/           # Dashboard components
├── lib/                     # Utility libraries
│   ├── api/                 # Third-party API clients
│   │   └── vehicle-apis.ts  # All vehicle data APIs
│   ├── supabase/           # Supabase clients
│   │   ├── client.ts       # Browser/server clients
│   │   └── auth.ts         # Auth utilities
│   └── utils/              # Helper functions
├── database/               # Database schema
│   └── schema.sql          # Complete Supabase schema
├── types/                  # TypeScript types
│   └── database.ts         # Generated DB types
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
└── styles/                 # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (for payments)
- API keys for vehicle data providers

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/myautowhiz.git
cd myautowhiz
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. **Set up Supabase**
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run database migrations
supabase db push
```

Or manually run `database/schema.sql` in Supabase SQL Editor.

5. **Configure OAuth Providers**

In Supabase Dashboard → Authentication → Providers:
- Enable Google OAuth with your credentials
- Enable Apple Sign In with your credentials
- (Optional) Enable GitHub, Facebook

6. **Start development server**
```bash
npm run dev
```

7. **Open the app**
```
http://localhost:3000
```

## 🔌 API Integrations

### NHTSA API (FREE)

No authentication required. Use directly:

```typescript
import { decodeVinNHTSA, getRecallsNHTSA, getSafetyRatingsNHTSA } from '@/lib/api/vehicle-apis';

// Decode a VIN
const vehicleInfo = await decodeVinNHTSA('1HGBH41JXMN109186');

// Get recalls
const recalls = await getRecallsNHTSA('Honda', 'Accord', 2022);

// Get safety ratings
const ratings = await getSafetyRatingsNHTSA(2022, 'Honda', 'Accord');
```

### VinAudit API

Requires API key from [vinaudit.com](https://www.vinaudit.com/api):

```typescript
import { getVehicleHistoryVinAudit, getMarketValueVinAudit } from '@/lib/api/vehicle-apis';

// Get vehicle history
const history = await getVehicleHistoryVinAudit(
  vin,
  process.env.VINAUDIT_API_KEY!,
  process.env.VINAUDIT_API_USER!,
  process.env.VINAUDIT_API_PASS!
);

// Get market value
const value = await getMarketValueVinAudit(vin, process.env.VINAUDIT_API_KEY!);
```

### ClearVin NMVTIS API

Official NMVTIS data provider:

```typescript
import { getClearVinReport } from '@/lib/api/vehicle-apis';

const nmvtisReport = await getClearVinReport(
  vin,
  process.env.CLEARVIN_EMAIL!,
  process.env.CLEARVIN_PASSWORD!
);
```

### API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/{vin}` | GET | VIN Decoding |
| `https://api.nhtsa.gov/recalls/recallsByVehicle` | GET | Vehicle Recalls |
| `https://api.nhtsa.gov/SafetyRatings/modelyear/{year}/make/{make}/model/{model}` | GET | Safety Ratings |
| `https://api.vinaudit.com/query.php` | GET | Check VIN data availability |
| `https://api.vinaudit.com/v2/pullreport` | GET | Full vehicle history |
| `https://marketvalue.vinaudit.com/getmarketvalue.php` | GET | Market valuation |
| `https://specifications.vinaudit.com/v3/specifications` | GET | Vehicle specs |
| `https://www.clearvin.com/rest/vendor/report` | GET | NMVTIS report |

## 💾 Database Schema

The Supabase schema includes:

### Core Tables
- `profiles` - Extended user profiles with preferences
- `subscriptions` - User subscription management
- `subscription_plans` - Available pricing tiers
- `vehicles` - Cached vehicle data
- `analyses` - Vehicle analysis records
- `analysis_issues` - Detected issues per analysis
- `analysis_files` - Uploaded images/audio
- `vehicle_history_reports` - Cached history data

### Enterprise Tables
- `organizations` - Multi-user organizations
- `organization_members` - Team member management
- `api_keys` - API access for enterprise users
- `webhooks` - Event notification endpoints

### Supporting Tables
- `notifications` - User notifications
- `activity_logs` - Audit trail
- `payments` - Payment history
- `usage_credits` - Pay-as-you-go credits
- `vehicle_recalls` - Cached recall data
- `safety_ratings` - Cached safety data

All tables have Row Level Security (RLS) policies for data protection.

## 🔐 Authentication

### Supported Providers
- Email/Password (with verification)
- Google OAuth 2.0
- Apple Sign In
- GitHub OAuth
- Facebook OAuth

### Session Management
- Automatic token refresh
- Multi-device session tracking
- Secure session storage

### Role-Based Access
- `user` - Basic access
- `pro` - Pro features
- `enterprise` - API access, white-label
- `admin` - Admin panel access
- `super_admin` - Full system access

## 💳 Subscription Plans

| Plan | Price | Analyses/mo | Features |
|------|-------|-------------|----------|
| Free | $0 | 2 | Visual analysis only |
| Starter | $9.99 | 10 | + Audio + History |
| Pro | $29.99 | 50 | + PDF export, priority support |
| Enterprise | $99.99 | 500 | + API access, white-label, team |

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Environment Variables

Ensure all required environment variables are set in your deployment platform. See `.env.example` for the complete list.

## 📊 API Cost Estimates

Per-report costs when using all features:

| Service | Cost |
|---------|------|
| NHTSA VIN Decode | FREE |
| NHTSA Recalls | FREE |
| NHTSA Safety Ratings | FREE |
| VinAudit History | ~$2.50 |
| VinAudit Market Value | ~$0.25 |
| ClearVin NMVTIS | ~$3.00 |
| OpenAI Vision | ~$0.02-0.05 |
| **Total per full analysis** | **~$5-6** |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Copyright © 2024 MyAutoWhiz. All rights reserved.

## 📞 Support

- **Email**: support@myautowhiz.com
- **Documentation**: https://docs.myautowhiz.com
- **Status**: https://status.myautowhiz.com

---

<p align="center">
  Built with ❤️ for smarter car buying decisions
</p>
