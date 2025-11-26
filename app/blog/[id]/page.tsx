'use client';

import Link from 'next/link';
import { use } from 'react';
import {
  Car,
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Demo blog post data
const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: { name: string; role: string };
  content: string[];
}> = {
  '1': {
    title: '10 Red Flags to Watch for When Buying a Used Car',
    excerpt: 'Learn the critical warning signs that could save you thousands on your next used car purchase.',
    category: 'Buying Guide',
    date: '2024-11-20',
    readTime: '8 min read',
    author: { name: 'Sarah Johnson', role: 'Automotive Expert' },
    content: [
      'Buying a used car can be an excellent way to save money, but it also comes with risks. Knowing what to look for can help you avoid costly mistakes and find a reliable vehicle that will serve you well for years to come.',
      '## 1. Mismatched Paint or Body Panels',
      'One of the first things to check is the consistency of the paint across all body panels. Look for color variations, different textures, or signs of overspray on rubber seals and trim. These can indicate previous accident damage and repairs.',
      '## 2. Unusual Odors',
      'Pay attention to how the car smells. A musty odor could indicate water damage or mold, while a sweet smell might suggest a coolant leak. Excessive air fresheners could be masking underlying problems.',
      '## 3. Inconsistent Wear Patterns',
      'Check if the wear on the pedals, steering wheel, and seats matches the odometer reading. A car with 30,000 miles should show minimal wear. Excessive wear with low mileage could indicate odometer tampering.',
      '## 4. Check Engine Light',
      'Never buy a car with an active check engine light without first having it diagnosed. Some sellers may clear codes temporarily, so having a mechanic scan for pending codes is essential.',
      '## 5. Signs of Flood Damage',
      'Look for waterlines in the trunk or under the hood, rust on metal components that should be clean, and a musty smell. Check if the electrical systems work properly, as water damage often causes intermittent electrical issues.',
      '## 6. Smoke from the Exhaust',
      'Blue smoke indicates oil burning, white smoke suggests coolant leak into combustion chamber, and black smoke points to fuel system issues. None of these are cheap fixes.',
      '## 7. Unusual Sounds',
      'During your test drive, listen for knocking, grinding, squealing, or clicking sounds. These can indicate problems with the engine, transmission, brakes, or suspension.',
      '## 8. Title Issues',
      'Always check the title status. Salvage, rebuilt, or flood titles significantly affect resale value and may indicate major previous damage. Some states have different title branding requirements.',
      '## 9. Pressure to Buy Quickly',
      "If a seller is pushing you to make a quick decision, it's often a red flag. Legitimate sellers understand that buyers need time to inspect and consider their purchase.",
      '## 10. Price Too Good to Be True',
      "If a price seems too low for the year, make, and model, there's usually a reason. Research market values and be skeptical of deals that seem unrealistic.",
      '## Conclusion',
      'Taking your time and being thorough during the inspection process can save you from expensive repairs and headaches down the road. When in doubt, always get a professional pre-purchase inspection.',
    ],
  },
  '2': {
    title: 'How AI is Revolutionizing Used Car Inspections',
    excerpt: 'Discover how artificial intelligence and computer vision are changing the way we evaluate used vehicles.',
    category: 'Technology',
    date: '2024-11-15',
    readTime: '6 min read',
    author: { name: 'Michael Chen', role: 'Tech Writer' },
    content: [
      'Artificial intelligence is transforming countless industries, and the used car market is no exception. From visual inspections to predictive maintenance, AI is making it easier than ever to evaluate vehicle condition.',
      '## Computer Vision for Damage Detection',
      'Modern AI systems can analyze photos of vehicles to detect scratches, dents, rust, and even subtle signs of previous repairs. These systems are trained on millions of images and can spot issues that might escape the untrained eye.',
      '## Audio Analysis for Mechanical Issues',
      "By analyzing engine sounds, AI can detect potential mechanical problems before they become serious. Unusual knocking, misfiring, or belt noises can be identified and flagged for further inspection.",
      '## Predictive Analytics',
      'AI systems can analyze maintenance records, driving patterns, and component lifecycles to predict future repair needs. This helps buyers understand the true cost of ownership beyond the purchase price.',
      '## The Future of Vehicle Inspection',
      'As AI technology continues to advance, we can expect even more sophisticated analysis capabilities. From real-time diagnostics to comprehensive condition scoring, the future of used car buying is becoming increasingly data-driven.',
    ],
  },
};

interface PageParams {
  id: string;
}

export default function BlogPostPage({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  const post = blogPosts[id] || blogPosts['1'];

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

      {/* Article */}
      <article className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Badge>{post.category}</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 font-bold">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </header>

          {/* Featured Image Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-brand-500/20 to-brand-600/20 rounded-xl mb-12 flex items-center justify-center">
            <Car className="w-24 h-24 text-brand-500/50" />
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {post.content.map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-display font-bold mt-10 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              return (
                <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Share */}
          <div className="border-t border-white/10 mt-12 pt-8">
            <p className="font-medium mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share this article
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="py-20 px-4 bg-surface-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-display font-bold mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(blogPosts)
              .filter(([key]) => key !== id)
              .slice(0, 3)
              .map(([key, relatedPost]) => (
                <Link key={key} href={`/blog/${key}`}>
                  <Card className="h-full hover:border-brand-500/50 transition-colors group">
                    <div className="aspect-video bg-gradient-to-br from-surface-secondary to-surface-primary flex items-center justify-center">
                      <Car className="w-12 h-12 text-brand-500/30" />
                    </div>
                    <CardContent className="p-5">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="font-bold group-hover:text-brand-500 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <CheckCircle2 className="w-12 h-12 text-brand-500 mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Inspect Your Next Car?
          </h2>
          <p className="text-muted-foreground mb-8">
            Use MyAutoWhiz to get AI-powered analysis of any used vehicle before you buy.
          </p>
          <Link href="/auth/signup">
            <Button size="lg">
              Start Free Analysis
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          </Link>
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
