'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Heart, Shirt, Droplets, Trash2 } from 'lucide-react';
import { useWardrobeStore } from '@/lib/store/wardrobe';
import { useAuthStore } from '@/lib/store/auth';
import { toast } from 'sonner';
import type { InventoryState } from '@/types/wardrobe.types';
import { useEffect } from 'react';

const CARE_COLORS: Record<string, string> = {
  clean: 'bg-green-500',
  'due-soon': 'bg-orange-500',
  overdue: 'bg-red-500',
  'in-care': 'bg-blue-500',
};

const CARE_LABELS: Record<string, string> = {
  clean: 'Clean',
  'due-soon': 'Due Soon',
  overdue: 'Overdue',
  'in-care': 'In Care',
};

const STATUS_OPTIONS: { value: InventoryState; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'in-laundry', label: 'In Laundry' },
  { value: 'in-dry-cleaning', label: 'At Dry Cleaner' },
  { value: 'lent-out', label: 'Lent Out' },
  { value: 'stored', label: 'Stored' },
  { value: 'needs-repair', label: 'Needs Repair' },
];

const COLOR_MAP: Record<string, string> = {
  black: '#000', white: '#fff', navy: '#001f3f', grey: '#888', charcoal: '#333',
  brown: '#8B4513', tan: '#D2B48C', beige: '#F5F5DC', cream: '#FFFDD0', blue: '#0074D9',
  'light-blue': '#7FDBFF', red: '#FF4136', burgundy: '#800020', green: '#2ECC40',
  olive: '#3D9970', pink: '#FF69B4', purple: '#B10DC9', orange: '#FF851B', yellow: '#FFDC00',
  multi: '#ccc',
};

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const items = useWardrobeStore((s) => s.items);
  const toggleFavorite = useWardrobeStore((s) => s.toggleFavorite);
  const logWear = useWardrobeStore((s) => s.logWear);
  const setInventoryState = useWardrobeStore((s) => s.setInventoryState);
  const markCareComplete = useWardrobeStore((s) => s.markCareComplete);
  const deleteItem = useWardrobeStore((s) => s.deleteItem);

  const item = items.find((i) => i.id === id);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Item not found</p>
          <Button variant="link" asChild><Link href="/wardrobe">Back to Wardrobe</Link></Button>
        </div>
      </div>
    );
  }

  const handleLogWear = () => {
    logWear(item.id);
    toast.success('Wear logged!');
  };

  const handleMarkClean = () => {
    markCareComplete(item.id);
    toast.success('Marked as clean!');
  };

  const handleDelete = () => {
    deleteItem(item.id);
    toast.success('Item deleted');
    router.push('/wardrobe');
  };

  const daysSinceWorn = item.lastWornAt
    ? Math.floor((Date.now() - new Date(item.lastWornAt).getTime()) / 86400000)
    : null;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />Back
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{item.brand || item.subcategory}</h1>
          <p className="text-muted-foreground capitalize">{item.category} &middot; {item.subcategory}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(item.id)}>
          <Heart className={`w-5 h-5 ${item.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

      <div className="aspect-video bg-muted rounded-xl flex items-center justify-center relative">
        <Shirt className="w-20 h-20 text-muted-foreground/20" />
        <div className="absolute top-4 right-4">
          <Badge variant={item.careState === 'overdue' ? 'destructive' : item.careState === 'due-soon' ? 'secondary' : 'default'}>
            {CARE_LABELS[item.careState]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <Card><CardContent className="pt-4 pb-3">
          <p className="text-2xl font-bold">{item.wearCount}</p>
          <p className="text-xs text-muted-foreground">Total Wears</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-3">
          <p className="text-2xl font-bold">{daysSinceWorn ?? '-'}</p>
          <p className="text-xs text-muted-foreground">Days Since Worn</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-3">
          <p className="text-2xl font-bold capitalize">{item.condition}</p>
          <p className="text-xs text-muted-foreground">Condition</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Colors</span>
            <div className="flex gap-1.5 items-center">
              {item.colors.map((c) => (
                <div key={c} className="w-4 h-4 rounded-full border" style={{ background: COLOR_MAP[c] || '#ccc' }} title={c} />
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Material</span>
            <span className="capitalize">{item.material}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pattern</span>
            <span className="capitalize">{item.pattern}</span>
          </div>
          {item.size && (<><Separator /><div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Size</span>
            <span>{item.size}</span>
          </div></>)}
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Seasons</span>
            <span className="capitalize">{item.seasons.join(', ')}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Status</CardTitle></CardHeader>
        <CardContent>
          <Select value={item.inventoryState} onValueChange={(v) => setInventoryState(item.id, v as InventoryState)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Droplets className="w-4 h-4" />Care</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Type</span>
            <span className="capitalize">{item.careProfile.type.replace('-', ' ')}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Wears Before Care</span>
            <span>{item.careProfile.wearsBeforeCare}</span>
          </div>
          {item.careProfile.lastCaredAt && (<><Separator /><div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Cleaned</span>
            <span>{new Date(item.careProfile.lastCaredAt).toLocaleDateString()}</span>
          </div></>)}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={handleLogWear} className="w-full">Log Wear</Button>
        <Button variant="outline" onClick={handleMarkClean} className="w-full">
          <Droplets className="w-4 h-4 mr-2" />Mark Clean
        </Button>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            <Trash2 className="w-4 h-4 mr-2" />Delete Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {item.brand || item.subcategory}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone. The item will be permanently removed from your wardrobe.</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
