import type { WardrobeItem, OccasionType } from '@/types/wardrobe.types';

type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'cold';

interface OutfitSuggestion {
  id: string;
  items: WardrobeItem[];
  confidence: number;
  reasoning: string;
  occasion: OccasionType;
}

const FORMALITY_MAP: Record<OccasionType, [number, number]> = {
  work: [3, 5],
  casual: [1, 3],
  formal: [4, 5],
  date: [3, 4],
  workout: [1, 1],
  outdoor: [1, 2],
  travel: [1, 3],
  event: [4, 5],
};

export function generateOutfits(
  availableItems: WardrobeItem[],
  occasion: OccasionType,
  weather: WeatherCondition
): OutfitSuggestion[] {
  const [minFormality, maxFormality] = FORMALITY_MAP[occasion] || [1, 5];
  const items = availableItems.filter(
    (i) => i.inventoryState === 'available' && i.formality >= minFormality && i.formality <= maxFormality
  );

  const tops = items.filter((i) => i.category === 'tops');
  const bottoms = items.filter((i) => i.category === 'bottoms');
  const shoes = items.filter((i) => i.category === 'shoes');
  const outerwear = items.filter((i) => i.category === 'outerwear');

  if (tops.length === 0 || bottoms.length === 0) return [];

  const suggestions: OutfitSuggestion[] = [];
  const usedCombos = new Set<string>();

  for (let i = 0; i < 3 && suggestions.length < 3; i++) {
    const top = tops[Math.floor(Math.random() * tops.length)];
    const bottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    const shoe = shoes.length > 0 ? shoes[Math.floor(Math.random() * shoes.length)] : null;
    const outer = (weather === 'cold' || weather === 'rainy') && outerwear.length > 0
      ? outerwear[Math.floor(Math.random() * outerwear.length)]
      : null;

    const comboKey = `${top.id}-${bottom.id}`;
    if (usedCombos.has(comboKey)) continue;
    usedCombos.add(comboKey);

    const outfitItems = [top, bottom, ...(shoe ? [shoe] : []), ...(outer ? [outer] : [])];
    const confidence = Math.max(65, Math.min(95, 85 - suggestions.length * 10 + Math.floor(Math.random() * 10)));

    const reasonParts = [`${top.brand || top.subcategory} pairs well with ${bottom.brand || bottom.subcategory}`];
    if (outer) reasonParts.push(`Layer with ${outer.brand || outer.subcategory} for ${weather} weather`);
    if (shoe) reasonParts.push(`${shoe.brand || shoe.subcategory} completes the look`);

    suggestions.push({
      id: `outfit-${Date.now()}-${i}`,
      items: outfitItems,
      confidence,
      reasoning: reasonParts.join('. ') + '.',
      occasion,
    });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}
