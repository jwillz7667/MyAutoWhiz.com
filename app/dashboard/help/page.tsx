'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  Camera,
  Mic,
  FileSearch,
  CreditCard,
  Settings,
  Shield,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  Mail,
  FileText,
  Video,
  Book,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Car,
  DollarSign,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const categories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Book,
    description: 'Learn the basics of MyAutoWhiz',
    articles: [
      {
        title: 'How to create your first vehicle analysis',
        content: 'To analyze a vehicle, navigate to Dashboard > New Analysis, enter the VIN, upload photos, and optionally record engine sounds. Our AI will process everything and generate a comprehensive report within minutes.',
      },
      {
        title: 'Where to find the VIN on a vehicle',
        content: 'The VIN (Vehicle Identification Number) is a 17-character code found on the dashboard (visible through the windshield), the driver\'s side door jamb, vehicle registration, and insurance documents.',
      },
      {
        title: 'Understanding your analysis report',
        content: 'Your report includes an overall score (0-100), individual component scores, detected issues with severity ratings, market value estimates, and negotiation points. Higher scores indicate better condition.',
      },
      {
        title: 'Free vs. paid features',
        content: 'Free accounts get 2 analyses per month with basic features. Paid plans unlock unlimited analyses, premium history reports, priority processing, and advanced AI features.',
      },
    ],
  },
  {
    id: 'visual-analysis',
    title: 'Visual Analysis',
    icon: Camera,
    description: 'Tips for better photo analysis',
    articles: [
      {
        title: 'Best practices for taking vehicle photos',
        content: 'Take photos in good lighting (natural daylight is best). Capture all four corners, close-ups of any damage, the engine bay, interior, and undercarriage if possible. Upload at least 5-10 photos for best results.',
      },
      {
        title: 'What our AI can detect in photos',
        content: 'Our AI detects rust, dents, scratches, paint damage, resprays, tire wear, interior wear, flood damage indicators, and more. It uses computer vision trained on millions of vehicle images.',
      },
      {
        title: 'Photo quality requirements',
        content: 'Photos should be clear, well-lit, and at least 1080p resolution. Avoid blurry images, extreme angles, or photos with excessive glare. Each photo can be up to 10MB.',
      },
      {
        title: 'Understanding visual inspection scores',
        content: 'Visual scores are broken down by area: exterior, interior, engine bay, and tires. Each area receives a score based on detected issues, with severity weighting applied.',
      },
    ],
  },
  {
    id: 'audio-analysis',
    title: 'Audio Analysis',
    icon: Mic,
    description: 'Engine sound recording tips',
    articles: [
      {
        title: 'How to record engine sounds',
        content: 'Record the engine at idle for 30 seconds, then during gentle acceleration. Position your phone near the engine bay but not touching anything hot. Record in a quiet environment for best results.',
      },
      {
        title: 'What engine sounds we analyze',
        content: 'Our AI listens for knocking, ticking, grinding, squealing, and irregular rhythms. It can detect potential issues with bearings, belts, exhaust, and internal engine components.',
      },
      {
        title: 'Audio file requirements',
        content: 'Audio files should be at least 30 seconds long. Supported formats: MP3, WAV, M4A, AAC. Maximum file size: 50MB per file. You can upload up to 5 audio files.',
      },
      {
        title: 'Interpreting audio analysis results',
        content: 'Results include detected sound anomalies with confidence levels, potential causes, and severity ratings. Green indicates normal, yellow suggests monitoring, red indicates potential issues.',
      },
    ],
  },
  {
    id: 'history-reports',
    title: 'Vehicle History',
    icon: FileSearch,
    description: 'Understanding history reports',
    articles: [
      {
        title: 'What\'s included in a history report',
        content: 'Reports include accident history, title records (salvage, flood, etc.), ownership count, odometer readings, lien records, theft records, and recall information from official NMVTIS data.',
      },
      {
        title: 'Data sources we use',
        content: 'We aggregate data from NMVTIS (National Motor Vehicle Title Information System), NHTSA (safety/recalls), insurance company records, and state DMV databases.',
      },
      {
        title: 'Limitations of history reports',
        content: 'History reports may not include unreported accidents, damage from recent events (takes time to appear in databases), or issues from vehicles previously registered outside the US.',
      },
      {
        title: 'Checking for open recalls',
        content: 'We automatically check NHTSA for open safety recalls. If recalls are found, we provide details and instructions for getting them fixed (usually free at dealerships).',
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & Subscriptions',
    icon: CreditCard,
    description: 'Payment and plan information',
    articles: [
      {
        title: 'Available subscription plans',
        content: 'We offer monthly and annual plans. The Starter plan includes 10 analyses/month, Pro includes 50/month, and Enterprise offers unlimited. Annual plans save up to 20%.',
      },
      {
        title: 'How to upgrade or downgrade',
        content: 'Go to Settings > Subscription to change your plan. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period.',
      },
      {
        title: 'Cancellation and refund policy',
        content: 'Cancel anytime in Settings > Subscription. You retain access until the end of your billing period. Refunds are available within 7 days of purchase or 14 days for annual plans.',
      },
      {
        title: 'Payment methods accepted',
        content: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and Apple Pay. Payments are processed securely through Stripe.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account Settings',
    icon: Settings,
    description: 'Managing your account',
    articles: [
      {
        title: 'Updating your profile',
        content: 'Go to Settings > Profile to update your name, email, phone number, and notification preferences. You can also upload a profile photo.',
      },
      {
        title: 'Changing your password',
        content: 'Go to Settings > Security to change your password. For security, you\'ll need to verify your current password before setting a new one.',
      },
      {
        title: 'Enabling two-factor authentication',
        content: 'Add an extra layer of security by enabling 2FA in Settings > Security. We support authenticator apps and SMS verification.',
      },
      {
        title: 'Deleting your account',
        content: 'To delete your account, go to Settings > Account > Delete Account. This permanently removes all your data and cannot be undone. Active subscriptions will be cancelled.',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: Shield,
    description: 'Keeping your data safe',
    articles: [
      {
        title: 'How we protect your data',
        content: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use secure cloud infrastructure, regular security audits, and strict access controls.',
      },
      {
        title: 'Photo and audio data retention',
        content: 'Photos and audio files are retained for 30 days to generate reports, then automatically deleted. You can request immediate deletion at any time.',
      },
      {
        title: 'Exporting your data',
        content: 'You can export all your data (reports, saved vehicles, account info) in Settings > Privacy > Export Data. We\'ll email you a download link within 24 hours.',
      },
      {
        title: 'Third-party data sharing',
        content: 'We share VINs with data providers (VinAudit, ClearVin) to generate history reports. We never sell personal information. See our Privacy Policy for details.',
      },
    ],
  },
];

const quickTips = [
  {
    icon: Lightbulb,
    title: 'Pro Tip: Timing',
    description: 'Visit dealerships mid-week for more attention from salespeople and potentially better deals.',
  },
  {
    icon: CheckCircle2,
    title: 'Always Verify',
    description: 'Cross-reference our analysis with a trusted mechanic inspection for major purchases.',
  },
  {
    icon: AlertTriangle,
    title: 'Red Flags',
    description: 'Be wary of sellers who refuse to provide the VIN or won\'t allow independent inspection.',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('getting-started');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const filteredCategories = categories.map((category) => ({
    ...category,
    articles: category.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.articles.length > 0 || searchQuery === '');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">Find answers and learn how to get the most out of MyAutoWhiz</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="hover:border-brand-500/30 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <h3 className="font-medium">Contact Support</h3>
              <p className="text-sm text-muted-foreground">Get help from our team</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-brand-500/30 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-medium">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">Watch step-by-step guides</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-brand-500/30 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="font-medium">API Documentation</h3>
              <p className="text-sm text-muted-foreground">For developers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - FAQ Categories */}
        <div className="lg:col-span-2 space-y-4">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                className="w-full"
              >
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                    <category.icon className="w-5 h-5 text-brand-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-muted-foreground transition-transform',
                      expandedCategory === category.id && 'rotate-180'
                    )}
                  />
                </CardHeader>
              </button>

              {expandedCategory === category.id && (
                <CardContent className="pt-0 pb-4">
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    {category.articles.map((article, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-surface-tertiary/50"
                      >
                        <button
                          onClick={() =>
                            setExpandedArticle(
                              expandedArticle === `${category.id}-${index}`
                                ? null
                                : `${category.id}-${index}`
                            )
                          }
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-surface-tertiary transition-colors rounded-lg"
                        >
                          <span className="font-medium text-sm">{article.title}</span>
                          <ChevronRight
                            className={cn(
                              'w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-2',
                              expandedArticle === `${category.id}-${index}` && 'rotate-90'
                            )}
                          />
                        </button>
                        {expandedArticle === `${category.id}-${index}` && (
                          <div className="px-3 pb-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {article.content}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {filteredCategories.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We couldn&apos;t find any articles matching &quot;{searchQuery}&quot;
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickTips.map((tip, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-4 h-4 text-brand-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="bg-gradient-to-br from-brand-500/10 to-transparent border-brand-500/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Still need help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is here to help you with any questions.
              </p>
              <div className="space-y-3">
                <Link href="/contact">
                  <Button className="w-full" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Average response time: 4 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                'How to create your first vehicle analysis',
                'Best practices for taking vehicle photos',
                'Understanding your analysis report',
                'Checking for open recalls',
              ].map((article, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-2 p-2 text-sm text-left hover:bg-surface-tertiary rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="line-clamp-1">{article}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
