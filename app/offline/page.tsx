import Link from 'next/link';
import { WifiOff, RefreshCw, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl">MyAutoWhiz</span>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-surface-tertiary flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-muted-foreground" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-display font-bold mb-2">You&apos;re Offline</h1>
        <p className="text-muted-foreground mb-8">
          It looks like you&apos;ve lost your internet connection. 
          Some features may be unavailable until you&apos;re back online.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => window.location.reload()}
            className="w-full gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Info */}
        <p className="text-sm text-muted-foreground mt-8">
          Don&apos;t worry - your saved data is safe and will sync 
          automatically when you reconnect.
        </p>
      </div>
    </div>
  );
}
