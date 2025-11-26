'use client';

import Link from 'next/link';
import { Car, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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

      {/* Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-500" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing or using MyAutoWhiz (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service.
              </p>
              <p className="text-muted-foreground">
                These Terms apply to all users, including visitors, registered users, and subscribers. We reserve the right to modify these Terms at any time, and your continued use of the Service constitutes acceptance of any modifications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground mb-4">
                MyAutoWhiz is an AI-powered vehicle analysis platform that provides:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Visual inspection analysis using AI technology</li>
                <li>Engine sound analysis for mechanical issues</li>
                <li>Vehicle history reports from official data sources</li>
                <li>Market valuations and pricing information</li>
                <li>Safety recall alerts and notifications</li>
                <li>Vehicle comparison and cost calculation tools</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. Account Registration</h2>
              <p className="text-muted-foreground mb-4">
                To access certain features of the Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Promptly update your information if it changes</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Not share your account with others</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                You must be at least 18 years old to create an account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Subscription and Payment</h2>
              
              <h3 className="text-lg font-medium mb-3">4.1 Free Tier</h3>
              <p className="text-muted-foreground mb-4">
                Free accounts are limited to 2 vehicle analyses per month. Free tier features and limits may change at any time.
              </p>

              <h3 className="text-lg font-medium mb-3">4.2 Paid Subscriptions</h3>
              <p className="text-muted-foreground mb-4">
                Paid subscriptions are billed in advance on a monthly or annual basis. By subscribing, you authorize us to charge your payment method for the subscription fees.
              </p>

              <h3 className="text-lg font-medium mb-3">4.3 Cancellation and Refunds</h3>
              <p className="text-muted-foreground mb-4">
                You may cancel your subscription at any time. Upon cancellation:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>You will retain access until the end of your current billing period</li>
                <li>No refunds are provided for partial billing periods</li>
                <li>Refunds within 7 days of initial purchase may be requested</li>
                <li>Annual subscriptions are non-refundable after 14 days</li>
              </ul>

              <h3 className="text-lg font-medium mb-3">4.4 Price Changes</h3>
              <p className="text-muted-foreground">
                We reserve the right to modify pricing at any time. Price changes will be communicated 30 days in advance and will apply to subsequent billing periods.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Acceptable Use</h2>
              <p className="text-muted-foreground mb-4">You agree NOT to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Use the Service for any illegal purpose</li>
                <li>Upload malicious content, viruses, or harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Scrape, harvest, or collect data from the Service</li>
                <li>Impersonate others or provide false information</li>
                <li>Use the Service to harass, spam, or deceive others</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Resell or redistribute the Service without authorization</li>
                <li>Use automated systems to access the Service excessively</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Intellectual Property</h2>
              
              <h3 className="text-lg font-medium mb-3">6.1 Our Content</h3>
              <p className="text-muted-foreground mb-4">
                The Service, including all software, algorithms, designs, graphics, and content, is owned by MyAutoWhiz and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our permission.
              </p>

              <h3 className="text-lg font-medium mb-3">6.2 Your Content</h3>
              <p className="text-muted-foreground mb-4">
                You retain ownership of photos, audio recordings, and other content you upload. By uploading content, you grant us a non-exclusive, worldwide license to use, process, and analyze the content to provide the Service.
              </p>

              <h3 className="text-lg font-medium mb-3">6.3 AI Training</h3>
              <p className="text-muted-foreground">
                Anonymized and aggregated data from analyses may be used to improve our AI models. No personally identifiable information is used for training purposes without explicit consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Disclaimers and Limitations</h2>
              
              <h3 className="text-lg font-medium mb-3">7.1 No Warranty</h3>
              <p className="text-muted-foreground mb-4">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. We do not warrant that the Service will be uninterrupted, error-free, or completely secure.
              </p>

              <h3 className="text-lg font-medium mb-3">7.2 Not Professional Advice</h3>
              <p className="text-muted-foreground mb-4">
                Our analyses are for informational purposes only and should not replace professional mechanical inspections. We are not responsible for purchasing decisions made based on our reports.
              </p>

              <h3 className="text-lg font-medium mb-3">7.3 Third-Party Data</h3>
              <p className="text-muted-foreground mb-4">
                Vehicle history data comes from third-party sources. While we strive for accuracy, we cannot guarantee the completeness or accuracy of this data.
              </p>

              <h3 className="text-lg font-medium mb-3">7.4 Limitation of Liability</h3>
              <p className="text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, MYAUTOWHIZ SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify, defend, and hold harmless MyAutoWhiz and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Termination</h2>
              <p className="text-muted-foreground mb-4">
                We may suspend or terminate your account at any time for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Non-payment of fees</li>
                <li>Extended periods of inactivity</li>
                <li>Any reason with 30 days notice</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Upon termination, you will lose access to your account and any associated data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">10. Dispute Resolution</h2>
              
              <h3 className="text-lg font-medium mb-3">10.1 Informal Resolution</h3>
              <p className="text-muted-foreground mb-4">
                Before filing a formal dispute, you agree to contact us at legal@myautowhiz.com to attempt informal resolution.
              </p>

              <h3 className="text-lg font-medium mb-3">10.2 Arbitration</h3>
              <p className="text-muted-foreground mb-4">
                Any disputes not resolved informally shall be settled by binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>

              <h3 className="text-lg font-medium mb-3">10.3 Class Action Waiver</h3>
              <p className="text-muted-foreground">
                You agree to resolve disputes on an individual basis and waive the right to participate in class actions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">12. Severability</h2>
              <p className="text-muted-foreground">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">13. Entire Agreement</h2>
              <p className="text-muted-foreground">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and MyAutoWhiz regarding the Service and supersede all prior agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">14. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                For questions about these Terms, please contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-1">
                <li><strong>Email:</strong> legal@myautowhiz.com</li>
                <li><strong>Address:</strong> MyAutoWhiz, Inc.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-4xl">
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
              <Link href="/terms" className="text-brand-500">
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
