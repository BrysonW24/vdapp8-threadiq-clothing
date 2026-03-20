'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shirt } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Shirt className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold">ThreadIQ</h1>
          <p className="text-sm text-muted-foreground">Smart Wardrobe Management</p>
        </div>
        {children}
      </div>
    </div>
  );
}
