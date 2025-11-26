'use client';

import Link from 'next/link';
import {
  Car,
  Target,
  Heart,
  Lightbulb,
  Users,
  Award,
  Globe,
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
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
            <Link href="/about" className="text-brand-500 font-medium">
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
            <Heart className="w-4 h-4 text-brand-500" />
            <span className="text-sm text-brand-400">Our Story</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            Empowering Car Buyers with{' '}
            <span className="gradient-text">AI Technology</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We believe everyone deserves to make informed decisions when buying a used car. 
            That&apos;s why we built MyAutoWhiz.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 px-4 bg-surface-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">
                Why We Started
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  In 2023, our founder bought what seemed like a perfect used car. 
                  Three months later, it needed $4,000 in repairs that could have been 
                  detected with a proper inspection.
                </p>
                <p>
                  Professional inspections cost $150-300 and aren&apos;t always available. 
                  Most buyers rely on gut feeling and whatever the seller tells them.
                </p>
                <p>
                  We knew there had to be a better way. Using advances in AI and machine 
                  learning, we built a tool that puts professional-grade analysis in 
                  everyone&apos;s pocket.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-500/20 to-success/20 flex items-center justify-center">
                <Lightbulb className="w-32 h-32 text-brand-500/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Our Mission & Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-brand-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-surface-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-brand-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We&apos;re not just another vehicle history service
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {differentiators.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-brand-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-20 px-4 bg-surface-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Trusted Data Sources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We pull data from official and verified sources
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {dataSources.map((source) => (
              <div
                key={source.name}
                className="p-6 rounded-xl bg-surface-tertiary/50 text-center"
              >
                <div className="text-lg font-semibold mb-1">{source.name}</div>
                <div className="text-sm text-muted-foreground">{source.type}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Join the Movement
          </h2>
          <p className="text-muted-foreground mb-8">
            Thousands of smart car buyers are already using MyAutoWhiz. 
            Start your journey to confident car buying today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold">MyAutoWhiz</span>
            </div>
            
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

const values = [
  {
    icon: Target,
    title: 'Transparency',
    description: 'We believe in complete honesty. Our reports show everything — the good and the bad.',
  },
  {
    icon: Shield,
    title: 'Trust',
    description: 'Your data is sacred. We never sell personal information or compromise on security.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We continuously improve our AI to provide the most accurate analysis possible.',
  },
];

const stats = [
  { value: '50,000+', label: 'Vehicles Analyzed' },
  { value: '$12M+', label: 'Saved by Users' },
  { value: '98.5%', label: 'Accuracy Rate' },
  { value: '4.9★', label: 'User Rating' },
];

const differentiators = [
  {
    icon: Car,
    title: 'AI Visual Analysis',
    description: 'We\'re the only platform that uses AI to analyze photos for damage, rust, and wear.',
  },
  {
    icon: Zap,
    title: 'Real-Time Results',
    description: 'Get comprehensive reports in minutes, not days. Perfect for dealership visits.',
  },
  {
    icon: Award,
    title: 'Negotiation Intelligence',
    description: 'We don\'t just find problems — we help you use them to negotiate a better price.',
  },
  {
    icon: Globe,
    title: 'Mobile-First Design',
    description: 'Our PWA works perfectly on your phone, right when you need it most.',
  },
];

const dataSources = [
  { name: 'NHTSA', type: 'Safety & Recalls' },
  { name: 'NMVTIS', type: 'Title History' },
  { name: 'VinAudit', type: 'Vehicle Data' },
  { name: 'ClearVin', type: 'History Reports' },
];
