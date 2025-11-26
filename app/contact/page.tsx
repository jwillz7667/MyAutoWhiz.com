'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
            <MessageSquare className="w-4 h-4 text-brand-500" />
            <span className="text-sm text-brand-400">Get in Touch</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            How Can We Help?
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about MyAutoWhiz? We&apos;re here to help. 
            Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method) => (
              <Card key={method.title}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                    <method.icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <h3 className="font-semibold mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <p className="text-brand-500 font-medium">{method.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-12 px-4 bg-surface-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Send Us a Message</h2>
              
              {isSubmitted ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {error}
                        </div>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Name</label>
                          <Input
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <Input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full h-10 rounded-lg border border-input bg-surface-secondary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        >
                          <option value="">Select a topic</option>
                          <option value="general">General Question</option>
                          <option value="technical">Technical Support</option>
                          <option value="billing">Billing & Subscriptions</option>
                          <option value="partnership">Partnership Inquiry</option>
                          <option value="feedback">Feedback & Suggestions</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                          name="message"
                          placeholder="How can we help you?"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className="w-full rounded-lg border border-input bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isSubmitting} isLoading={isSubmitting}>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 flex items-start gap-2">
                        <HelpCircle className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                        {faq.question}
                      </h3>
                      <p className="text-sm text-muted-foreground pl-7">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-xl bg-brand-500/10 border border-brand-500/20">
                <h3 className="font-semibold mb-2">Need Help Right Now?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check out our comprehensive help center for guides, tutorials, and troubleshooting tips.
                </p>
                <Link href="/dashboard/help">
                  <Button variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Visit Help Center
                  </Button>
                </Link>
              </div>
            </div>
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

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us an email anytime',
    value: 'support@myautowhiz.com',
  },
  {
    icon: Clock,
    title: 'Response Time',
    description: 'We typically respond within',
    value: '24 hours',
  },
  {
    icon: MapPin,
    title: 'Location',
    description: 'Based in',
    value: 'United States',
  },
];

const faqs = [
  {
    question: 'How accurate is the AI visual analysis?',
    answer: 'Our AI has been trained on millions of vehicle images and achieves 98.5% accuracy in detecting common issues like rust, dents, and paint damage.',
  },
  {
    question: 'Do you store my photos?',
    answer: 'Photos are stored securely and encrypted for 30 days to generate your report, then automatically deleted. You can request deletion at any time.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a full refund within 7 days if you\'re not satisfied with our service. Contact support for assistance.',
  },
  {
    question: 'How do I get a vehicle history report?',
    answer: 'Simply enter the VIN in our analysis tool and select "Include Vehicle History" option. Reports are sourced from official NMVTIS data.',
  },
];
