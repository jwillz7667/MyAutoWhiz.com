'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Car, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updatePassword, validatePassword } from '@/lib/supabase/auth';
import { cn } from '@/lib/utils';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  useEffect(() => {
    // Check if we have the necessary tokens in the URL
    // Supabase passes tokens as hash fragments after email verification
    const hash = window.location.hash;
    if (!hash && !searchParams.get('code')) {
      setIsValidLink(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordValidation.isValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await updatePassword(password);
      
      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
        
        <Card className="relative z-10 w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-error" />
            </div>
            <h2 className="text-xl font-bold mb-2">Invalid or Expired Link</h2>
            <p className="text-muted-foreground mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link href="/auth/forgot-password">
              <Button className="w-full">Request New Link</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
        
        <Card className="relative z-10 w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-bold mb-2">Password Reset Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your password has been updated. Redirecting to dashboard...
            </p>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl">MyAutoWhiz</span>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Enter a new password for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4" />}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              {password.length > 0 && (
                <div className="space-y-2 p-3 bg-surface-tertiary/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground">Password Requirements:</p>
                  {passwordValidation.requirements.map((req, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center gap-2 text-xs',
                        req.met ? 'text-success' : 'text-muted-foreground'
                      )}
                    >
                      <CheckCircle2 className={cn('w-3 h-3', req.met ? 'opacity-100' : 'opacity-30')} />
                      {req.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4" />}
                    className={cn(
                      'pr-10',
                      confirmPassword.length > 0 && (passwordsMatch ? 'border-success' : 'border-error')
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-xs text-error mt-1">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
                isLoading={isLoading}
              >
                Reset Password
              </Button>
            </form>

            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
