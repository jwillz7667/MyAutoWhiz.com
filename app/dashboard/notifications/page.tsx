'use client';

import { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  Car,
  FileSearch,
  DollarSign,
  Shield,
  Settings,
  Trash2,
  Filter,
  Clock,
  ChevronDown,
  Info,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, formatRelativeTime } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'analysis' | 'price_alert' | 'recall' | 'system' | 'promotion';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  vehicleInfo?: {
    year: number;
    make: string;
    model: string;
  };
}

const demoNotifications: Notification[] = [
  {
    id: '1',
    type: 'analysis',
    title: 'Analysis Complete',
    message: 'Your vehicle analysis for the 2021 Honda Accord is ready. Overall score: 87/100.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    read: false,
    actionUrl: '/dashboard/reports/1',
    actionLabel: 'View Report',
    vehicleInfo: { year: 2021, make: 'Honda', model: 'Accord' },
  },
  {
    id: '2',
    type: 'price_alert',
    title: 'Price Drop Alert',
    message: 'The 2020 Toyota Camry you saved has dropped $1,500 in price!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    actionUrl: '/dashboard/saved',
    actionLabel: 'View Vehicle',
    vehicleInfo: { year: 2020, make: 'Toyota', model: 'Camry' },
  },
  {
    id: '3',
    type: 'recall',
    title: 'Safety Recall Found',
    message: 'A new safety recall has been issued for a vehicle you analyzed. Check the details to ensure safety.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: false,
    actionUrl: '/dashboard/reports/2',
    actionLabel: 'View Details',
    vehicleInfo: { year: 2019, make: 'Ford', model: 'F-150' },
  },
  {
    id: '4',
    type: 'system',
    title: 'Monthly Report Ready',
    message: 'Your monthly usage summary for November is now available.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    actionUrl: '/dashboard/settings',
    actionLabel: 'View Summary',
  },
  {
    id: '5',
    type: 'promotion',
    title: 'Upgrade to Pro',
    message: 'Get 20% off annual Pro subscription. Limited time offer!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
    actionUrl: '/pricing',
    actionLabel: 'View Plans',
  },
  {
    id: '6',
    type: 'analysis',
    title: 'Analysis Complete',
    message: 'Your vehicle analysis for the 2022 Mazda CX-5 is ready. Overall score: 92/100.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    read: true,
    actionUrl: '/dashboard/reports/3',
    actionLabel: 'View Report',
    vehicleInfo: { year: 2022, make: 'Mazda', model: 'CX-5' },
  },
  {
    id: '7',
    type: 'system',
    title: 'Welcome to MyAutoWhiz!',
    message: 'Thanks for joining! Start by analyzing your first vehicle to see how we can help.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), // 7 days ago
    read: true,
    actionUrl: '/dashboard/analyze',
    actionLabel: 'Start Analysis',
  },
];

const notificationTypeConfig = {
  analysis: {
    icon: FileSearch,
    color: 'text-brand-500',
    bgColor: 'bg-brand-500/10',
  },
  price_alert: {
    icon: TrendingDown,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  recall: {
    icon: AlertTriangle,
    color: 'text-error',
    bgColor: 'bg-error/10',
  },
  system: {
    icon: Info,
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  promotion: {
    icon: DollarSign,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
};

type FilterType = 'all' | 'unread' | 'analysis' | 'price_alert' | 'recall' | 'system';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter className="w-4 h-4" />
              {filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : filter.replace('_', ' ')}
              <ChevronDown className="w-4 h-4" />
            </Button>

            {showFilterMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFilterMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-secondary border border-white/10 rounded-lg shadow-xl z-20 py-1">
                  {[
                    { value: 'all', label: 'All Notifications' },
                    { value: 'unread', label: 'Unread Only' },
                    { value: 'analysis', label: 'Analysis Updates' },
                    { value: 'price_alert', label: 'Price Alerts' },
                    { value: 'recall', label: 'Safety Recalls' },
                    { value: 'system', label: 'System' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilter(option.value as FilterType);
                        setShowFilterMenu(false);
                      }}
                      className={cn(
                        'w-full px-3 py-2 text-sm text-left hover:bg-surface-tertiary transition-colors',
                        filter === option.value && 'text-brand-500 bg-brand-500/10'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Notification Settings Link */}
      <Card className="bg-surface-secondary/50">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <p className="font-medium">Notification Preferences</p>
              <p className="text-sm text-muted-foreground">
                Configure email, push, and in-app notifications
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href="/dashboard/settings">Manage</a>
          </Button>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const config = notificationTypeConfig[notification.type];
            const Icon = config.icon;

            return (
              <Card
                key={notification.id}
                className={cn(
                  'transition-all hover:border-brand-500/30',
                  !notification.read && 'border-l-2 border-l-brand-500 bg-brand-500/5'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                        config.bgColor
                      )}
                    >
                      <Icon className={cn('w-5 h-5', config.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className={cn('font-medium', !notification.read && 'text-foreground')}>
                            {notification.title}
                          </h3>
                          {notification.vehicleInfo && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Car className="w-3 h-3" />
                              {notification.vehicleInfo.year} {notification.vehicleInfo.make}{' '}
                              {notification.vehicleInfo.model}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(notification.timestamp)}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        {notification.actionUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={notification.actionUrl}>{notification.actionLabel}</a>
                          </Button>
                        )}
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark as read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:text-error ml-auto"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-tertiary flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                {filter === 'unread'
                  ? "You're all caught up! No unread notifications."
                  : 'You have no notifications matching this filter.'}
              </p>
              {filter !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setFilter('all')}
                >
                  View all notifications
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Clear Read Button */}
      {notifications.filter((n) => n.read).length > 0 && (
        <div className="flex justify-center pt-4">
          <Button variant="ghost" size="sm" onClick={clearAllRead} className="text-muted-foreground">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear all read notifications
          </Button>
        </div>
      )}
    </div>
  );
}
