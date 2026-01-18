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
};

export type BottomTabParamList = {
  Today: undefined;
  Wardrobe: undefined;
  Outfits: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
