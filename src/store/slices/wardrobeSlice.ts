/**
 * ThreadIQ Wardrobe Slice
 * Redux state management for wardrobe items and outfits
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  WardrobeState,
  WardrobeItem,
  Outfit,
  ItemCategory,
  ItemColor,
  Season,
  InventoryState,
  CareState,
  AddItemPayload,
  UpdateItemPayload,
  LogWearPayload,
  OccasionType,
} from '../../types/wardrobe.types';

// ============================================
// INITIAL STATE
// ============================================

const initialState: WardrobeState = {
  items: [],
  outfits: [],
  isLoading: false,
  error: null,
  activeFilters: {
    categories: [],
    colors: [],
    seasons: [],
    inventoryStates: [],
    careStates: [],
  },
  viewMode: 'grid',
  sortBy: 'recent',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const calculateCareState = (item: WardrobeItem): CareState => {
  const { careProfile, wearCount, inventoryState } = item;

  if (inventoryState === 'in-dry-cleaning' || inventoryState === 'in-laundry') {
    return 'in-care';
  }

  if (!careProfile.lastCaredAt) {
    // Never been cared for
    if (wearCount >= careProfile.wearsBeforeCare) {
      return 'overdue';
    }
    if (wearCount >= careProfile.wearsBeforeCare * 0.8) {
      return 'due-soon';
    }
    return 'clean';
  }

  // Calculate wears since last care
  // For simplicity, we're using wear count. In production, track wears since last care separately.
  const wearsSinceLastCare = wearCount % careProfile.wearsBeforeCare;

  if (wearsSinceLastCare >= careProfile.wearsBeforeCare) {
    return 'overdue';
  }
  if (wearsSinceLastCare >= careProfile.wearsBeforeCare * 0.8) {
    return 'due-soon';
  }
  return 'clean';
};

// ============================================
// ASYNC THUNKS
// ============================================

// Add a new item to wardrobe
export const addItem = createAsyncThunk(
  'wardrobe/addItem',
  async (payload: AddItemPayload, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();

      const newItem: WardrobeItem = {
        id: generateId(),
        category: payload.category,
        subcategory: payload.subcategory,
        colors: payload.colors,
        pattern: payload.pattern || 'solid',
        material: payload.material || 'cotton',
        seasons: payload.seasons || ['all-season'],
        formality: payload.formality || 3,
        brand: payload.brand,
        size: payload.size,
        purchasePrice: payload.purchasePrice,
        condition: 'new',
        inventoryState: 'available',
        imageUri: payload.imageUri,
        careProfile: {
          type: payload.careType || 'machine-wash',
          wearsBeforeCare: payload.careType === 'dry-clean' ? 5 : 3,
          lastCaredAt: null,
          notes: payload.notes,
        },
        careState: 'clean',
        wearCount: 0,
        lastWornAt: null,
        notes: payload.notes,
        isFavorite: false,
        createdAt: now,
        updatedAt: now,
      };

      // In production, this would sync to backend
      return newItem;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing item
export const updateItem = createAsyncThunk(
  'wardrobe/updateItem',
  async (payload: UpdateItemPayload, { rejectWithValue }) => {
    try {
      return {
        id: payload.id,
        updates: {
          ...payload.updates,
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Log wearing an item
export const logWear = createAsyncThunk(
  'wardrobe/logWear',
  async (payload: LogWearPayload, { rejectWithValue }) => {
    try {
      const wornAt = payload.date || new Date().toISOString();
      return {
        itemId: payload.itemId,
        outfitId: payload.outfitId,
        wornAt,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete an item
export const deleteItem = createAsyncThunk(
  'wardrobe/deleteItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      // In production, this would sync to backend
      return itemId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ============================================
// SLICE
// ============================================

const wardrobeSlice = createSlice({
  name: 'wardrobe',
  initialState,
  reducers: {
    // View settings
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<'recent' | 'name' | 'wearCount' | 'lastWorn' | 'category'>
    ) => {
      state.sortBy = action.payload;
    },

    // Filters
    setFilters: (state, action: PayloadAction<Partial<WardrobeState['activeFilters']>>) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    clearFilters: (state) => {
      state.activeFilters = initialState.activeFilters;
    },
    toggleCategoryFilter: (state, action: PayloadAction<ItemCategory>) => {
      const category = action.payload;
      const index = state.activeFilters.categories.indexOf(category);
      if (index > -1) {
        state.activeFilters.categories.splice(index, 1);
      } else {
        state.activeFilters.categories.push(category);
      }
    },
    toggleColorFilter: (state, action: PayloadAction<ItemColor>) => {
      const color = action.payload;
      const index = state.activeFilters.colors.indexOf(color);
      if (index > -1) {
        state.activeFilters.colors.splice(index, 1);
      } else {
        state.activeFilters.colors.push(color);
      }
    },

    // Item quick actions
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.isFavorite = !item.isFavorite;
        item.updatedAt = new Date().toISOString();
      }
    },
    setInventoryState: (
      state,
      action: PayloadAction<{ itemId: string; inventoryState: InventoryState }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.itemId);
      if (item) {
        item.inventoryState = action.payload.inventoryState;
        item.updatedAt = new Date().toISOString();

        // Update care state if sending to/returning from care
        if (
          action.payload.inventoryState === 'in-laundry' ||
          action.payload.inventoryState === 'in-dry-cleaning'
        ) {
          item.careState = 'in-care';
        } else if (action.payload.inventoryState === 'available') {
          // Returning from care
          item.careProfile.lastCaredAt = new Date().toISOString();
          item.careState = 'clean';
        }
      }
    },
    markCareComplete: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.careProfile.lastCaredAt = new Date().toISOString();
        item.careState = 'clean';
        item.inventoryState = 'available';
        item.updatedAt = new Date().toISOString();
      }
    },

    // Outfit actions
    saveOutfit: (state, action: PayloadAction<Outfit>) => {
      state.outfits.push(action.payload);
    },
    deleteOutfit: (state, action: PayloadAction<string>) => {
      state.outfits = state.outfits.filter((o) => o.id !== action.payload);
    },
    toggleOutfitFavorite: (state, action: PayloadAction<string>) => {
      const outfit = state.outfits.find((o) => o.id === action.payload);
      if (outfit) {
        outfit.isFavorite = !outfit.isFavorite;
        outfit.updatedAt = new Date().toISOString();
      }
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
    },

    // Load mock data (for development)
    loadMockData: (state, action: PayloadAction<WardrobeItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add item
    builder
      .addCase(addItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload); // Add to beginning
      })
      .addCase(addItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update item
    builder
      .addCase(updateItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index > -1) {
          state.items[index] = { ...state.items[index], ...action.payload.updates };
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Log wear
    builder
      .addCase(logWear.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logWear.fulfilled, (state, action) => {
        state.isLoading = false;
        const item = state.items.find((i) => i.id === action.payload.itemId);
        if (item) {
          item.wearCount += 1;
          item.lastWornAt = action.payload.wornAt;
          item.updatedAt = action.payload.wornAt;
          item.careState = calculateCareState(item);
        }

        // Update outfit if provided
        if (action.payload.outfitId) {
          const outfit = state.outfits.find((o) => o.id === action.payload.outfitId);
          if (outfit) {
            outfit.wornCount += 1;
            outfit.lastWornAt = action.payload.wornAt;
            outfit.state = 'worn';
            outfit.updatedAt = action.payload.wornAt;
          }
        }
      })
      .addCase(logWear.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete item
    builder
      .addCase(deleteItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((i) => i.id !== action.payload);
        // Also remove from any outfits
        state.outfits.forEach((outfit) => {
          outfit.itemIds = outfit.itemIds.filter((id) => id !== action.payload);
        });
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================
// SELECTORS
// ============================================

export const selectFilteredItems = (state: { wardrobe: WardrobeState }): WardrobeItem[] => {
  const { items, activeFilters, sortBy } = state.wardrobe;

  let filtered = [...items];

  // Apply filters
  if (activeFilters.categories.length > 0) {
    filtered = filtered.filter((item) => activeFilters.categories.includes(item.category));
  }
  if (activeFilters.colors.length > 0) {
    filtered = filtered.filter((item) =>
      item.colors.some((color) => activeFilters.colors.includes(color))
    );
  }
  if (activeFilters.seasons.length > 0) {
    filtered = filtered.filter((item) =>
      item.seasons.some((season) => activeFilters.seasons.includes(season))
    );
  }
  if (activeFilters.inventoryStates.length > 0) {
    filtered = filtered.filter((item) =>
      activeFilters.inventoryStates.includes(item.inventoryState)
    );
  }
  if (activeFilters.careStates.length > 0) {
    filtered = filtered.filter((item) => activeFilters.careStates.includes(item.careState));
  }

  // Apply sorting
  switch (sortBy) {
    case 'recent':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'name':
      filtered.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''));
      break;
    case 'wearCount':
      filtered.sort((a, b) => b.wearCount - a.wearCount);
      break;
    case 'lastWorn':
      filtered.sort((a, b) => {
        if (!a.lastWornAt) return 1;
        if (!b.lastWornAt) return -1;
        return new Date(b.lastWornAt).getTime() - new Date(a.lastWornAt).getTime();
      });
      break;
    case 'category':
      filtered.sort((a, b) => a.category.localeCompare(b.category));
      break;
  }

  return filtered;
};

export const selectAvailableItems = (state: { wardrobe: WardrobeState }): WardrobeItem[] => {
  return state.wardrobe.items.filter((item) => item.inventoryState === 'available');
};

export const selectItemsByCategory = (
  state: { wardrobe: WardrobeState },
  category: ItemCategory
): WardrobeItem[] => {
  return state.wardrobe.items.filter(
    (item) => item.category === category && item.inventoryState === 'available'
  );
};

export const selectCareAlerts = (state: { wardrobe: WardrobeState }): WardrobeItem[] => {
  return state.wardrobe.items.filter(
    (item) => item.careState === 'due-soon' || item.careState === 'overdue'
  );
};

// ============================================
// EXPORTS
// ============================================

export const {
  setViewMode,
  setSortBy,
  setFilters,
  clearFilters,
  toggleCategoryFilter,
  toggleColorFilter,
  toggleFavorite,
  setInventoryState,
  markCareComplete,
  saveOutfit,
  deleteOutfit,
  toggleOutfitFavorite,
  clearError,
  loadMockData,
} = wardrobeSlice.actions;

export default wardrobeSlice.reducer;
