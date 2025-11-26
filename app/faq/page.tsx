'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  HelpCircle,
  ChevronDown,
  Search,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const faqCategories = [
  {
    name: 'General',
    questions: [
      {
        q: 'What is MyAutoWhiz?',
        a: 'MyAutoWhiz is an AI-powered platform that helps used car buyers make informed decisions. We analyze vehicle photos, engine sounds, and history reports to provide comprehensive condition assessments, market valuations, and negotiation insights.',
      },
      {
        q: 'How accurate is the AI analysis?',
        a: 'Our AI achieves 98% accuracy in detecting common issues like rust, dents, and paint damage. The accuracy improves with higher quality photos and more images. However, we always recommend a professional inspection before finalizing any purchase.',
      },
      {
        q: 'Is MyAutoWhiz free to use?',
        a: 'Yes! We offer a free tier that includes 2 vehicle analyses per month. For unlimited analyses and premium features like detailed history reports and audio analysis, check out our paid plans starting at $19.99/month.',
      },
      {
        q: 'What vehicles can I analyze?',
        a: 'MyAutoWhiz works with all cars, trucks, SUVs, and vans with valid 17-character VINs. We support vehicles from 1980 to present. Motorcycles and specialty vehicles are not currently supported.',
      },
    ],
  },
  {
    name: 'Analysis',
    questions: [
      {
        q: 'How do I analyze a vehicle?',
        a: 'Simply enter the vehicle\'s VIN, upload photos of the vehicle (we recommend 5-10 from different angles), and optionally record the engine sound. Our AI processes everything and delivers a comprehensive report, usually within 2-5 minutes.',
      },
      {
        q: 'What photos should I take?',
        a: 'For best results, take clear photos in good lighting of: all four corners/angles of the exterior, any visible damage or wear, the engine bay, interior (dashboard, seats, carpet), tire treads, and undercarriage if accessible.',
      },
      {
        q: 'How does audio analysis work?',
        a: 'Record 30-60 seconds of the engine running (idle and revving). Our AI analyzes the sound for irregularities like knocking, misfiring, belt squealing, or other mechanical issues that may indicate problems.',
      },
      {
        q: 'What\'s included in the vehicle history report?',
        a: 'Our NMVTIS-sourced reports include: accident history, title issues (salvage, flood, etc.), odometer readings, previous owners, registration history, and any theft records. Premium plans include more detailed reports.',
      },
    ],
  },
  {
    name: 'Reports & Scores',
    questions: [
      {
        q: 'How is the overall score calculated?',
        a: 'The overall score (0-100) is a weighted average of visual condition (40%), mechanical indicators (20%), history (30%), and market factors (10%). Higher scores indicate better overall condition and value.',
      },
      {
        q: 'What do the severity levels mean?',
        a: 'Critical issues require immediate attention and significantly impact safety or value. Major issues need repair soon. Minor issues are cosmetic or can wait. Informational items are just things to be aware of.',
      },
      {
        q: 'Can I download or share my report?',
        a: 'Yes! You can download reports as PDFs, share via link, or print directly from the report page. Pro users can also generate white-label reports for client presentations.',
      },
      {
        q: 'How long are reports stored?',
        a: 'Free accounts retain reports for 30 days. Pro accounts keep reports for 1 year, and Enterprise accounts have unlimited retention. You can also download and keep copies locally.',
      },
    ],
  },
  {
    name: 'Pricing & Plans',
    questions: [
      {
        q: 'What\'s included in the free plan?',
        a: 'Free accounts get 2 vehicle analyses per month, basic visual inspection, VIN decoding, recall check, and market value estimate. History reports and audio analysis require a paid plan.',
      },
      {
        q: 'Can I cancel my subscription anytime?',
        a: 'Yes, you can cancel anytime from your account settings. You\'ll continue to have access to your plan features until the end of your billing period. No cancellation fees.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'We offer a 7-day money-back guarantee on all new subscriptions. If you\'re not satisfied, contact support within 7 days of purchase for a full refund.',
      },
      {
        q: 'Is there a discount for annual billing?',
        a: 'Yes! Annual plans save you 20% compared to monthly billing. For example, our Pro plan is $19.99/month or $191.88/year (equivalent to $15.99/month).',
      },
    ],
  },
  {
    name: 'Account & Privacy',
    questions: [
      {
        q: 'Is my data secure?',
        a: 'Absolutely. We use bank-level encryption (AES-256) for all data at rest and in transit. We never sell your data to third parties. See our Privacy Policy for complete details.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes, you can delete your account at any time from Settings > Account > Delete Account. This permanently removes all your data, reports, and personal information from our systems.',
      },
      {
        q: 'How do I change my password?',
        a: 'Go to Settings > Security > Change Password, or use the "Forgot Password" link on the login page. We recommend using a unique, strong password with at least 8 characters.',
      },
      {
        q: 'Do you share my information with dealers?',
        a: 'Never without your explicit consent. You control all sharing options. If you choose to share a report with a seller, only the specific report is shared, not your personal information.',
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-primary/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl">MyAutoWhiz</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
            <HelpCircle className="w-4 h-4 text-brand-500" />
            <span className="text-sm text-brand-400">Help Center</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Frequently Asked Questions
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to common questions about MyAutoWhiz
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No results found for &quot;{searchQuery}&quot;
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((category) => (
                <div key={category.name}>
                  <h2 className="text-2xl font-display font-bold mb-6">
                    {category.name}
                  </h2>
                  <div className="space-y-3">
                    {category.questions.map((item, index) => {
                      const itemId = `${category.name}-${index}`;
                      const isOpen = openItems.includes(itemId);
                      
                      return (
                        <div
                          key={index}
                          className="border border-white/10 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(itemId)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                          >
                            <span className="font-medium pr-4">{item.q}</span>
                            <ChevronDown
                              className={cn(
                                'w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform',
                                isOpen && 'rotate-180'
                              )}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 text-muted-foreground">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20 px-4 bg-surface-secondary/50">
        <div className="container mx-auto max-w-4xl text-center">
          <MessageSquare className="w-12 h-12 text-brand-500 mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg">
                Contact Support
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard/help">
              <Button variant="outline" size="lg">
                Visit Help Center
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold">MyAutoWhiz</span>
            </Link>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MyAutoWhiz. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
