'use client';

import Link from 'next/link';
import { Car, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
              <Shield className="w-6 h-6 text-brand-500" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                MyAutoWhiz (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our vehicle analysis platform.
              </p>
              <p className="text-muted-foreground">
                Please read this privacy policy carefully. By using MyAutoWhiz, you consent to the practices described in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium mb-3">2.1 Personal Information</h3>
              <p className="text-muted-foreground mb-4">We may collect personal information that you voluntarily provide, including:</p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                <li>Name and email address</li>
                <li>Phone number (optional)</li>
                <li>Billing information and payment details</li>
                <li>Account credentials</li>
                <li>Profile information</li>
              </ul>

              <h3 className="text-lg font-medium mb-3">2.2 Vehicle Information</h3>
              <p className="text-muted-foreground mb-4">When you use our analysis features, we collect:</p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                <li>Vehicle Identification Numbers (VINs)</li>
                <li>Photos of vehicles you upload</li>
                <li>Audio recordings of engine sounds</li>
                <li>Vehicle specifications and history data</li>
              </ul>

              <h3 className="text-lg font-medium mb-3">2.3 Automatically Collected Information</h3>
              <p className="text-muted-foreground mb-4">We automatically collect certain information when you use our service:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and location data</li>
                <li>Usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process vehicle analyses and generate reports</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send you updates, alerts, and promotional materials</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Detect and prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
                <li>Improve our AI and machine learning models</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground mb-4">We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Service Providers:</strong> Third parties that help us operate our platform (payment processors, cloud hosting, analytics)</li>
                <li><strong>Data Partners:</strong> Vehicle history providers (NMVTIS, VinAudit, ClearVin) to generate reports</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Data Retention</h2>
              <p className="text-muted-foreground mb-4">We retain your information as follows:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Account Data:</strong> Retained while your account is active and for 30 days after deletion</li>
                <li><strong>Vehicle Photos:</strong> Retained for 30 days after analysis, then automatically deleted</li>
                <li><strong>Audio Files:</strong> Retained for 30 days after analysis, then automatically deleted</li>
                <li><strong>Analysis Reports:</strong> Retained indefinitely unless you request deletion</li>
                <li><strong>Payment Information:</strong> Retained as required for tax and legal purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>AES-256 encryption for data at rest</li>
                <li>TLS 1.3 encryption for data in transit</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure cloud infrastructure (AWS/Supabase)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Your Rights and Choices</h2>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your data</li>
                <li><strong>Portability:</strong> Request your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, contact us at privacy@myautowhiz.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Cookies and Tracking</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar technologies to enhance your experience. You can control cookies through your browser settings. Types of cookies we use:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Essential:</strong> Required for the platform to function</li>
                <li><strong>Analytics:</strong> Help us understand how you use our service</li>
                <li><strong>Preferences:</strong> Remember your settings and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-muted-foreground">
                MyAutoWhiz is not intended for children under 16 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">10. International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses where required.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">11. California Privacy Rights (CCPA)</h2>
              <p className="text-muted-foreground mb-4">
                California residents have additional rights under the CCPA:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Right to know what personal information is collected</li>
                <li>Right to know whether personal information is sold or disclosed</li>
                <li>Right to opt-out of the sale of personal information</li>
                <li>Right to non-discrimination for exercising CCPA rights</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We do not sell personal information as defined by the CCPA.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">12. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of MyAutoWhiz after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">13. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about this privacy policy or our data practices, please contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-1">
                <li><strong>Email:</strong> privacy@myautowhiz.com</li>
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
              <Link href="/privacy" className="text-brand-500">
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
