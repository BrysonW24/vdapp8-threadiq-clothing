'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WardrobeItem,
  WardrobeState,
  Outfit,
  ItemCategory,
  ItemColor,
  InventoryState,
  CareState,
  AddItemPayload,
  OccasionType,
} from '@/types/wardrobe.types';

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const calculateCareState = (item: WardrobeItem): CareState => {
  const { careProfile, wearCount, inventoryState } = item;
  if (inventoryState === 'in-dry-cleaning' || inventoryState === 'in-laundry') return 'in-care';
  if (!careProfile.lastCaredAt) {
    if (wearCount >= careProfile.wearsBeforeCare) return 'overdue';
    if (wearCount >= careProfile.wearsBeforeCare * 0.8) return 'due-soon';
    return 'clean';
  }
  const wearsSinceLastCare = wearCount % careProfile.wearsBeforeCare;
  if (wearsSinceLastCare >= careProfile.wearsBeforeCare) return 'overdue';
  if (wearsSinceLastCare >= careProfile.wearsBeforeCare * 0.8) return 'due-soon';
  return 'clean';
};

interface WardrobeStore extends WardrobeState {
  addItem: (payload: AddItemPayload) => void;
  updateItem: (id: string, updates: Partial<WardrobeItem>) => void;
  deleteItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  logWear: (itemId: string) => void;
  setInventoryState: (itemId: string, inventoryState: InventoryState) => void;
  markCareComplete: (itemId: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sort: WardrobeState['sortBy']) => void;
  toggleCategoryFilter: (category: ItemCategory) => void;
  toggleColorFilter: (color: ItemColor) => void;
  clearFilters: () => void;
  saveOutfit: (outfit: Outfit) => void;
  deleteOutfit: (id: string) => void;
  loadSeedData: (items: WardrobeItem[]) => void;
}

const initialFilters: WardrobeState['activeFilters'] = {
  categories: [],
  colors: [],
  seasons: [],
  inventoryStates: [],
  careStates: [],
};

export const useWardrobeStore = create<WardrobeStore>()(
  persist(
    (set) => ({
      items: [],
      outfits: [],
      isLoading: false,
      error: null,
      activeFilters: { ...initialFilters },
      viewMode: 'grid',
      sortBy: 'recent',

      addItem: (payload) =>
        set((state) => {
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
          return { items: [newItem, ...state.items] };
        }),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
          ),
        })),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          outfits: state.outfits.map((o) => ({
            ...o,
            itemIds: o.itemIds.filter((iid) => iid !== id),
          })),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, isFavorite: !i.isFavorite, updatedAt: new Date().toISOString() }
              : i
          ),
        })),

      logWear: (itemId) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id !== itemId) return i;
            const updated = {
              ...i,
              wearCount: i.wearCount + 1,
              lastWornAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            updated.careState = calculateCareState(updated);
            return updated;
          }),
        })),

      setInventoryState: (itemId, inventoryState) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id !== itemId) return i;
            const updated = { ...i, inventoryState, updatedAt: new Date().toISOString() };
            if (inventoryState === 'in-laundry' || inventoryState === 'in-dry-cleaning') {
              updated.careState = 'in-care';
            } else if (inventoryState === 'available') {
              updated.careProfile = { ...updated.careProfile, lastCaredAt: new Date().toISOString() };
              updated.careState = 'clean';
            }
            return updated;
          }),
        })),

      markCareComplete: (itemId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId
              ? {
                  ...i,
                  careProfile: { ...i.careProfile, lastCaredAt: new Date().toISOString() },
                  careState: 'clean' as CareState,
                  inventoryState: 'available' as InventoryState,
                  updatedAt: new Date().toISOString(),
                }
              : i
          ),
        })),

      setViewMode: (mode) => set({ viewMode: mode }),
      setSortBy: (sort) => set({ sortBy: sort }),

      toggleCategoryFilter: (category) =>
        set((state) => {
          const cats = state.activeFilters.categories;
          const idx = cats.indexOf(category);
          return {
            activeFilters: {
              ...state.activeFilters,
              categories: idx > -1 ? cats.filter((c) => c !== category) : [...cats, category],
            },
          };
        }),

      toggleColorFilter: (color) =>
        set((state) => {
          const cols = state.activeFilters.colors;
          const idx = cols.indexOf(color);
          return {
            activeFilters: {
              ...state.activeFilters,
              colors: idx > -1 ? cols.filter((c) => c !== color) : [...cols, color],
            },
          };
        }),

      clearFilters: () => set({ activeFilters: { ...initialFilters } }),

      saveOutfit: (outfit) =>
        set((state) => ({ outfits: [...state.outfits, outfit] })),

      deleteOutfit: (id) =>
        set((state) => ({ outfits: state.outfits.filter((o) => o.id !== id) })),

      loadSeedData: (items) => set({ items }),
    }),
    { name: 'threadiq-wardrobe' }
  )
);

// Derived selectors
export function getFilteredItems(state: WardrobeStore): WardrobeItem[] {
  let filtered = [...state.items];
  const f = state.activeFilters;

  if (f.categories.length > 0) filtered = filtered.filter((i) => f.categories.includes(i.category));
  if (f.colors.length > 0) filtered = filtered.filter((i) => i.colors.some((c) => f.colors.includes(c)));
  if (f.seasons.length > 0) filtered = filtered.filter((i) => i.seasons.some((s) => f.seasons.includes(s)));
  if (f.inventoryStates.length > 0) filtered = filtered.filter((i) => f.inventoryStates.includes(i.inventoryState));
  if (f.careStates.length > 0) filtered = filtered.filter((i) => f.careStates.includes(i.careState));

  switch (state.sortBy) {
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
}
