/**
 * ThreadIQ Wishlist Types
 * Items users want but don't own yet — drives trending data
 */

import type { ItemCategory, ItemSubcategory, ItemColor } from './wardrobe.types';

// ============================================
// WISHLIST PRIORITY
// ============================================

export type WishlistPriority = 'must-have' | 'want' | 'maybe';

// ============================================
// WISHLIST ITEM
// ============================================

export interface WishlistItem {
  id: string;
  name: string;
  brand?: string;
  imageUri: string;
  category: ItemCategory;
  subcategory?: ItemSubcategory;
  colors: ItemColor[];
  price?: number;
  currency?: string;
  salePrice?: number;
  retailerName?: string;
  productUrl?: string;
  priority: WishlistPriority;
  notes?: string;
  addedFromUrl: boolean; // true if added via URL scraper
  wardrobeItemId?: string; // set when moved to wardrobe
  isFavorite: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

// ============================================
// PAYLOADS
// ============================================

export interface AddWishlistPayload {
  name: string;
  brand?: string;
  imageUri: string;
  category: ItemCategory;
  subcategory?: ItemSubcategory;
  colors: ItemColor[];
  price?: number;
  currency?: string;
  salePrice?: number;
  retailerName?: string;
  productUrl?: string;
  priority?: WishlistPriority;
  notes?: string;
  addedFromUrl?: boolean;
}

export interface UpdateWishlistPayload {
  id: string;
  changes: Partial<Omit<WishlistItem, 'id' | 'createdAt'>>;
}

// ============================================
// SORT OPTIONS
// ============================================

export type WishlistSortBy = 'recent' | 'priority' | 'price-low' | 'price-high' | 'name';

// ============================================
// REDUX STATE
// ============================================

export interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  sortBy: WishlistSortBy;
  filterCategory: ItemCategory | null;
}
