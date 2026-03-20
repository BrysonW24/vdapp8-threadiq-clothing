/**
 * ThreadIQ Shop Integration Types
 * Purchase lifecycle, order tracking, and wardrobe auto-add
 */

import { ItemCategory, ItemSubcategory, ItemColor } from './wardrobe.types';
import { RetailerName } from './discover.types';

// ============================================
// PURCHASE STATUS
// ============================================

export type PurchaseStatus =
  | 'pending'      // User tapped Shop, link opened, not yet confirmed
  | 'ordered'      // User confirmed they purchased
  | 'shipped'      // Mock: order in transit
  | 'delivered'    // Mock: order delivered
  | 'in-wardrobe'; // Added to wardrobe

// ============================================
// PURCHASE
// ============================================

export interface Purchase {
  id: string;

  // Source tracking
  sourceTrendingItemId?: string;
  sourceAffiliateLinkId?: string;

  // Product snapshot (denormalized at click time)
  productName: string;
  brand?: string;
  imageUri: string;
  retailerName: RetailerName;
  price: number;
  currency: string;
  salePrice?: number;
  productUrl: string;

  // Pre-filled wardrobe metadata
  suggestedCategory: ItemCategory;
  suggestedSubcategory?: ItemSubcategory;
  suggestedColors: ItemColor[];

  // Lifecycle
  status: PurchaseStatus;
  wardrobeItemId?: string;

  // Timestamps
  clickedAt: string;
  orderedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  addedToWardrobeAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// STATE
// ============================================

export interface ShopState {
  purchases: Purchase[];
  isLoading: boolean;
  error: string | null;
}

// ============================================
// ACTION PAYLOADS
// ============================================

export interface RecordPurchaseIntentPayload {
  trendingItemId: string;
  affiliateLinkId: string;
  productName: string;
  brand?: string;
  imageUri: string;
  retailerName: RetailerName;
  price: number;
  currency: string;
  salePrice?: number;
  productUrl: string;
  suggestedCategory: ItemCategory;
  suggestedSubcategory?: ItemSubcategory;
  suggestedColors: ItemColor[];
}

export interface AddPurchaseToWardrobePayload {
  purchaseId: string;
  category: ItemCategory;
  subcategory: ItemSubcategory;
  colors: ItemColor[];
  brand?: string;
  size?: string;
  purchasePrice?: number;
  notes?: string;
}
