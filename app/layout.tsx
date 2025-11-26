import type { Metadata, Viewport } from 'next';
import { DM_Sans, Outfit, JetBrains_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import './globals.css';

// Font configurations
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

// Site metadata
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://myautowhiz.com'),
  title: {
    default: 'MyAutoWhiz - AI-Powered Vehicle Analysis',
    template: '%s | MyAutoWhiz',
  },
  description:
    'Make smarter used car buying decisions with AI-powered visual inspection, engine sound analysis, and comprehensive vehicle history reports.',
  keywords: [
    'used car',
    'vehicle inspection',
    'car analysis',
    'VIN check',
    'vehicle history',
    'car buying',
    'auto inspection',
    'car condition',
    'vehicle report',
    'AI car analysis',
  ],
  authors: [{ name: 'MyAutoWhiz' }],
  creator: 'MyAutoWhiz',
  publisher: 'MyAutoWhiz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://myautowhiz.com',
    siteName: 'MyAutoWhiz',
    title: 'MyAutoWhiz - AI-Powered Vehicle Analysis',
    description:
      'Make smarter used car buying decisions with AI-powered visual inspection, engine sound analysis, and comprehensive vehicle history reports.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MyAutoWhiz - AI-Powered Vehicle Analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyAutoWhiz - AI-Powered Vehicle Analysis',
    description:
      'Make smarter used car buying decisions with AI-powered visual inspection, engine sound analysis, and comprehensive vehicle history reports.',
    images: ['/og-image.png'],
    creator: '@myautowhiz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MyAutoWhiz',
  },
  applicationName: 'MyAutoWhiz',
  category: 'automotive',
};

// Viewport configuration for PWA
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* PWA meta tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MyAutoWhiz" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for API endpoints */}
        <link rel="dns-prefetch" href="https://vpic.nhtsa.dot.gov" />
        <link rel="dns-prefetch" href="https://api.nhtsa.gov" />
        <link rel="dns-prefetch" href="https://api.vinaudit.com" />
      </head>
      <body className="min-h-screen bg-surface-primary font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* Background gradient mesh */}
            <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" aria-hidden="true" />
            
            {/* Main content */}
            <div className="relative z-10">
              {children}
            </div>
            
            {/* Toast notifications */}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        
        {/* Service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
