/**
 * ThreadIQ Discover Slice
 * Redux state management for "Dress Like X" — style profiles, trending, follows
 */

import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import {
  DiscoverState,
  StyleProfile,
  TrendingItem,
  FollowRelationship,
  FetchProfileDetailPayload,
} from '../../types/discover.types';
import { WardrobeItem, Outfit } from '../../types/wardrobe.types';
import {
  mockStyleProfiles,
  mockTrendingItems,
  getProfileItems,
  getProfileOutfits,
  getAffiliateLinksForItem,
} from '../../data/discoverMockData';

// ============================================
// INITIAL STATE
// ============================================

const initialState: DiscoverState = {
  featuredProfiles: [],
  featuredProfilesLoading: false,
  allProfiles: [],
  allProfilesLoading: false,
  allProfilesPage: 1,
  allProfilesHasMore: true,
  trendingItems: [],
  trendingItemsLoading: false,
  followedProfileIds: [],
  followRelationships: [],
  savedTrendingItemIds: [],
  selectedProfile: null,
  selectedProfileItems: [],
  selectedProfileOutfits: [],
  selectedProfileLoading: false,
  affiliateLinks: {},
  error: null,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================
// ASYNC THUNKS
// ============================================

export const fetchFeaturedProfiles = createAsyncThunk(
  'discover/fetchFeaturedProfiles',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      // Mock: return curated profiles sorted by trending score
      const profiles = [...mockStyleProfiles]
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, limit);
      return profiles;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchTrendingItems = createAsyncThunk(
  'discover/fetchTrendingItems',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      // Mock: return trending items sorted by score
      const items = [...mockTrendingItems]
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, limit);
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchAllProfiles = createAsyncThunk(
  'discover/fetchAllProfiles',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const pageSize = 10;
      const start = (page - 1) * pageSize;
      const profiles = mockStyleProfiles.slice(start, start + pageSize);
      return {
        profiles,
        page,
        hasMore: start + pageSize < mockStyleProfiles.length,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchProfileDetail = createAsyncThunk(
  'discover/fetchProfileDetail',
  async (payload: FetchProfileDetailPayload, { rejectWithValue }) => {
    try {
      const profile = mockStyleProfiles.find((p) => p.id === payload.profileId);
      if (!profile) {
        return rejectWithValue('Profile not found');
      }
      const items = getProfileItems(payload.profileId);
      const outfits = getProfileOutfits(payload.profileId);

      // Also load affiliate links for all items
      const affiliateLinks: Record<string, any[]> = {};
      items.forEach((item) => {
        const links = getAffiliateLinksForItem(item.id);
        if (links.length > 0) {
          affiliateLinks[item.id] = links;
        }
      });

      return { profile, items, outfits, affiliateLinks };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const toggleFollowProfile = createAsyncThunk(
  'discover/toggleFollowProfile',
  async (profileId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { discover: DiscoverState };
      const isFollowing = state.discover.followedProfileIds.includes(profileId);
      return { profileId, isFollowing };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// ============================================
// SLICE
// ============================================

const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {
    toggleSaveTrendingItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.savedTrendingItemIds.indexOf(itemId);
      if (index > -1) {
        state.savedTrendingItemIds.splice(index, 1);
      } else {
        state.savedTrendingItemIds.push(itemId);
      }
    },
    clearSelectedProfile: (state) => {
      state.selectedProfile = null;
      state.selectedProfileItems = [];
      state.selectedProfileOutfits = [];
      state.selectedProfileLoading = false;
    },
    loadMockDiscoverData: (state) => {
      state.featuredProfiles = mockStyleProfiles;
      state.trendingItems = mockTrendingItems;
      state.allProfiles = mockStyleProfiles;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch featured profiles
    builder
      .addCase(fetchFeaturedProfiles.pending, (state) => {
        state.featuredProfilesLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProfiles.fulfilled, (state, action) => {
        state.featuredProfilesLoading = false;
        state.featuredProfiles = action.payload;
      })
      .addCase(fetchFeaturedProfiles.rejected, (state, action) => {
        state.featuredProfilesLoading = false;
        state.error = action.payload as string;
      });

    // Fetch trending items
    builder
      .addCase(fetchTrendingItems.pending, (state) => {
        state.trendingItemsLoading = true;
        state.error = null;
      })
      .addCase(fetchTrendingItems.fulfilled, (state, action) => {
        state.trendingItemsLoading = false;
        state.trendingItems = action.payload;
      })
      .addCase(fetchTrendingItems.rejected, (state, action) => {
        state.trendingItemsLoading = false;
        state.error = action.payload as string;
      });

    // Fetch all profiles (paginated)
    builder
      .addCase(fetchAllProfiles.pending, (state) => {
        state.allProfilesLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProfiles.fulfilled, (state, action) => {
        state.allProfilesLoading = false;
        if (action.payload.page === 1) {
          state.allProfiles = action.payload.profiles;
        } else {
          state.allProfiles.push(...action.payload.profiles);
        }
        state.allProfilesPage = action.payload.page;
        state.allProfilesHasMore = action.payload.hasMore;
      })
      .addCase(fetchAllProfiles.rejected, (state, action) => {
        state.allProfilesLoading = false;
        state.error = action.payload as string;
      });

    // Fetch profile detail
    builder
      .addCase(fetchProfileDetail.pending, (state) => {
        state.selectedProfileLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileDetail.fulfilled, (state, action) => {
        state.selectedProfileLoading = false;
        state.selectedProfile = action.payload.profile;
        state.selectedProfileItems = action.payload.items;
        state.selectedProfileOutfits = action.payload.outfits;
        state.affiliateLinks = {
          ...state.affiliateLinks,
          ...action.payload.affiliateLinks,
        };
      })
      .addCase(fetchProfileDetail.rejected, (state, action) => {
        state.selectedProfileLoading = false;
        state.error = action.payload as string;
      });

    // Toggle follow
    builder
      .addCase(toggleFollowProfile.fulfilled, (state, action) => {
        const { profileId, isFollowing } = action.payload;
        if (isFollowing) {
          // Unfollow
          state.followedProfileIds = state.followedProfileIds.filter((id) => id !== profileId);
          state.followRelationships = state.followRelationships.filter(
            (r) => r.followingId !== profileId,
          );
        } else {
          // Follow
          state.followedProfileIds.push(profileId);
          state.followRelationships.push({
            id: generateId(),
            followerId: 'current-user',
            followingId: profileId,
            followedAt: new Date().toISOString(),
          });
        }
      });
  },
});

// ============================================
// SELECTORS
// ============================================

const selectDiscoverState = (state: { discover: DiscoverState }) => state.discover;

export const selectFeaturedProfiles = createSelector(
  [selectDiscoverState],
  (discover): StyleProfile[] =>
    [...discover.featuredProfiles].sort((a, b) => b.trendingScore - a.trendingScore),
);

export const selectTrendingItems = createSelector(
  [selectDiscoverState],
  (discover): TrendingItem[] =>
    [...discover.trendingItems].sort((a, b) => b.trendingScore - a.trendingScore),
);

export const selectFollowedProfileIds = createSelector(
  [selectDiscoverState],
  (discover): string[] => discover.followedProfileIds,
);

export const selectFollowedProfiles = createSelector(
  [selectDiscoverState],
  (discover): StyleProfile[] =>
    discover.allProfiles.filter((p) => discover.followedProfileIds.includes(p.id)),
);

export const selectSavedTrendingItemIds = createSelector(
  [selectDiscoverState],
  (discover): string[] => discover.savedTrendingItemIds,
);

export const selectSelectedProfile = createSelector(
  [selectDiscoverState],
  (discover) => ({
    profile: discover.selectedProfile,
    items: discover.selectedProfileItems,
    outfits: discover.selectedProfileOutfits,
    loading: discover.selectedProfileLoading,
  }),
);

export const selectAffiliateLinks = createSelector(
  [selectDiscoverState],
  (discover) => discover.affiliateLinks,
);

// ============================================
// EXPORTS
// ============================================

export const {
  toggleSaveTrendingItem,
  clearSelectedProfile,
  loadMockDiscoverData,
  clearError,
} = discoverSlice.actions;

export default discoverSlice.reducer;
