'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Car,
  Camera,
  Mic,
  FileSearch,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Gauge,
  Fuel,
  Calendar,
  DollarSign,
  Download,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatNumber, formatDate } from '@/lib/utils';

interface Issue {
  id: string;
  category: 'visual' | 'audio' | 'history' | 'mechanical' | 'safety';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  estimatedCost?: number;
  location?: string;
}

interface AnalysisDetail {
  id: string;
  vin: string;
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim: string;
    engine: string;
    transmission: string;
    drivetrain: string;
    fuelType: string;
    mileage: number;
    exteriorColor: string;
    interiorColor: string;
  };
  scores: {
    overall: number;
    visual: number;
    audio: number;
    history: number;
    safety: number;
  };
  marketValue: {
    low: number;
    mid: number;
    high: number;
  };
  askingPrice?: number;
  issues: Issue[];
  recalls: Array<{
    id: string;
    component: string;
    summary: string;
    remedy: string;
    isOpen: boolean;
  }>;
  historyHighlights: {
    owners: number;
    accidents: number;
    titleStatus: string;
    lastServiceDate?: string;
  };
  recommendation: 'recommended' | 'conditional' | 'not_recommended';
  negotiationPoints: string[];
  summary: string;
  createdAt: string;
}

// Demo data
const demoAnalysis: AnalysisDetail = {
  id: '1',
  vin: '1HGBH41JXMN109186',
  vehicle: {
    year: 2021,
    make: 'Honda',
    model: 'Accord',
    trim: 'EX-L',
    engine: '1.5L Turbo I4',
    transmission: 'CVT',
    drivetrain: 'FWD',
    fuelType: 'Gasoline',
    mileage: 35420,
    exteriorColor: 'Crystal Black Pearl',
    interiorColor: 'Black Leather',
  },
  scores: {
    overall: 87,
    visual: 92,
    audio: 88,
    history: 85,
    safety: 95,
  },
  marketValue: {
    low: 24500,
    mid: 26500,
    high: 28500,
  },
  askingPrice: 27000,
  issues: [
    {
      id: '1',
      category: 'visual',
      severity: 'low',
      title: 'Minor paint chip on front bumper',
      description: 'Small paint chip approximately 5mm in diameter on the lower front bumper. Common road debris damage.',
      estimatedCost: 150,
      location: 'Front bumper, lower left',
    },
    {
      id: '2',
      category: 'visual',
      severity: 'medium',
      title: 'Curb rash on right rear wheel',
      description: 'Cosmetic damage to the alloy wheel rim from curb contact. Does not affect tire seal or safety.',
      estimatedCost: 200,
      location: 'Right rear wheel',
    },
    {
      id: '3',
      category: 'history',
      severity: 'low',
      title: 'One previous owner',
      description: 'Vehicle has had one previous owner. Clean title with no accidents reported.',
    },
  ],
  recalls: [
    {
      id: 'r1',
      component: 'Fuel Pump',
      summary: 'The fuel pump may fail, causing the engine to stall while driving.',
      remedy: 'Dealers will replace the fuel pump, free of charge.',
      isOpen: true,
    },
  ],
  historyHighlights: {
    owners: 1,
    accidents: 0,
    titleStatus: 'Clean',
    lastServiceDate: '2024-01-15',
  },
  recommendation: 'recommended',
  negotiationPoints: [
    'Open recall that needs to be addressed - use this as leverage',
    'Minor cosmetic issues totaling ~$350 in repairs',
    'Asking price is slightly above market mid-point',
    'Request service records from dealer',
  ],
  summary: 'This 2021 Honda Accord EX-L is in excellent overall condition with minor cosmetic wear consistent with normal use. The vehicle has a clean history with one owner and no accidents. There is one open recall for the fuel pump that should be addressed before purchase. The asking price of $27,000 is slightly above the market average of $26,500, giving you room to negotiate.',
  createdAt: new Date(Date.now() - 86400000).toISOString(),
};

