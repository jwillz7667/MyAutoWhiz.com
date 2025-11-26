'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Car,
  Camera,
  Mic,
  FileSearch,
  Shield,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Zap,
  Clock,
  BarChart3,
  AlertTriangle,
  Scale,
  Calculator,
  FileText,
  Bell,
  Smartphone,
  Globe,
  Lock,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function FeaturesPage() {
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
            <Link href="/features" className="text-brand-500 font-medium">
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <Zap className="w-4 h-4 text-brand-500" />
              <span className="text-sm text-brand-400">Comprehensive Analysis Suite</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Every Tool You Need to{' '}
              <span className="gradient-text">Buy Smart</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our AI-powered platform combines visual inspection, sound analysis, 
              and comprehensive history reports to give you complete confidence in your purchase.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 bg-surface-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Core Analysis Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three powerful AI systems work together to analyze every aspect of a vehicle
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Visual Analysis */}
            <Card className="bg-gradient-to-br from-brand-500/10 to-transparent border-brand-500/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center mb-6">
                  <Camera className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI Visual Inspection</h3>
                <p className="text-muted-foreground mb-6">
                  Upload photos and our AI detects damage, rust, paint issues, and wear 
                  that might be invisible to the untrained eye.
                </p>
                <ul className="space-y-3">
                  {[
                    'Rust and corrosion detection',
                    'Paint damage and resprays',
                    'Dent and scratch identification',
                    'Tire wear analysis',
                    'Interior condition scoring',
                    'Flood damage indicators',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Audio Analysis */}
            <Card className="bg-gradient-to-br from-success/10 to-transparent border-success/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center mb-6">
                  <Mic className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Engine Sound Analysis</h3>
                <p className="text-muted-foreground mb-6">
                  Record the engine running and our AI listens for problems that 
                  mechanics charge hundreds to diagnose.
                </p>
                <ul className="space-y-3">
                  {[
                    'Engine knock detection',
                    'Belt and pulley issues',
                    'Exhaust problems',
                    'Misfire identification',
                    'Bearing wear sounds',
                    'Timing chain noise',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* History Reports */}
            <Card className="bg-gradient-to-br from-warning/10 to-transparent border-warning/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-warning/20 flex items-center justify-center mb-6">
                  <FileSearch className="w-8 h-8 text-warning" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Vehicle History Reports</h3>
                <p className="text-muted-foreground mb-6">
                  Access official NMVTIS data to uncover accidents, title issues, 
                  and ownership history.
                </p>
                <ul className="space-y-3">
                  {[
                    'Accident history',
                    'Title brand checks',
                    'Odometer verification',
                    'Ownership count',
                    'Lien records',
                    'Theft records',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-warning flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Powerful Tools for Smart Buyers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to research, compare, and negotiate
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:border-brand-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-surface-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Get a complete vehicle analysis in just a few minutes
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  {step.details && (
                    <ul className="grid grid-cols-2 gap-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-brand-500" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Your Data is Safe with Us
              </h2>
              <p className="text-muted-foreground mb-8">
                We take security seriously. Your photos, reports, and personal information 
                are encrypted and never shared with third parties.
              </p>
              <ul className="space-y-4">
                {securityFeatures.map((feature) => (
                  <li key={feature.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-500/20 to-success/20 flex items-center justify-center">
                <Shield className="w-32 h-32 text-brand-500/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-500/10 to-success/10">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Buy with Confidence?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of smart car buyers who use MyAutoWhiz to make informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2">
                Start Free Analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
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

const additionalFeatures = [
  {
    icon: Shield,
    title: 'Safety Recall Alerts',
    description: 'Instantly check for open recalls and safety issues from the official NHTSA database.',
    bgColor: 'bg-error/10',
    iconColor: 'text-error',
  },
  {
    icon: TrendingUp,
    title: 'Market Valuations',
    description: 'Get accurate market values based on condition, mileage, and local market data.',
    bgColor: 'bg-info/10',
    iconColor: 'text-info',
  },
  {
    icon: DollarSign,
    title: 'Negotiation Points',
    description: 'Receive data-backed talking points to help you negotiate a better price.',
    bgColor: 'bg-success/10',
    iconColor: 'text-success',
  },
  {
    icon: Scale,
    title: 'Vehicle Comparison',
    description: 'Compare up to 3 vehicles side-by-side with detailed specs and scores.',
    bgColor: 'bg-brand-500/10',
    iconColor: 'text-brand-500',
  },
  {
    icon: Calculator,
    title: 'Cost Calculator',
    description: 'Calculate total cost of ownership including fuel, insurance, and maintenance.',
    bgColor: 'bg-warning/10',
    iconColor: 'text-warning',
  },
  {
    icon: FileText,
    title: 'Inspection Checklist',
    description: 'Printable 60+ item checklist for in-person vehicle inspections.',
    bgColor: 'bg-brand-500/10',
    iconColor: 'text-brand-500',
  },
  {
    icon: Bell,
    title: 'Price Alerts',
    description: 'Get notified when prices drop on your saved vehicles.',
    bgColor: 'bg-info/10',
    iconColor: 'text-info',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Full PWA support - install on your phone and use it at the dealership.',
    bgColor: 'bg-success/10',
    iconColor: 'text-success',
  },
  {
    icon: BarChart3,
    title: 'Detailed Reports',
    description: 'Export professional PDF reports to share with mechanics or sellers.',
    bgColor: 'bg-warning/10',
    iconColor: 'text-warning',
  },
];

const steps = [
  {
    title: 'Enter the VIN',
    description: 'Find the 17-character Vehicle Identification Number on the dashboard or door jamb and enter it into our system.',
    details: ['Instant VIN decode', 'Vehicle specs lookup', 'Recall check'],
  },
  {
    title: 'Upload Photos & Audio',
    description: 'Take photos of the exterior, interior, and engine bay. Record the engine running for sound analysis.',
    details: ['Up to 20 photos', 'Multiple audio files', 'Cloud storage'],
  },
  {
    title: 'Get Your Report',
    description: 'Our AI analyzes everything and generates a comprehensive report with scores, issues, and recommendations.',
    details: ['Overall score', 'Issue breakdown', 'Market value', 'Negotiation tips'],
  },
  {
    title: 'Make Your Decision',
    description: 'Use the insights to negotiate a better price, request repairs, or walk away from a bad deal.',
    details: ['Save for later', 'Compare options', 'Share reports'],
  },
];

const securityFeatures = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'All data is encrypted in transit and at rest using industry-standard AES-256.',
  },
  {
    icon: Shield,
    title: 'SOC 2 Compliant',
    description: 'Our infrastructure meets rigorous security and privacy standards.',
  },
  {
    icon: Users,
    title: 'No Data Selling',
    description: 'We never sell your personal information or vehicle data to third parties.',
  },
  {
    icon: Globe,
    title: 'GDPR Ready',
    description: 'Full compliance with international data protection regulations.',
  },
];
