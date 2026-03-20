/**
 * ThreadIQ Redux Store
 * Configured with redux-persist for AsyncStorage state persistence
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import reducers
import authReducer from './slices/authSlice';
import wardrobeReducer from './slices/wardrobeSlice';
import discoverReducer from './slices/discoverSlice';
import shopReducer from './slices/shopSlice';
import weatherReducer from './slices/weatherSlice';
import wishlistReducer from './slices/wishlistSlice';
import calendarReducer from './slices/calendarSlice';
import avatarReducer from './slices/avatarSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  wardrobe: wardrobeReducer,
  discover: discoverReducer,
  shop: shopReducer,
  weather: weatherReducer,
  wishlist: wishlistReducer,
  calendar: calendarReducer,
  avatar: avatarReducer,
});

const persistConfig = {
  key: 'threadiq-root',
  storage: AsyncStorage,
  whitelist: ['wardrobe', 'auth', 'discover', 'shop', 'weather', 'wishlist', 'calendar', 'avatar'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist actions contain non-serializable values
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export pre-typed hooks for usage throughout the app
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
