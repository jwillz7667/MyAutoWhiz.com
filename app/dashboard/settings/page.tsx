'use client';

import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  CreditCard,
  Shield,
  Smartphone,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/auth-provider';

type SettingsTab = 'profile' | 'notifications' | 'billing' | 'security' | 'preferences';

const tabs = [
  { id: 'profile' as const, label: 'Profile', icon: User },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  { id: 'billing' as const, label: 'Billing', icon: CreditCard },
  { id: 'security' as const, label: 'Security', icon: Shield },
  { id: 'preferences' as const, label: 'Preferences', icon: Settings },
];

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile tab selector */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="w-full flex items-center justify-between p-4 bg-surface-secondary rounded-lg border border-white/10"
          >
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = tabs.find((t) => t.id === activeTab)?.icon || Settings;
                return <Icon className="w-5 h-5 text-brand-500" />;
              })()}
              <span className="font-medium">
                {tabs.find((t) => t.id === activeTab)?.label}
              </span>
            </div>
            <ChevronRight className={cn('w-5 h-5 transition-transform', showMobileNav && 'rotate-90')} />
          </button>

          {/* Mobile nav dropdown */}
          {showMobileNav && (
            <div className="mt-2 bg-surface-secondary rounded-lg border border-white/10 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMobileNav(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 text-left transition-colors',
                    activeTab === tab.id
                      ? 'bg-brand-500/10 text-brand-500'
                      : 'hover:bg-white/5'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <Check className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                    activeTab === tab.id
                      ? 'bg-brand-500/10 text-brand-500'
                      : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 text-2xl font-bold">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input defaultValue={profile?.full_name || ''} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
                    <Input defaultValue={profile?.display_name || ''} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" defaultValue={user?.email || ''} disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact support to change your email
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input placeholder="City, State" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: 'Analysis Complete', desc: 'Get notified when your vehicle analysis is ready', email: true, push: true },
                  { title: 'Recall Alerts', desc: 'Receive alerts for new recalls on your saved vehicles', email: true, push: true },
                  { title: 'Price Drops', desc: 'Get notified when saved vehicle prices change', email: false, push: true },
                  { title: 'Marketing', desc: 'Tips, updates, and promotional content', email: false, push: false },
                ].map((item) => (
                  <div key={item.title} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-surface-tertiary/50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked={item.email} className="w-4 h-4 rounded" />
                        <span className="text-sm">Email</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked={item.push} className="w-4 h-4 rounded" />
                        <span className="text-sm">Push</span>
                      </label>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-brand-500/10 border border-brand-500/20 rounded-lg">
                    <div>
                      <p className="text-lg font-bold text-brand-500">Free Plan</p>
                      <p className="text-sm text-muted-foreground">2 analyses per month</p>
                    </div>
                    <Button>Upgrade Plan</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">No payment method on file</p>
                  <Button variant="outline">Add Payment Method</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No billing history available</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <Input type="password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <Input type="password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <Input type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>Manage your logged-in devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-surface-tertiary/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-success" />
                      <div>
                        <p className="font-medium">Current Device</p>
                        <p className="text-sm text-muted-foreground">Last active: Just now</p>
                      </div>
                    </div>
                    <span className="badge badge-success">Active</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-error/20">
                <CardHeader>
                  <CardTitle className="text-error">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" onClick={() => signOut()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                  <Button variant="outline" className="text-error border-error/30 hover:bg-error/10">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Sun className="w-4 h-4" /> Light
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Moon className="w-4 h-4" /> Dark
                    </Button>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Language */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>
                  <select className="h-10 px-3 rounded-lg border border-input bg-surface-secondary">
                    <option>English (US)</option>
                    <option>Español</option>
                    <option>Français</option>
                  </select>
                </div>

                <div className="h-px bg-white/10" />

                {/* Units */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Distance Units</p>
                    <p className="text-sm text-muted-foreground">Miles or kilometers</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Miles</Button>
                    <Button variant="outline" size="sm">Kilometers</Button>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Currency */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Currency</p>
                    <p className="text-sm text-muted-foreground">For price displays</p>
                  </div>
                  <select className="h-10 px-3 rounded-lg border border-input bg-surface-secondary">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>CAD ($)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
