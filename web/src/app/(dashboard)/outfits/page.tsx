'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Sparkles, ChevronLeft, ChevronRight, Shirt, Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';
import { useWardrobeStore } from '@/lib/store/wardrobe';
import { generateOutfits } from '@/lib/outfit-generator';
import type { OccasionType } from '@/types/wardrobe.types';
import { toast } from 'sonner';

type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'cold';

const WEATHER_OPTIONS: { value: WeatherCondition; label: string; icon: typeof Sun }[] = [
  { value: 'sunny', label: 'Sunny', icon: Sun },
  { value: 'cloudy', label: 'Cloudy', icon: Cloud },
  { value: 'rainy', label: 'Rainy', icon: CloudRain },
  { value: 'cold', label: 'Cold', icon: Snowflake },
];

const OCCASIONS: { value: OccasionType; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'date', label: 'Date' },
  { value: 'workout', label: 'Workout' },
  { value: 'outdoor', label: 'Outdoor' },
];

export default function OutfitsPage() {
  const items = useWardrobeStore((s) => s.items);
  const logWear = useWardrobeStore((s) => s.logWear);
  const [weather, setWeather] = useState<WeatherCondition>('sunny');
  const [occasion, setOccasion] = useState<OccasionType>('casual');
  const [currentIndex, setCurrentIndex] = useState(0);

  const suggestions = useMemo(() => {
    setCurrentIndex(0);
    return generateOutfits(items, occasion, weather);
  }, [items, occasion, weather]);

  const current = suggestions[currentIndex];

  const handleWear = () => {
    if (!current) return;
    current.items.forEach((item) => logWear(item.id));
    toast.success('Outfit logged as worn!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Outfit Suggestions
        </h1>
        <p className="text-sm text-muted-foreground">AI-powered outfit ideas based on your wardrobe</p>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium mb-2">Weather</p>
          <ToggleGroup type="single" value={weather} onValueChange={(v) => v && setWeather(v as WeatherCondition)}>
            {WEATHER_OPTIONS.map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem key={value} value={value} className="gap-1.5">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Occasion</p>
          <div className="flex gap-2 flex-wrap">
            {OCCASIONS.map(({ value, label }) => (
              <Badge
                key={value}
                variant={occasion === value ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setOccasion(value)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Shirt className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">Not enough items for outfit suggestions</p>
            <p className="text-xs text-muted-foreground mt-1">Add more tops and bottoms to get started</p>
          </CardContent>
        </Card>
      ) : current ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Suggestion {currentIndex + 1} of {suggestions.length}
              </CardTitle>
              <Badge variant="secondary">{current.confidence}% match</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {current.items.map((item) => (
                <div key={item.id} className="text-center">
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-2">
                    <Shirt className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-xs font-medium truncate">{item.brand || item.subcategory}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground italic">{current.reasoning}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => i - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" disabled={currentIndex === suggestions.length - 1} onClick={() => setCurrentIndex((i) => i + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={handleWear}>Wear This</Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
