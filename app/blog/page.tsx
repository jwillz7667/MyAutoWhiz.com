'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Car,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const blogPosts = [
  {
    id: '1',
    title: '10 Red Flags to Watch for When Buying a Used Car',
    excerpt: 'Learn the critical warning signs that could save you thousands on your next used car purchase. Our experts share insider tips on spotting problem vehicles.',
    category: 'Buying Guide',
    date: '2024-11-20',
    readTime: '8 min read',
    image: '/blog/red-flags.jpg',
    featured: true,
  },
  {
    id: '2',
    title: 'How AI is Revolutionizing Used Car Inspections',
    excerpt: 'Discover how artificial intelligence and computer vision are changing the way we evaluate used vehicles, making inspections faster and more accurate than ever.',
    category: 'Technology',
    date: '2024-11-15',
    readTime: '6 min read',
    image: '/blog/ai-inspection.jpg',
    featured: true,
  },
  {
    id: '3',
    title: 'Understanding Vehicle History Reports: A Complete Guide',
    excerpt: 'Everything you need to know about vehicle history reports, including what they reveal, their limitations, and how to interpret the data for smart buying decisions.',
    category: 'Education',
    date: '2024-11-10',
    readTime: '10 min read',
    image: '/blog/history-reports.jpg',
    featured: false,
  },
  {
    id: '4',
    title: 'Best Used Cars Under $20,000 in 2024',
    excerpt: 'Our top picks for reliable, affordable used cars that offer the best value for budget-conscious buyers. Includes maintenance costs and common issues to watch for.',
    category: 'Recommendations',
    date: '2024-11-05',
    readTime: '12 min read',
    image: '/blog/best-under-20k.jpg',
    featured: false,
  },
  {
    id: '5',
    title: 'How to Negotiate the Best Price on a Used Car',
    excerpt: 'Master the art of negotiation with these proven strategies. Learn what data to gather, when to walk away, and how to get the best deal every time.',
    category: 'Buying Guide',
    date: '2024-10-30',
    readTime: '7 min read',
    image: '/blog/negotiation.jpg',
    featured: false,
  },
  {
    id: '6',
    title: 'Electric vs. Hybrid: Which Used EV is Right for You?',
    excerpt: 'A comprehensive comparison of used electric and hybrid vehicles. We cover battery degradation, charging infrastructure, and total cost of ownership.',
    category: 'Comparisons',
    date: '2024-10-25',
    readTime: '9 min read',
    image: '/blog/ev-hybrid.jpg',
    featured: false,
  },
];

const categories = [
  'All',
  'Buying Guide',
  'Technology',
  'Education',
  'Recommendations',
  'Comparisons',
  'News',
];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const recentPosts = blogPosts.filter((post) => !post.featured);

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
            <Link href="/blog" className="text-brand-500 font-medium">
              Blog
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
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                MyAutoWhiz Blog
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Expert advice, industry insights, and tips for making smarter used car purchases
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-display font-bold mb-6">Featured</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="h-full overflow-hidden hover:border-brand-500/50 transition-colors group">
                  <div className="aspect-video bg-gradient-to-br from-brand-500/20 to-brand-600/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Car className="w-16 h-16 text-brand-500/50" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-500 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-12 px-4 bg-surface-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-display font-bold mb-6">Recent Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="h-full overflow-hidden hover:border-brand-500/50 transition-colors group">
                  <div className="aspect-video bg-gradient-to-br from-surface-secondary to-surface-primary relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Car className="w-12 h-12 text-brand-500/30" />
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-bold mb-2 group-hover:text-brand-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for the latest car buying tips, industry news, and exclusive insights.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button type="submit">Subscribe</Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            No spam, unsubscribe anytime. Read our{' '}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
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