export default function ReportDetailPage() {
  const params = useParams();
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    issues: true,
    recalls: true,
    history: false,
    specs: false,
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAnalysis(demoAnalysis);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return 'stroke-success';
    if (score >= 60) return 'stroke-warning';
    return 'stroke-error';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-error/20 text-error border-error/30';
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/30';
      default:
        return 'bg-success/20 text-success border-success/30';
    }
  };

  const getRecommendationConfig = (rec: string) => {
    switch (rec) {
      case 'recommended':
        return {
          icon: CheckCircle2,
          text: 'Recommended',
          color: 'text-success',
          bg: 'bg-success/10 border-success/20',
        };
      case 'conditional':
        return {
          icon: AlertTriangle,
          text: 'Conditional',
          color: 'text-warning',
          bg: 'bg-warning/10 border-warning/20',
        };
      default:
        return {
          icon: XCircle,
          text: 'Not Recommended',
          color: 'text-error',
          bg: 'bg-error/10 border-error/20',
        };
    }
  };

  if (isLoading || !analysis) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const recommendation = getRecommendationConfig(analysis.recommendation);
  const RecommendationIcon = recommendation.icon;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Back button */}
      <Link
        href="/dashboard/reports"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            {analysis.vehicle.year} {analysis.vehicle.make} {analysis.vehicle.model}
          </h1>
          <p className="text-muted-foreground">{analysis.vehicle.trim}</p>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            VIN: {analysis.vin}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Download</span> PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Score overview - Scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-4 min-w-max md:min-w-0 md:grid md:grid-cols-5">
          {[
            { label: 'Overall', score: analysis.scores.overall, icon: Car },
            { label: 'Visual', score: analysis.scores.visual, icon: Camera },
            { label: 'Audio', score: analysis.scores.audio, icon: Mic },
            { label: 'History', score: analysis.scores.history, icon: FileSearch },
            { label: 'Safety', score: analysis.scores.safety, icon: Shield },
          ].map((item) => (
            <Card key={item.label} className="min-w-[120px] md:min-w-0">
              <CardContent className="p-4 text-center">
                <div className="relative inline-flex items-center justify-center mb-2">
                  <svg className="w-16 h-16 -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-surface-tertiary"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${(item.score / 100) * 176} 176`}
                      strokeLinecap="round"
                      className={getScoreRingColor(item.score)}
                    />
                  </svg>
                  <span className={cn('absolute text-lg font-bold', getScoreColor(item.score))}>
                    {item.score}
                  </span>
                </div>
                <p className="text-sm font-medium">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommendation & Value */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Buy Recommendation */}
        <Card className={cn('border', recommendation.bg)}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-3">
              <RecommendationIcon className={cn('w-8 h-8', recommendation.color)} />
              <div>
                <p className="text-sm text-muted-foreground">Buy Recommendation</p>
                <p className={cn('text-xl font-bold', recommendation.color)}>
                  {recommendation.text}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{analysis.summary}</p>
          </CardContent>
        </Card>

        {/* Market Value */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-success" />
              <p className="font-medium">Market Value</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Low</span>
              <span className="text-sm text-muted-foreground">High</span>
            </div>
            <div className="relative h-2 bg-surface-tertiary rounded-full mb-2">
              <div
                className="absolute h-full bg-gradient-to-r from-error via-warning to-success rounded-full"
                style={{ width: '100%' }}
              />
              {analysis.askingPrice && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-brand-500 shadow-lg"
                  style={{
                    left: `${Math.min(100, Math.max(0, ((analysis.askingPrice - analysis.marketValue.low) / (analysis.marketValue.high - analysis.marketValue.low)) * 100))}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>{formatCurrency(analysis.marketValue.low)}</span>
              <span className="font-bold text-brand-500">
                {formatCurrency(analysis.marketValue.mid)}
              </span>
              <span>{formatCurrency(analysis.marketValue.high)}</span>
            </div>
            {analysis.askingPrice && (
              <p className="text-center text-sm mt-2">
                Asking: <span className="font-bold">{formatCurrency(analysis.askingPrice)}</span>
                {analysis.askingPrice > analysis.marketValue.mid && (
                  <span className="text-warning ml-1">
                    ({formatCurrency(analysis.askingPrice - analysis.marketValue.mid)} above market)
                  </span>
                )}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Issues */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('issues')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <CardTitle className="text-lg">
                Issues Detected ({analysis.issues.length})
              </CardTitle>
            </div>
            {expandedSections.issues ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.issues && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              {analysis.issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 bg-surface-tertiary/50 rounded-lg"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium">{issue.title}</h4>
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full border capitalize',
                        getSeverityColor(issue.severity)
                      )}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {issue.location && (
                      <span className="text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 inline mr-1" />
                        {issue.location}
                      </span>
                    )}
                    {issue.estimatedCost && (
                      <span className="text-warning">
                        Est. repair: {formatCurrency(issue.estimatedCost)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Recalls */}
      {analysis.recalls.length > 0 && (
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection('recalls')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-error" />
                <CardTitle className="text-lg">
                  Open Recalls ({analysis.recalls.filter((r) => r.isOpen).length})
                </CardTitle>
              </div>
              {expandedSections.recalls ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {expandedSections.recalls && (
            <CardContent className="pt-0">
              <div className="space-y-3">
                {analysis.recalls.map((recall) => (
                  <div
                    key={recall.id}
                    className={cn(
                      'p-4 rounded-lg border',
                      recall.isOpen
                        ? 'bg-error/10 border-error/20'
                        : 'bg-surface-tertiary/50 border-white/10'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium">{recall.component}</h4>
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full',
                          recall.isOpen ? 'bg-error/20 text-error' : 'bg-success/20 text-success'
                        )}
                      >
                        {recall.isOpen ? 'Open' : 'Completed'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{recall.summary}</p>
                    <p className="text-sm">
                      <strong>Remedy:</strong> {recall.remedy}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Negotiation Points */}
      <Card className="bg-gradient-to-br from-brand-500/5 to-success/5 border-brand-500/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-brand-500" />
            Negotiation Points
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {analysis.negotiationPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Vehicle Specs - Collapsible */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('specs')}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="w-5 h-5" />
              Vehicle Specifications
            </CardTitle>
            {expandedSections.specs ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.specs && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Engine', value: analysis.vehicle.engine },
                { label: 'Transmission', value: analysis.vehicle.transmission },
                { label: 'Drivetrain', value: analysis.vehicle.drivetrain },
                { label: 'Fuel Type', value: analysis.vehicle.fuelType },
                { label: 'Mileage', value: formatNumber(analysis.vehicle.mileage) + ' mi' },
                { label: 'Exterior', value: analysis.vehicle.exteriorColor },
                { label: 'Interior', value: analysis.vehicle.interiorColor },
              ].map((spec) => (
                <div key={spec.label}>
                  <p className="text-xs text-muted-foreground">{spec.label}</p>
                  <p className="font-medium">{spec.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Mobile sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-primary/95 backdrop-blur-xl border-t border-white/10 md:hidden">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
