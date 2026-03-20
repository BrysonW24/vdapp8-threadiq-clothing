/**
 * ThreadIQ Navigation Types
 */

import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Main: NavigatorScreenParams<BottomTabParamList>;
  Auth: undefined;
  AddItem: undefined;
  ItemDetails: {
    itemId: string;
  };
  Settings: undefined;
  Notifications: undefined;
  StyleProfile: {
    profileId: string;
  };
  DiscoverFeed: undefined;
  ItemMatch: {
    trendingItemId: string;
    sourceProfileId: string;
  };
  PurchaseConfirm: {
    purchaseId: string;
  };
  RecentPurchases: undefined;
  // Wishlist
  Wishlist: undefined;
  // Calendar + Events
  EventDetail: {
    eventId: string;
  };
  AddEvent: {
    date?: string; // pre-fill date from calendar tap
  } | undefined;
  // Avatar
  AvatarBuilder: undefined;
  // Social Sharing
  PostEventCapture: {
    eventId: string;
  };
};

export type BottomTabParamList = {
  Today: undefined;
  Wardrobe: undefined;
  Outfits: undefined;
  Events: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
