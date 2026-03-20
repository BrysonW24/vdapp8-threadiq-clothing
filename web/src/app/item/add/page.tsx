'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useWardrobeStore } from '@/lib/store/wardrobe';
import { useAuthStore } from '@/lib/store/auth';
import { toast } from 'sonner';
import type { ItemCategory, ItemSubcategory, ItemColor, CareType } from '@/types/wardrobe.types';

const SUBCATEGORIES: Record<ItemCategory, { value: ItemSubcategory; label: string }[]> = {
  tops: [
    { value: 't-shirt', label: 'T-Shirt' }, { value: 'shirt', label: 'Shirt' },
    { value: 'polo', label: 'Polo' }, { value: 'sweater', label: 'Sweater' },
    { value: 'hoodie', label: 'Hoodie' }, { value: 'blouse', label: 'Blouse' },
  ],
  bottoms: [
    { value: 'jeans', label: 'Jeans' }, { value: 'chinos', label: 'Chinos' },
    { value: 'trousers', label: 'Trousers' }, { value: 'shorts', label: 'Shorts' },
    { value: 'skirt', label: 'Skirt' },
  ],
  outerwear: [
    { value: 'jacket', label: 'Jacket' }, { value: 'blazer', label: 'Blazer' },
    { value: 'coat', label: 'Coat' }, { value: 'vest', label: 'Vest' },
    { value: 'cardigan', label: 'Cardigan' },
  ],
  suits: [
    { value: 'suit-jacket', label: 'Suit Jacket' }, { value: 'suit-pants', label: 'Suit Pants' },
    { value: 'full-suit', label: 'Full Suit' },
  ],
  shoes: [
    { value: 'sneakers', label: 'Sneakers' }, { value: 'dress-shoes', label: 'Dress Shoes' },
    { value: 'boots', label: 'Boots' }, { value: 'loafers', label: 'Loafers' },
    { value: 'chelsea-boots', label: 'Chelsea Boots' },
  ],
  accessories: [
    { value: 'belt', label: 'Belt' }, { value: 'watch', label: 'Watch' },
    { value: 'tie', label: 'Tie' }, { value: 'scarf', label: 'Scarf' },
    { value: 'hat', label: 'Hat' }, { value: 'sunglasses', label: 'Sunglasses' },
  ],
};

const COLORS: { value: ItemColor; label: string; hex: string }[] = [
  { value: 'black', label: 'Black', hex: '#000' },
  { value: 'white', label: 'White', hex: '#fff' },
  { value: 'navy', label: 'Navy', hex: '#001f3f' },
  { value: 'grey', label: 'Grey', hex: '#888' },
  { value: 'charcoal', label: 'Charcoal', hex: '#333' },
  { value: 'brown', label: 'Brown', hex: '#8B4513' },
  { value: 'tan', label: 'Tan', hex: '#D2B48C' },
  { value: 'blue', label: 'Blue', hex: '#0074D9' },
  { value: 'light-blue', label: 'Light Blue', hex: '#7FDBFF' },
  { value: 'red', label: 'Red', hex: '#FF4136' },
  { value: 'green', label: 'Green', hex: '#2ECC40' },
  { value: 'pink', label: 'Pink', hex: '#FF69B4' },
];

const CARE_TYPES: { value: CareType; label: string }[] = [
  { value: 'machine-wash', label: 'Machine Wash' },
  { value: 'hand-wash', label: 'Hand Wash' },
  { value: 'dry-clean', label: 'Dry Clean' },
  { value: 'spot-clean', label: 'Spot Clean' },
];

const CATEGORIES: { value: ItemCategory; label: string }[] = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'suits', label: 'Suits' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessories', label: 'Accessories' },
];

export default function AddItemPage() {
  const router = useRouter();
  const addItem = useWardrobeStore((s) => s.addItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [step, setStep] = useState(1);

  const [category, setCategory] = useState<ItemCategory | ''>('');
  const [subcategory, setSubcategory] = useState<ItemSubcategory | ''>('');
  const [colors, setColors] = useState<ItemColor[]>([]);
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [careType, setCareType] = useState<CareType>('machine-wash');

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  const toggleColor = (color: ItemColor) => {
    setColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const canAdvance = step === 1 ? !!category : step === 2 ? !!subcategory && colors.length > 0 : true;

  const handleSubmit = () => {
    if (!category || !subcategory || colors.length === 0) return;
    addItem({
      imageUri: '/placeholder/generic.svg',
      category,
      subcategory,
      colors,
      brand: brand || undefined,
      size: size || undefined,
      careType,
    });
    toast.success('Item added to wardrobe!');
    router.push('/wardrobe');
  };

  return (
    <div className="max-w-lg mx-auto p-4 md:p-6 space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />Back
      </Button>

      <div>
        <h1 className="text-2xl font-semibold">Add Item</h1>
        <p className="text-sm text-muted-foreground">Step {step} of 3</p>
      </div>

      <div className="flex gap-1">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Category</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={category === value ? 'default' : 'outline'}
                  className="h-16"
                  onClick={() => { setCategory(value); setSubcategory(''); }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && category && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Type</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {SUBCATEGORIES[category]?.map(({ value, label }) => (
                  <Badge
                    key={value}
                    variant={subcategory === value ? 'default' : 'outline'}
                    className="cursor-pointer py-1.5 px-3"
                    onClick={() => setSubcategory(value)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Colors</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {COLORS.map(({ value, label, hex }) => (
                  <button
                    key={value}
                    onClick={() => toggleColor(value)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${colors.includes(value) ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-transparent'}`}
                    style={{ background: hex }}
                    title={label}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand (optional)</Label>
              <Input id="brand" placeholder="e.g. Nike, Uniqlo" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size (optional)</Label>
              <Input id="size" placeholder="e.g. M, 32, 42" value={size} onChange={(e) => setSize(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Care Instructions</Label>
              <Select value={careType} onValueChange={(v) => setCareType(v as CareType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CARE_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance}>
            Next<ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <Check className="w-4 h-4 mr-2" />Add to Wardrobe
          </Button>
        )}
      </div>
    </div>
  );
}
