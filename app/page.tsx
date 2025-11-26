import Link from 'next/link';
import { 
  Car, 
  Camera, 
  Mic, 
  FileSearch, 
  Shield, 
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen">
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
            <Zap className="w-4 h-4 text-brand-500" />
            <span className="text-sm text-brand-400">AI-Powered Vehicle Analysis</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            Buy Used Cars with{' '}
            <span className="gradient-text">Complete Confidence</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant AI analysis of any used vehicle. Upload photos, record engine sounds, 
            and receive comprehensive reports with market valuations and hidden issue detection.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2">
                Start Free Analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline">
                See How It Works
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>2 Free Analyses</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-surface-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need to Make Smart Decisions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI analyzes every aspect of a vehicle to give you the complete picture 
              before you buy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass-card p-6 hover:border-brand-500/30 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Three Simple Steps
            </h2>
            <p className="text-muted-foreground">
              Get a complete vehicle analysis in minutes, not hours.
            </p>
          </div>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Buy with Confidence?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start your first vehicle analysis for free. No credit card required.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold">MyAutoWhiz</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered vehicle analysis for smart car buyers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MyAutoWhiz. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Made with ❤️ for car buyers everywhere</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Camera,
    title: 'AI Visual Inspection',
    description: 'Upload photos and our AI detects rust, dents, paint issues, and hidden damage with pinpoint accuracy.',
    color: 'bg-brand-500/20 text-brand-500',
  },
  {
    icon: Mic,
    title: 'Engine Sound Analysis',
    description: 'Record engine sounds to detect knocks, misfires, belt issues, and other mechanical problems.',
    color: 'bg-success/20 text-success',
  },
  {
    icon: FileSearch,
    title: 'Vehicle History Reports',
    description: 'Access NMVTIS-sourced data including accidents, title issues, odometer readings, and ownership history.',
    color: 'bg-warning/20 text-warning',
  },
  {
    icon: Shield,
    title: 'Safety Recall Alerts',
    description: 'Instantly check for open recalls and safety issues from the official NHTSA database.',
    color: 'bg-error/20 text-error',
  },
  {
    icon: TrendingUp,
    title: 'Market Valuations',
    description: 'Get accurate market values based on mileage, condition, and local market data.',
    color: 'bg-info/20 text-info',
  },
  {
    icon: DollarSign,
    title: 'Negotiation Assistant',
    description: 'Receive data-backed negotiation points to help you get the best deal possible.',
    color: 'bg-brand-500/20 text-brand-500',
  },
];

const steps = [
  {
    title: 'Enter the VIN',
    description: 'Locate the 17-character VIN on the dashboard or door jamb and enter it to start your analysis.',
  },
  {
    title: 'Upload Photos & Audio',
    description: 'Take photos of the exterior, interior, and engine bay. Record the engine running for audio analysis.',
  },
  {
    title: 'Get Your Report',
    description: 'Receive a comprehensive report with scores, detected issues, market value, and negotiation points.',
  },
];

const stats = [
  { value: '50K+', label: 'Vehicles Analyzed' },
  { value: '98%', label: 'Accuracy Rate' },
  { value: '$2,400', label: 'Avg. Savings' },
  { value: '4.9★', label: 'User Rating' },
];
