'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuthStore } from '@/lib/store/auth';
import { useWardrobeStore } from '@/lib/store/wardrobe';
import { SEED_ITEMS } from '@/lib/seed-data';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const items = useWardrobeStore((s) => s.items);
  const loadSeedData = useWardrobeStore((s) => s.loadSeedData);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Load seed data on first visit
  useEffect(() => {
    if (isAuthenticated && items.length === 0) {
      loadSeedData(SEED_ITEMS);
    }
  }, [isAuthenticated, items.length, loadSeedData]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
