'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-primary/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl">MyAutoWhiz</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-muted-foreground hover:text-foreground transition-colors',
                pathname === link.href && 'text-brand-500 font-medium'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="hidden sm:block">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>Get Started</Button>
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-surface-secondary border-b border-white/10 py-4">
          <div className="container mx-auto px-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block py-2 text-muted-foreground hover:text-foreground transition-colors',
                  pathname === link.href && 'text-brand-500 font-medium'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
