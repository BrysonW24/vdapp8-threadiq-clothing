import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { store, persistor } from './src/store';
import { theme } from './src/theme';
import RootNavigator from './src/navigation/RootNavigator';
import affiliateService from './src/services/affiliate/AffiliateService';
import { recordPurchaseIntent } from './src/store/slices/shopSlice';

// Register shop intent handler — wires affiliate clicks to purchase tracking
affiliateService.registerShopIntentHandler(async (link, snapshot) => {
  const result = await store
    .dispatch(
      recordPurchaseIntent({
        trendingItemId: snapshot.trendingItemId,
        affiliateLinkId: link.id,
        productName: snapshot.productName,
        brand: snapshot.brand,
        imageUri: snapshot.imageUri,
        retailerName: link.retailerName,
        price: link.salePrice ?? link.price,
        currency: link.currency,
        salePrice: link.salePrice,
        productUrl: link.productUrl,
        suggestedCategory: snapshot.suggestedCategory,
        suggestedSubcategory: snapshot.suggestedSubcategory,
        suggestedColors: snapshot.suggestedColors,
      }),
    )
    .unwrap();
  return result.id;
});

const LoadingFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <StatusBar style="auto" />
            <RootNavigator />
          </PaperProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
