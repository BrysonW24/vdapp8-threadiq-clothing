/**
 * ThreadIQ Wardrobe Types
 * Core data model for the Wardrobe Operating System
 */

// ============================================
// ITEM CATEGORIES & CLASSIFICATION
// ============================================

export type ItemCategory =
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'suits'
  | 'shoes'
  | 'accessories';

export type ItemSubcategory =
  // Tops
  | 't-shirt'
  | 'shirt'
  | 'polo'
  | 'sweater'
  | 'hoodie'
  | 'tank'
  | 'blouse'
  // Bottoms
  | 'jeans'
  | 'chinos'
  | 'trousers'
  | 'shorts'
  | 'skirt'
  // Outerwear
  | 'jacket'
  | 'blazer'
  | 'coat'
  | 'vest'
  | 'cardigan'
  // Suits
  | 'suit-jacket'
  | 'suit-pants'
  | 'full-suit'
  // Shoes
  | 'sneakers'
  | 'dress-shoes'
  | 'boots'
  | 'loafers'
  | 'sandals'
  | 'chelsea-boots'
  // Accessories
  | 'belt'
  | 'watch'
  | 'tie'
  | 'scarf'
  | 'hat'
  | 'bag'
  | 'sunglasses'
  | 'jewelry';

export type ItemColor =
  | 'black'
  | 'white'
  | 'navy'
  | 'grey'
  | 'charcoal'
  | 'brown'
  | 'tan'
  | 'beige'
  | 'cream'
  | 'blue'
  | 'light-blue'
  | 'red'
  | 'burgundy'
  | 'green'
  | 'olive'
  | 'pink'
  | 'purple'
  | 'orange'
  | 'yellow'
  | 'multi';

export type ItemPattern =
  | 'solid'
  | 'striped'
  | 'checked'
  | 'plaid'
  | 'floral'
  | 'printed'
  | 'textured'
  | 'herringbone'
  | 'houndstooth';

export type ItemMaterial =
  | 'cotton'
  | 'wool'
  | 'linen'
  | 'silk'
  | 'leather'
  | 'suede'
  | 'denim'
  | 'polyester'
  | 'nylon'
  | 'cashmere'
  | 'velvet'
  | 'synthetic'
  | 'blend';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'all-season';

// Formality: 1 = Very Casual, 5 = Very Formal
export type FormalityScore = 1 | 2 | 3 | 4 | 5;

// ============================================
// CARE & MAINTENANCE
// ============================================

export type CareType =
  | 'machine-wash'
  | 'hand-wash'
  | 'dry-clean'
  | 'spot-clean'
  | 'air-only'
  | 'leather-care';

export type CareState =
  | 'clean'
  | 'due-soon'
  | 'overdue'
  | 'in-care';

export type InventoryState =
  | 'available'
  | 'in-laundry'
  | 'in-dry-cleaning'
  | 'in-repair'
  | 'archived'
  | 'donated'
  | 'sold';

export interface CareProfile {
  type: CareType;
  wearsBeforeCare: number; // How many wears before care needed
  lastCaredAt: string | null; // ISO date
  notes?: string;
}

// ============================================
// WARDROBE ITEM (Core Entity)
// ============================================

export interface WardrobeItem {
  id: string;

  // Classification
  category: ItemCategory;
  subcategory: ItemSubcategory;

  // Appearance
  colors: ItemColor[];
  pattern: ItemPattern;
  material: ItemMaterial;

  // Context
  seasons: Season[];
  formality: FormalityScore;

  // Details
  brand?: string;
  size?: string;
  fit?: 'slim' | 'regular' | 'relaxed' | 'oversized';

  // Purchase Info
  purchaseDate?: string; // ISO date
  purchasePrice?: number;
  purchaseLocation?: string;

  // Condition & State
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'worn';
  inventoryState: InventoryState;

  // Images
  imageUri: string; // Local or remote URI
  thumbnailUri?: string;

  // Care
  careProfile: CareProfile;
  careState: CareState;

  // Usage Tracking
  wearCount: number;
  lastWornAt: string | null; // ISO date

  // Metadata
  notes?: string;
  tags?: string[];
  isFavorite: boolean;

  // Timestamps
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

// ============================================
// OUTFIT
// ============================================

export type OccasionType =
  | 'work'
  | 'casual'
  | 'formal'
  | 'date'
  | 'workout'
  | 'outdoor'
  | 'travel'
  | 'event';

export type OutfitState =
  | 'suggested'
  | 'saved'
  | 'worn'
  | 'archived';

export interface Outfit {
  id: string;
  name?: string;

  // Items (by ID)
  itemIds: string[];

  // Context
  occasion: OccasionType;
  seasons: Season[];

  // State
  state: OutfitState;

  // Tracking
  wornCount: number;
  lastWornAt: string | null;

  // AI Generated
  isAiGenerated: boolean;
  aiReasoning?: string; // "Why this outfit"

  // Metadata
  notes?: string;
  isFavorite: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================
// WARDROBE ANALYTICS
// ============================================

export interface ItemAnalytics {
  itemId: string;
  costPerWear: number;
  utilisation: number; // 0-100%
  daysSinceLastWorn: number;
  careCompliance: number; // 0-100%
}

export interface WardrobeInsights {
  totalItems: number;
  totalValue: number;
  avgCostPerWear: number;
  mostWornItems: string[]; // Item IDs
  leastWornItems: string[]; // Item IDs
  categoryDistribution: Record<ItemCategory, number>;
  colorDistribution: Record<ItemColor, number>;
  seasonalBalance: Record<Season, number>;
  donationCandidates: string[]; // Items not worn in 6+ months
}

// ============================================
// STATE SLICES
// ============================================

export interface WardrobeState {
  items: WardrobeItem[];
  outfits: Outfit[];
  isLoading: boolean;
  error: string | null;

  // Filters
  activeFilters: {
    categories: ItemCategory[];
    colors: ItemColor[];
    seasons: Season[];
    inventoryStates: InventoryState[];
    careStates: CareState[];
  };

  // View
  viewMode: 'grid' | 'list';
  sortBy: 'recent' | 'name' | 'wearCount' | 'lastWorn' | 'category';
}

// ============================================
// API / ACTION PAYLOADS
// ============================================

export interface AddItemPayload {
  imageUri: string;
  category: ItemCategory;
  subcategory: ItemSubcategory;
  colors: ItemColor[];
  pattern?: ItemPattern;
  material?: ItemMaterial;
  seasons?: Season[];
  formality?: FormalityScore;
  brand?: string;
  size?: string;
  purchasePrice?: number;
  careType?: CareType;
  notes?: string;
}

export interface UpdateItemPayload {
  id: string;
  updates: Partial<Omit<WardrobeItem, 'id' | 'createdAt'>>;
}

export interface LogWearPayload {
  itemId: string;
  outfitId?: string;
  date?: string; // ISO date, defaults to now
}

export interface GenerateOutfitPayload {
  occasion: OccasionType;
  weather?: {
    temperature: number;
    conditions: 'sunny' | 'cloudy' | 'rainy' | 'cold';
  };
  excludeItemIds?: string[];
}
