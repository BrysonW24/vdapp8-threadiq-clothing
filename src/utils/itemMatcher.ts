/**
 * Item matching utility — finds similar items in user's wardrobe
 */

import { WardrobeItem } from '../types/wardrobe.types';
import { TrendingItem } from '../types/discover.types';

export function findSimilarItems(
  trendingItem: TrendingItem,
  userItems: WardrobeItem[],
): WardrobeItem[] {
  return userItems
    .filter((item) => {
      const categoryMatch = item.category === trendingItem.category;
      const colorOverlap = item.colors.some((c) => trendingItem.colors.includes(c));
      const brandMatch =
        item.brand?.toLowerCase() === trendingItem.brand?.toLowerCase() &&
        !!trendingItem.brand;
      return categoryMatch && (colorOverlap || brandMatch);
    })
    .slice(0, 5);
}
