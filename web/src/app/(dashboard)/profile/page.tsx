'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Shirt, Heart, TrendingUp, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { useWardrobeStore } from '@/lib/store/wardrobe';
import type { ItemCategory } from '@/types/wardrobe.types';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const items = useWardrobeStore((s) => s.items);

  const stats = useMemo(() => {
    const totalWears = items.reduce((sum, i) => sum + i.wearCount, 0);
    const favorites = items.filter((i) => i.isFavorite).length;

    const catCounts: Partial<Record<ItemCategory, number>> = {};
    items.forEach((i) => {
      catCounts[i.category] = (catCounts[i.category] || 0) + 1;
    });
    const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];

    return { totalItems: items.length, totalWears, favorites, topCategory };
  }, [items]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg">
                {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user?.displayName || 'User'}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Wardrobe Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex justify-center mb-1"><Shirt className="w-5 h-5 text-muted-foreground" /></div>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
              <p className="text-xs text-muted-foreground">Items</p>
            </div>
            <div>
              <div className="flex justify-center mb-1"><TrendingUp className="w-5 h-5 text-muted-foreground" /></div>
              <p className="text-2xl font-bold">{stats.totalWears}</p>
              <p className="text-xs text-muted-foreground">Total Wears</p>
            </div>
            <div>
              <div className="flex justify-center mb-1"><Heart className="w-5 h-5 text-muted-foreground" /></div>
              <p className="text-2xl font-bold">{stats.favorites}</p>
              <p className="text-xs text-muted-foreground">Favorites</p>
            </div>
          </div>
          {stats.topCategory && (
            <>
              <Separator />
              <p className="text-sm text-muted-foreground text-center">
                Most items: <span className="font-medium text-foreground capitalize">{stats.topCategory[0]}</span> ({stats.topCategory[1]})
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Button variant="destructive" className="w-full" onClick={logout}>
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
