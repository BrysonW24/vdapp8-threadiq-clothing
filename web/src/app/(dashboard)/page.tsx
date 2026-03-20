'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shirt, Plus, Sparkles, AlertTriangle, Heart, Package } from 'lucide-react';
import { useWardrobeStore } from '@/lib/store/wardrobe';
import { useAuthStore } from '@/lib/store/auth';

export default function DashboardPage() {
  const items = useWardrobeStore((s) => s.items);
  const user = useAuthStore((s) => s.user);

  const stats = useMemo(() => {
    const available = items.filter((i) => i.inventoryState === 'available').length;
    const careAlerts = items.filter((i) => i.careState === 'due-soon' || i.careState === 'overdue').length;
    const favorites = items.filter((i) => i.isFavorite).length;
    return { total: items.length, available, careAlerts, favorites };
  }, [items]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{greeting}, {user?.displayName || 'there'}</h1>
        <p className="text-muted-foreground">Here&apos;s your wardrobe at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Package className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><Shirt className="w-5 h-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10"><AlertTriangle className="w-5 h-5 text-orange-500" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.careAlerts}</p>
                <p className="text-xs text-muted-foreground">Care Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10"><Heart className="w-5 h-5 text-red-500" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.favorites}</p>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <Link href="/item/add">
            <CardContent className="pt-6 flex flex-col items-center gap-3 text-center">
              <div className="p-3 rounded-full bg-primary/10"><Plus className="w-6 h-6 text-primary" /></div>
              <div>
                <p className="font-medium">Add Item</p>
                <p className="text-xs text-muted-foreground">Add to your wardrobe</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <Link href="/wardrobe">
            <CardContent className="pt-6 flex flex-col items-center gap-3 text-center">
              <div className="p-3 rounded-full bg-primary/10"><Shirt className="w-6 h-6 text-primary" /></div>
              <div>
                <p className="font-medium">Browse Wardrobe</p>
                <p className="text-xs text-muted-foreground">View all your items</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <Link href="/outfits">
            <CardContent className="pt-6 flex flex-col items-center gap-3 text-center">
              <div className="p-3 rounded-full bg-primary/10"><Sparkles className="w-6 h-6 text-primary" /></div>
              <div>
                <p className="font-medium">Get Outfit Ideas</p>
                <p className="text-xs text-muted-foreground">AI-powered suggestions</p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {stats.careAlerts > 0 && (
        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Care Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {items
                .filter((i) => i.careState === 'overdue' || i.careState === 'due-soon')
                .slice(0, 3)
                .map((item) => (
                  <Link key={item.id} href={`/item/${item.id}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                    <span className="text-sm font-medium">{item.brand || item.subcategory}</span>
                    <Badge variant={item.careState === 'overdue' ? 'destructive' : 'secondary'}>
                      {item.careState === 'overdue' ? 'Overdue' : 'Due Soon'}
                    </Badge>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
