/**
 * ThreadIQ Shop Slice
 * Manages purchase lifecycle: intent → confirmation → wardrobe addition
 */

import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import {
  ShopState,
  Purchase,
  PurchaseStatus,
  RecordPurchaseIntentPayload,
  AddPurchaseToWardrobePayload,
} from '../../types/shop.types';
import { addItem } from './wardrobeSlice';

// ============================================
// HELPERS
// ============================================

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ============================================
// INITIAL STATE
// ============================================

const initialState: ShopState = {
  purchases: [],
  isLoading: false,
  error: null,
};

// ============================================
// ASYNC THUNKS
// ============================================

export const recordPurchaseIntent = createAsyncThunk(
  'shop/recordPurchaseIntent',
  async (payload: RecordPurchaseIntentPayload, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();
      const purchase: Purchase = {
        id: generateId(),
        sourceTrendingItemId: payload.trendingItemId,
        sourceAffiliateLinkId: payload.affiliateLinkId,
        productName: payload.productName,
        brand: payload.brand,
        imageUri: payload.imageUri,
        retailerName: payload.retailerName,
        price: payload.price,
        currency: payload.currency,
        salePrice: payload.salePrice,
        productUrl: payload.productUrl,
        suggestedCategory: payload.suggestedCategory,
        suggestedSubcategory: payload.suggestedSubcategory,
        suggestedColors: payload.suggestedColors,
        status: 'pending',
        clickedAt: now,
        createdAt: now,
        updatedAt: now,
      };
      return purchase;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to record purchase intent');
    }
  },
);

export const addPurchaseToWardrobe = createAsyncThunk(
  'shop/addPurchaseToWardrobe',
  async (payload: AddPurchaseToWardrobePayload, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const purchase = state.shop.purchases.find((p) => p.id === payload.purchaseId);
      if (!purchase) {
        return rejectWithValue('Purchase not found');
      }

      // Cross-dispatch addItem to create the wardrobe item
      const result = await dispatch(
        addItem({
          imageUri: purchase.imageUri,
          category: payload.category,
          subcategory: payload.subcategory,
          colors: payload.colors,
          brand: payload.brand,
          size: payload.size,
          purchasePrice: payload.purchasePrice,
          notes: payload.notes,
        }),
      ).unwrap();

      const now = new Date().toISOString();
      return {
        purchaseId: payload.purchaseId,
        wardrobeItemId: result.id,
        now,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add purchase to wardrobe');
    }
  },
);

// ============================================
// SLICE
// ============================================

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    confirmPurchase(state, action: PayloadAction<string>) {
      const purchase = state.purchases.find((p) => p.id === action.payload);
      if (purchase && purchase.status === 'pending') {
        purchase.status = 'ordered';
        purchase.orderedAt = new Date().toISOString();
        purchase.updatedAt = new Date().toISOString();
      }
    },
    advancePurchaseStatus(
      state,
      action: PayloadAction<{ purchaseId: string; status: PurchaseStatus }>,
    ) {
      const purchase = state.purchases.find((p) => p.id === action.payload.purchaseId);
      if (purchase) {
        const now = new Date().toISOString();
        purchase.status = action.payload.status;
        purchase.updatedAt = now;
        if (action.payload.status === 'shipped') purchase.shippedAt = now;
        if (action.payload.status === 'delivered') purchase.deliveredAt = now;
      }
    },
    dismissPurchase(state, action: PayloadAction<string>) {
      state.purchases = state.purchases.filter((p) => p.id !== action.payload);
    },
    loadMockPurchases(state, action: PayloadAction<Purchase[]>) {
      // Merge mock purchases, avoiding duplicates
      const existingIds = new Set(state.purchases.map((p) => p.id));
      const newPurchases = action.payload.filter((p) => !existingIds.has(p.id));
      state.purchases.unshift(...newPurchases);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Record purchase intent
    builder
      .addCase(recordPurchaseIntent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(recordPurchaseIntent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchases.unshift(action.payload);
      })
      .addCase(recordPurchaseIntent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add purchase to wardrobe
    builder
      .addCase(addPurchaseToWardrobe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPurchaseToWardrobe.fulfilled, (state, action) => {
        state.isLoading = false;
        const purchase = state.purchases.find(
          (p) => p.id === action.payload.purchaseId,
        );
        if (purchase) {
          purchase.status = 'in-wardrobe';
          purchase.wardrobeItemId = action.payload.wardrobeItemId;
          purchase.addedToWardrobeAt = action.payload.now;
          purchase.updatedAt = action.payload.now;
        }
      })
      .addCase(addPurchaseToWardrobe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================
// EXPORTS
// ============================================

export const {
  confirmPurchase,
  advancePurchaseStatus,
  dismissPurchase,
  loadMockPurchases,
  clearError,
} = shopSlice.actions;

export default shopSlice.reducer;

// ============================================
// SELECTORS
// ============================================

export const selectActivePurchases = createSelector(
  [(state: RootState) => state.shop.purchases],
  (purchases): Purchase[] =>
    purchases
      .filter((p) => p.status !== 'in-wardrobe')
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
);

export const selectPurchaseById = (id: string) =>
  createSelector(
    [(state: RootState) => state.shop.purchases],
    (purchases) => purchases.find((p) => p.id === id),
  );

export const selectAllPurchases = (state: RootState) => state.shop.purchases;
export const selectShopLoading = (state: RootState) => state.shop.isLoading;
export const selectShopError = (state: RootState) => state.shop.error;
