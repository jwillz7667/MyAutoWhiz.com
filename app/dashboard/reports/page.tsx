'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSearch,
  Car,
  Clock,
  Filter,
  Search,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  MoreVertical,
  Trash2,
  Download,
  Share2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatRelativeTime, formatCurrency } from '@/lib/utils';

interface Analysis {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  overallScore: number;
  status: 'completed' | 'processing' | 'failed';
  issueCount: number;
  estimatedValue?: number;
  createdAt: string;
}

// Demo data
const demoAnalyses: Analysis[] = [
  {
    id: '1',
    vin: '1HGBH41JXMN109186',
    year: 2021,
    make: 'Honda',
    model: 'Accord',
    trim: 'EX-L',
    overallScore: 87,
    status: 'completed',
    issueCount: 3,
    estimatedValue: 26500,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    vin: '5YJSA1E26MF123456',
    year: 2022,
    make: 'Tesla',
    model: 'Model S',
    trim: 'Long Range',
    overallScore: 92,
    status: 'completed',
    issueCount: 1,
    estimatedValue: 78000,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    vin: '2T1BURHE5JC123456',
    year: 2020,
    make: 'Toyota',
    model: 'Corolla',
    trim: 'SE',
    overallScore: 0,
    status: 'processing',
    issueCount: 0,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '4',
    vin: 'WVWZZZ3CZWE123456',
    year: 2019,
    make: 'Volkswagen',
    model: 'Golf',
    trim: 'GTI',
    overallScore: 72,
    status: 'completed',
    issueCount: 5,
    estimatedValue: 22000,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

export default function ReportsPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAnalyses(demoAnalyses);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch =
      searchQuery === '' ||
      `${analysis.year} ${analysis.make} ${analysis.model} ${analysis.vin}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || analysis.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-success/20';
    if (score >= 60) return 'bg-warning/20';
    return 'bg-error/20';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">My Reports</h1>
          <p className="text-muted-foreground mt-1">View and manage your vehicle analyses</p>
        </div>

        {/* Filters - Stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by make, model, or VIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-input bg-surface-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : filteredAnalyses.length > 0 ? (
        <div className="space-y-3">
          {filteredAnalyses.map((analysis) => (
            <Card key={analysis.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Main content */}
                <Link
                  href={`/dashboard/reports/${analysis.id}`}
                  className="flex-1 p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Score circle - hidden on mobile, show badge instead */}
                    <div className="hidden sm:flex flex-shrink-0">
                      {analysis.status === 'completed' ? (
                        <div
                          className={cn(
                            'w-14 h-14 rounded-full flex items-center justify-center',
                            getScoreBg(analysis.overallScore)
                          )}
                        >
                          <span className={cn('text-lg font-bold', getScoreColor(analysis.overallScore))}>
                            {analysis.overallScore}
                          </span>
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-surface-tertiary flex items-center justify-center">
                          {getStatusIcon(analysis.status)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold truncate">
                            {analysis.year} {analysis.make} {analysis.model}
                          </h3>
                          {analysis.trim && (
                            <p className="text-sm text-muted-foreground">{analysis.trim}</p>
                          )}
                        </div>
                        {/* Mobile score badge */}
                        <div className="sm:hidden flex-shrink-0">
                          {analysis.status === 'completed' ? (
                            <span
                              className={cn(
                                'px-2 py-1 rounded-full text-sm font-bold',
                                getScoreBg(analysis.overallScore),
                                getScoreColor(analysis.overallScore)
                              )}
                            >
                              {analysis.overallScore}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              {getStatusIcon(analysis.status)}
                              {analysis.status === 'processing' ? 'Processing' : 'Failed'}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        VIN: {analysis.vin.slice(0, 11)}...
                      </p>

                      {/* Stats row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
                        {analysis.status === 'completed' && (
                          <>
                            {analysis.issueCount > 0 && (
                              <span className="flex items-center gap-1 text-warning">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {analysis.issueCount} issue{analysis.issueCount !== 1 ? 's' : ''}
                              </span>
                            )}
                            {analysis.estimatedValue && (
                              <span className="text-muted-foreground">
                                Value: {formatCurrency(analysis.estimatedValue)}
                              </span>
                            )}
                          </>
                        )}
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {formatRelativeTime(analysis.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Desktop arrow */}
                    <ChevronRight className="hidden sm:block w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Link>

                {/* Actions menu */}
                <div className="relative flex sm:flex-col border-t sm:border-t-0 sm:border-l border-white/10">
                  <button
                    onClick={() => setActiveMenu(activeMenu === analysis.id ? null : analysis.id)}
                    className="flex-1 sm:flex-none p-3 sm:p-4 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors flex items-center justify-center sm:justify-start gap-2"
                  >
                    <MoreVertical className="w-5 h-5" />
                    <span className="sm:hidden text-sm">Actions</span>
                  </button>

                  {/* Dropdown */}
                  {activeMenu === analysis.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveMenu(null)}
                      />
                      <div className="absolute right-0 sm:right-auto sm:left-full top-full sm:top-0 z-20 w-48 bg-surface-secondary border border-white/10 rounded-lg shadow-xl overflow-hidden">
                        <button className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Download PDF
                        </button>
                        <button className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 flex items-center gap-2">
                          <Share2 className="w-4 h-4" />
                          Share Report
                        </button>
                        <button className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 flex items-center gap-2 text-error">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-surface-tertiary/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <FileSearch className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'No reports match your search criteria. Try adjusting your filters.'
                : "You haven't analyzed any vehicles yet. Start by analyzing your first vehicle."}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link href="/dashboard/analyze">
                <Button>Analyze a Vehicle</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
