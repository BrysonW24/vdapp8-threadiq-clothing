/**
 * ThreadIQ Root Navigator
 * Stack navigation with bottom tabs as main screen
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import { RootStackParamList } from './types';
import { colors } from '../theme';

// Lazy load non-critical screens to reduce initial bundle parse time
const AuthScreen = React.lazy(() => import('../screens/AuthScreen'));
const AddItemScreen = React.lazy(() => import('../screens/AddItemScreen'));
const ItemDetailsScreen = React.lazy(() => import('../screens/ItemDetailsScreen'));
const SettingsScreen = React.lazy(() => import('../screens/SettingsScreen'));
const NotificationsScreen = React.lazy(() => import('../screens/NotificationsScreen'));
const StyleProfileScreen = React.lazy(() => import('../screens/StyleProfileScreen'));
const DiscoverFeedScreen = React.lazy(() => import('../screens/DiscoverFeedScreen'));
const ItemMatchScreen = React.lazy(() => import('../screens/ItemMatchScreen'));
const PurchaseConfirmScreen = React.lazy(() => import('../screens/PurchaseConfirmScreen'));
const RecentPurchasesScreen = React.lazy(() => import('../screens/RecentPurchasesScreen'));
// New screens
const WishlistScreen = React.lazy(() => import('../screens/WishlistScreen'));
const EventDetailScreen = React.lazy(() => import('../screens/EventDetailScreen'));
const AddEventScreen = React.lazy(() => import('../screens/AddEventScreen'));
const AvatarBuilderScreen = React.lazy(() => import('../screens/AvatarBuilderScreen'));
const PostEventCaptureScreen = React.lazy(() => import('../screens/PostEventCaptureScreen'));

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
        }}
      >
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="ItemDetails"
          component={ItemDetailsScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: true,
            title: 'Settings',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: colors.background.primary },
            headerTintColor: colors.text.primary,
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            headerShown: true,
            title: 'Notifications',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: colors.background.primary },
            headerTintColor: colors.text.primary,
          }}
        />
        <Stack.Screen
          name="StyleProfile"
          component={StyleProfileScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="DiscoverFeed"
          component={DiscoverFeedScreen}
          options={{
            headerShown: true,
            title: 'Discover',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: colors.background.primary },
            headerTintColor: colors.text.primary,
          }}
        />
        <Stack.Screen
          name="ItemMatch"
          component={ItemMatchScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="PurchaseConfirm"
          component={PurchaseConfirmScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="RecentPurchases"
          component={RecentPurchasesScreen}
          options={{
            headerShown: true,
            title: 'Recent Purchases',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: colors.background.primary },
            headerTintColor: colors.text.primary,
          }}
        />
        {/* Wishlist */}
        <Stack.Screen
          name="Wishlist"
          component={WishlistScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        {/* Events */}
        <Stack.Screen
          name="EventDetail"
          component={EventDetailScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="AddEvent"
          component={AddEventScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        {/* Avatar */}
        <Stack.Screen
          name="AvatarBuilder"
          component={AvatarBuilderScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        {/* Social */}
        <Stack.Screen
          name="PostEventCapture"
          component={PostEventCaptureScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
