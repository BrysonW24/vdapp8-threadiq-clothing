/**
 * ThreadIQ Discover / "Dress Like X" Types
 * Data model for style profiles, affiliate links, trending, and follows
 */

import { WardrobeItem, Outfit, ItemCategory, ItemColor } from './wardrobe.types';

// ============================================
// STYLE PROFILE (Influencer or Sharing User)
// ============================================

export type StyleProfileType = 'influencer' | 'user';

export type StyleTag =
  | 'minimalist'
  | 'streetwear'
  | 'classic'
  | 'bohemian'
  | 'preppy'
  | 'athleisure'
  | 'luxury'
  | 'vintage'
  | 'scandinavian'
  | 'smart-casual'
  | 'workwear'
  | 'edgy';

export interface StyleProfile {
  id: string;
  type: StyleProfileType;

  // Identity
  displayName: string;
  handle: string;
  avatarUri: string;
  bio: string;
  location?: string;

  // Style
  styleTags: StyleTag[];
  primaryStyle: StyleTag;

  // Social
  followerCount: number;
  followingCount: number;
  isVerified: boolean;

  // Wardrobe (shared subset)
  sharedItemIds: string[];
  sharedOutfitIds: string[];
  totalSharedItems: number;
  totalSharedOutfits: number;

  // Engagement
  totalLikes: number;
  trendingScore: number;

  // Privacy
  isPublic: boolean;
  shareWardrobe: boolean;

  // Metadata
  joinedAt: string;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// AFFILIATE LINK
// ============================================

export type RetailerName =
  | 'THE ICONIC'
  | 'ASOS'
  | 'Farfetch'
  | 'SSENSE'
  | 'Net-a-Porter'
  | 'Mr Porter'
  | 'Uniqlo'
  | 'Zara'
  | 'H&M'
  | 'Generic';

export interface AffiliateLink {
  id: string;
  itemId: string;

  // Retailer
  retailerName: RetailerName;
  retailerLogoUri?: string;

  // Product
  productUrl: string;
  affiliateUrl: string;
  productName: string;
  price: number;
  currency: string;
  salePrice?: number;
  inStock: boolean;

  // Tracking
  commissionRate?: number;
  clickCount: number;
  conversionCount: number;

  // Metadata
  lastCheckedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TRENDING ITEM
// ============================================

export interface TrendingItem {
  id: string;

  // Source
  sourceItemId: string;
  sourceProfileId: string;

  // Item snapshot (denormalized for feed performance)
  name: string;
  imageUri: string;
  brand?: string;
  category: ItemCategory;
  colors: ItemColor[];

  // Trending metrics
  trendingScore: number;
  wearCount: number;
  saveCount: number;
  viewCount: number;

  // Affiliate
  affiliateLinks: AffiliateLink[];

  // Time decay
  trendStartedAt: string;
  lastBoostedAt: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ============================================
// FOLLOW RELATIONSHIP
// ============================================

export interface FollowRelationship {
  id: string;
  followerId: string;
  followingId: string;
  followedAt: string;
}

// ============================================
// DISCOVER STATE SLICE
// ============================================

export interface DiscoverState {
  // Featured profiles (curated, shown on home)
  featuredProfiles: StyleProfile[];
  featuredProfilesLoading: boolean;

  // All browsable profiles
  allProfiles: StyleProfile[];
  allProfilesLoading: boolean;
  allProfilesPage: number;
  allProfilesHasMore: boolean;

  // Trending items
  trendingItems: TrendingItem[];
  trendingItemsLoading: boolean;

  // Follow system (local-first)
  followedProfileIds: string[];
  followRelationships: FollowRelationship[];

  // Saved/bookmarked items from discover
  savedTrendingItemIds: string[];

  // Selected profile (for StyleProfileScreen)
  selectedProfile: StyleProfile | null;
  selectedProfileItems: WardrobeItem[];
  selectedProfileOutfits: Outfit[];
  selectedProfileLoading: boolean;

  // Affiliate
  affiliateLinks: Record<string, AffiliateLink[]>;

  // Error
  error: string | null;
}

// ============================================
// API / ACTION PAYLOADS
// ============================================

export interface FetchFeaturedProfilesPayload {
  limit?: number;
}

export interface FetchTrendingItemsPayload {
  limit?: number;
  category?: string;
  timeRange?: 'day' | 'week' | 'month';
}

export interface ToggleFollowPayload {
  profileId: string;
}

export interface FetchProfileDetailPayload {
  profileId: string;
}
