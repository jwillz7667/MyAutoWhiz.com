import Link from 'next/link';
import { Check, X, Car, Zap, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    description: 'Try before you buy',
    price: 0,
    period: 'forever',
    features: [
      { text: '2 vehicle analyses', included: true },
      { text: 'VIN decoding', included: true },
      { text: 'Recall alerts', included: true },
      { text: 'Basic vehicle specs', included: true },
      { text: 'Vehicle history reports', included: false },
      { text: 'AI visual inspection', included: false },
      { text: 'Audio analysis', included: false },
      { text: 'PDF reports', included: false },
    ],
    cta: 'Get Started',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Starter',
    description: 'For casual car shoppers',
    price: 9.99,
    period: 'month',
    features: [
      { text: '10 vehicle analyses', included: true },
      { text: 'VIN decoding', included: true },
      { text: 'Recall alerts', included: true },
      { text: 'Full vehicle specs', included: true },
      { text: '5 vehicle history reports', included: true },
      { text: 'AI visual inspection', included: true },
      { text: 'Audio analysis', included: false },
      { text: 'PDF reports', included: true },
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup?plan=starter',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For serious car buyers',
    price: 29.99,
    period: 'month',
    features: [
      { text: '50 vehicle analyses', included: true },
      { text: 'VIN decoding', included: true },
      { text: 'Recall alerts', included: true },
      { text: 'Full vehicle specs', included: true },
      { text: '25 vehicle history reports', included: true },
      { text: 'AI visual inspection', included: true },
      { text: 'AI audio analysis', included: true },
      { text: 'PDF reports', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For dealerships & businesses',
    price: 99.99,
    period: 'month',
    features: [
      { text: '500 vehicle analyses', included: true },
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited history reports', included: true },
      { text: 'API access', included: true },
      { text: 'White-label reports', included: true },
      { text: 'Team members', included: true },
      { text: 'Bulk upload', included: true },
      { text: 'Dedicated support', included: true },
    ],
    cta: 'Contact Sales',
    href: '/contact?type=enterprise',
    popular: false,
  },
];

export default function PricingPage() {
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
            <Link href="/pricing" className="text-foreground font-medium">
              Pricing
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your needs. All plans include a 7-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Mobile: Stack cards */}
          {/* Desktop: Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative rounded-2xl border p-6 flex flex-col',
                  plan.popular
                    ? 'border-brand-500/50 bg-gradient-to-b from-brand-500/10 to-transparent'
                    : 'border-white/10 bg-surface-secondary/50'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-display font-bold">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <span className={cn(!feature.included && 'text-muted-foreground')}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-surface-secondary/50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-surface-secondary rounded-lg p-6 border border-white/10">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Ready to Make Smarter Car Purchases?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start with 2 free analyses. No credit card required.
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

const faqs = [
  {
    question: 'What counts as an analysis?',
    answer: 'An analysis is a complete evaluation of a single vehicle by VIN. Each time you analyze a new VIN, it counts as one analysis. Re-viewing previous analyses does not count against your limit.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period, and you won\'t be charged again.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal. Enterprise customers can also pay by invoice.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 7-day money-back guarantee on all paid plans. If you\'re not satisfied, contact our support team for a full refund.',
  },
  {
    question: 'What\'s included in a vehicle history report?',
    answer: 'Our vehicle history reports include title status, accident history, ownership records, odometer readings, service history, and NMVTIS data from official government sources.',
  },
  {
    question: 'How accurate is the AI analysis?',
    answer: 'Our AI visual inspection detects damage with 95%+ accuracy for common issues like rust, dents, and paint problems. Audio analysis identifies 90%+ of mechanical issues. We recommend combining AI analysis with a professional inspection for major purchases.',
  },
];
