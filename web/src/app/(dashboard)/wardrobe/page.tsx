'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, List, Search, Plus, Heart, Shirt } from 'lucide-react';
import { useWardrobeStore, getFilteredItems } from '@/lib/store/wardrobe';
import { useDebounce } from '@/hooks/use-debounce';
import type { ItemCategory } from '@/types/wardrobe.types';

const CATEGORIES: { value: ItemCategory; label: string }[] = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'suits', label: 'Suits' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessories', label: 'Accessories' },
];

const CARE_COLORS: Record<string, string> = {
  clean: 'bg-green-500',
  'due-soon': 'bg-orange-500',
  overdue: 'bg-red-500',
  'in-care': 'bg-blue-500',
};

const COLOR_MAP: Record<string, string> = {
  black: '#000', white: '#fff', navy: '#001f3f', grey: '#888', charcoal: '#333',
  brown: '#8B4513', tan: '#D2B48C', beige: '#F5F5DC', cream: '#FFFDD0', blue: '#0074D9',
  'light-blue': '#7FDBFF', red: '#FF4136', burgundy: '#800020', green: '#2ECC40',
  olive: '#3D9970', pink: '#FF69B4', purple: '#B10DC9', orange: '#FF851B', yellow: '#FFDC00',
  multi: 'linear-gradient(135deg,#FF4136,#FFDC00,#0074D9)',
};

export default function WardrobePage() {
  const store = useWardrobeStore();
  const filteredItems = useMemo(() => getFilteredItems(store), [store]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const displayItems = useMemo(() => {
    if (!debouncedSearch) return filteredItems;
    const q = debouncedSearch.toLowerCase();
    return filteredItems.filter(
      (i) =>
        i.brand?.toLowerCase().includes(q) ||
        i.subcategory.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.colors.some((c) => c.toLowerCase().includes(q))
    );
  }, [filteredItems, debouncedSearch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Wardrobe</h1>
          <p className="text-sm text-muted-foreground">{displayItems.length} items</p>
        </div>
        <Button asChild size="sm">
          <Link href="/item/add"><Plus className="w-4 h-4 mr-2" />Add Item</Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search wardrobe..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={store.sortBy} onValueChange={(v) => store.setSortBy(v as typeof store.sortBy)}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="wearCount">Most Worn</SelectItem>
            <SelectItem value="lastWorn">Last Worn</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
        <ToggleGroup type="single" value={store.viewMode} onValueChange={(v) => v && store.setViewMode(v as 'grid' | 'list')}>
          <ToggleGroupItem value="grid" size="sm"><LayoutGrid className="w-4 h-4" /></ToggleGroupItem>
          <ToggleGroupItem value="list" size="sm"><List className="w-4 h-4" /></ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(({ value, label }) => (
          <Badge
            key={value}
            variant={store.activeFilters.categories.includes(value) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => store.toggleCategoryFilter(value)}
          >
            {label}
          </Badge>
        ))}
        {store.activeFilters.categories.length > 0 && (
          <Badge variant="secondary" className="cursor-pointer" onClick={() => store.clearFilters()}>Clear</Badge>
        )}
      </div>

      {displayItems.length === 0 ? (
        <div className="text-center py-16">
          <Shirt className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No items found</p>
        </div>
      ) : store.viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayItems.map((item) => (
            <Link key={item.id} href={`/item/${item.id}`}>
              <Card className="overflow-hidden hover:border-primary/50 transition-colors group">
                <div className="aspect-square bg-muted relative flex items-center justify-center">
                  <Shirt className="w-12 h-12 text-muted-foreground/30" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${CARE_COLORS[item.careState]}`} />
                  </div>
                  {item.isFavorite && (
                    <Heart className="absolute top-2 left-2 w-4 h-4 fill-red-500 text-red-500" />
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="font-medium text-sm truncate">{item.brand || item.subcategory}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                  <div className="flex gap-1 mt-2">
                    {item.colors.slice(0, 3).map((c) => (
                      <div key={c} className="w-3.5 h-3.5 rounded-full border" style={{ background: COLOR_MAP[c] || '#ccc' }} />
                    ))}
                    {item.colors.length > 3 && <span className="text-xs text-muted-foreground">+{item.colors.length - 3}</span>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {displayItems.map((item) => (
            <Link key={item.id} href={`/item/${item.id}`}>
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="p-3 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Shirt className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{item.brand || item.subcategory}</p>
                      {item.isFavorite && <Heart className="w-3 h-3 fill-red-500 text-red-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{item.category} &middot; {item.subcategory}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{item.wearCount} wears</span>
                    <div className={`w-2.5 h-2.5 rounded-full ${CARE_COLORS[item.careState]}`} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
