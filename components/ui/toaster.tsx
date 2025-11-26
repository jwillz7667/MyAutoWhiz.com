'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration ?? 5000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    // Return a no-op version if used outside provider
    return {
      toast: (props: Omit<Toast, 'id'>) => console.log('Toast:', props),
      dismiss: (id: string) => {},
    };
  }

  return {
    toast: context.addToast,
    dismiss: context.removeToast,
  };
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  // Simple implementation without context for now
  React.useEffect(() => {
    const handleToast = (e: CustomEvent<Omit<Toast, 'id'>>) => {
      const id = Math.random().toString(36).slice(2, 9);
      const toast = { ...e.detail, id };
      
      setToasts((prev) => [...prev, toast]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, e.detail.duration ?? 5000);
    };

    window.addEventListener('toast' as any, handleToast as EventListener);
    return () => window.removeEventListener('toast' as any, handleToast as EventListener);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const variantStyles = {
    default: 'bg-surface-secondary border-surface-border',
    success: 'bg-success/10 border-success/30',
    error: 'bg-error/10 border-error/30',
    warning: 'bg-warning/10 border-warning/30',
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in-right min-w-[300px] max-w-[400px]',
            variantStyles[toast.variant || 'default']
          )}
        >
          <div className="flex-1">
            {toast.title && (
              <p className="font-medium text-foreground">{toast.title}</p>
            )}
            {toast.description && (
              <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// Helper function to show toast from anywhere
export function toast(props: Omit<Toast, 'id'>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toast', { detail: props }));
  }
}
