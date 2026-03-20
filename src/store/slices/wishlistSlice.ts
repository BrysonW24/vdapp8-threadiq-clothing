/**
 * ThreadIQ Wishlist Slice
 * Manages wishlist items — things users want but don't own yet
 */

import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type {
  WishlistState,
  WishlistItem,
  AddWishlistPayload,
  UpdateWishlistPayload,
  WishlistSortBy,
  WishlistPriority,
} from '../../types/wishlist.types';
import type { ItemCategory } from '../../types/wardrobe.types';

// Generate unique ID (simple fallback if uuid not available)
function generateId(): string {
  return `wish_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
  sortBy: 'recent',
  filterCategory: null,
};

// ============================================
// ASYNC THUNKS
// ============================================

export const addWishlistItem = createAsyncThunk(
  'wishlist/addItem',
  async (payload: AddWishlistPayload) => {
    const now = new Date().toISOString();
    const item: WishlistItem = {
      id: generateId(),
      name: payload.name,
      brand: payload.brand,
      imageUri: payload.imageUri,
      category: payload.category,
      subcategory: payload.subcategory,
      colors: payload.colors,
      price: payload.price,
      currency: payload.currency || 'AUD',
      salePrice: payload.salePrice,
      retailerName: payload.retailerName,
      productUrl: payload.productUrl,
      priority: payload.priority || 'want',
      notes: payload.notes,
      addedFromUrl: payload.addedFromUrl || false,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };
    return item;
  },
);

// ============================================
// SLICE
// ============================================

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    updateWishlistItem: (state, action: PayloadAction<UpdateWishlistPayload>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload.changes,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    removeWishlistItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    toggleWishlistFavorite: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.isFavorite = !item.isFavorite;
        item.updatedAt = new Date().toISOString();
      }
    },

    setPriority: (state, action: PayloadAction<{ id: string; priority: WishlistPriority }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.priority = action.payload.priority;
        item.updatedAt = new Date().toISOString();
      }
    },

    markMovedToWardrobe: (state, action: PayloadAction<{ id: string; wardrobeItemId: string }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.wardrobeItemId = action.payload.wardrobeItemId;
        item.updatedAt = new Date().toISOString();
      }
    },

    setWishlistSort: (state, action: PayloadAction<WishlistSortBy>) => {
      state.sortBy = action.payload;
    },

    setWishlistFilterCategory: (state, action: PayloadAction<ItemCategory | null>) => {
      state.filterCategory = action.payload;
    },

    loadMockWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addWishlistItem.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });
  },
});

export const {
  updateWishlistItem,
  removeWishlistItem,
  toggleWishlistFavorite,
  setPriority,
  markMovedToWardrobe,
  setWishlistSort,
  setWishlistFilterCategory,
  loadMockWishlist,
} = wishlistSlice.actions;

// ============================================
// SELECTORS
// ============================================

const selectWishlistState = (state: { wishlist: WishlistState }) => state.wishlist;

export const selectWishlistItems = createSelector(
  [selectWishlistState],
  (wishlist) => {
    let items = wishlist.items.filter((i) => !i.wardrobeItemId); // exclude moved items

    // Filter by category
    if (wishlist.filterCategory) {
      items = items.filter((i) => i.category === wishlist.filterCategory);
    }

    // Sort
    switch (wishlist.sortBy) {
      case 'priority': {
        const priorityOrder: Record<string, number> = { 'must-have': 0, 'want': 1, 'maybe': 2 };
        return [...items].sort((a, b) => (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1));
      }
      case 'price-low':
        return [...items].sort((a, b) => (a.salePrice || a.price || 0) - (b.salePrice || b.price || 0));
      case 'price-high':
        return [...items].sort((a, b) => (b.salePrice || b.price || 0) - (a.salePrice || a.price || 0));
      case 'name':
        return [...items].sort((a, b) => a.name.localeCompare(b.name));
      case 'recent':
      default:
        return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },
);

export const selectWishlistCount = createSelector(
  [selectWishlistState],
  (wishlist) => wishlist.items.filter((i) => !i.wardrobeItemId).length,
);

export const selectMustHaveCount = createSelector(
  [selectWishlistState],
  (wishlist) => wishlist.items.filter((i) => !i.wardrobeItemId && i.priority === 'must-have').length,
);

export const selectWishlistSort = (state: { wishlist: WishlistState }) => state.wishlist.sortBy;
export const selectWishlistFilterCategory = (state: { wishlist: WishlistState }) => state.wishlist.filterCategory;

export default wishlistSlice.reducer;
