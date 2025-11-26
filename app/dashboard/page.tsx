'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileSearch,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowRight,
  Car,
  Clock,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { formatDate, formatCurrency, formatRelativeTime } from '@/lib/utils';

interface DashboardStats {
  totalAnalyses: number;
  analysesThisMonth: number;
  savedVehicles: number;
  issuesDetected: number;
  potentialSavings: number;
}

interface RecentAnalysis {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  overallScore: number;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { profile, isLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    analysesThisMonth: 0,
    savedVehicles: 0,
    issuesDetected: 0,
    potentialSavings: 0,
  });
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);

  // Mock data for demo - replace with actual API calls
  useEffect(() => {
    // Simulated data
    setStats({
      totalAnalyses: profile?.total_analyses || 0,
      analysesThisMonth: profile?.analyses_this_month || 0,
      savedVehicles: 3,
      issuesDetected: 12,
      potentialSavings: 2400,
    });

    setRecentAnalyses([
      {
        id: '1',
        vin: '1HGBH41JXMN109186',
        make: 'Honda',
        model: 'Accord',
        year: 2021,
        overallScore: 87,
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        vin: '5YJSA1E26MF123456',
        make: 'Tesla',
        model: 'Model S',
        year: 2022,
        overallScore: 92,
        status: 'completed',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ]);
  }, [profile]);

  const statCards = [
    {
      title: 'Total Analyses',
      value: stats.totalAnalyses,
      icon: FileSearch,
      color: 'text-brand-500',
      bgColor: 'bg-brand-500/10',
    },
    {
      title: 'This Month',
      value: stats.analysesThisMonth,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Issues Found',
      value: stats.issuesDetected,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Est. Savings',
      value: formatCurrency(stats.potentialSavings),
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your vehicle analyses.
          </p>
        </div>
        <Link href="/dashboard/analyze">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Analysis
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/dashboard/analyze" className="block">
          <Card className="h-full hover:border-brand-500/30 transition-colors cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                <Car className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="font-semibold mb-2">Analyze a Vehicle</h3>
              <p className="text-sm text-muted-foreground">
                Get a comprehensive AI analysis of any used car
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/compare" className="block">
          <Card className="h-full hover:border-brand-500/30 transition-colors cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Compare Vehicles</h3>
              <p className="text-sm text-muted-foreground">
                Side-by-side comparison of multiple options
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/calculator" className="block">
          <Card className="h-full hover:border-brand-500/30 transition-colors cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-semibold mb-2">Cost Calculator</h3>
              <p className="text-sm text-muted-foreground">
                Estimate total cost of ownership
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent analyses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Analyses</CardTitle>
          <Link href="/dashboard/reports">
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentAnalyses.length > 0 ? (
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/dashboard/reports/${analysis.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg bg-surface-tertiary/50 hover:bg-surface-tertiary transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-brand-500/10 flex items-center justify-center">
                    <Car className="w-6 h-6 text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">
                      {analysis.year} {analysis.make} {analysis.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      VIN: {analysis.vin.slice(0, 11)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}/100
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(analysis.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-surface-tertiary flex items-center justify-center mx-auto mb-4">
                <FileSearch className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No analyses yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start by analyzing your first vehicle
              </p>
              <Link href="/dashboard/analyze">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Analysis
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips section */}
      <Card className="bg-gradient-to-br from-brand-500/10 to-success/10 border-brand-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Pro Tip: Get the Best Results</h3>
              <p className="text-sm text-muted-foreground">
                For the most accurate analysis, take photos in good lighting from multiple angles: 
                front, back, both sides, all four corners, engine bay, and interior. 
                Record engine sounds for at least 30 seconds while the car is warming up.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
