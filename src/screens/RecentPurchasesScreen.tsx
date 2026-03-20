/**
 * ThreadIQ Recent Purchases Screen
 * Full list of active purchases with status tracking
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store';
import { selectActivePurchases } from '../store/slices/shopSlice';
import PurchaseCard from '../components/PurchaseCard';
import { Purchase } from '../types/shop.types';
import { colors } from '../theme';

export default function RecentPurchasesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const activePurchases = useAppSelector(selectActivePurchases);

  const handlePurchasePress = useCallback(
    (purchaseId: string) => {
      navigation.navigate('PurchaseConfirm', { purchaseId });
    },
    [navigation],
  );

  const handleShopTrending = useCallback(() => {
    navigation.navigate('DiscoverFeed');
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: Purchase }) => (
      <PurchaseCard
        purchase={item}
        onPress={() => handlePurchasePress(item.id)}
      />
    ),
    [handlePurchasePress],
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Icon name="shopping-outline" size={36} color={colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>No recent purchases</Text>
      <Text style={styles.emptySubtext}>
        Shop trending items and they'll appear here
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={handleShopTrending}
        activeOpacity={0.85}
      >
        <Icon name="fire" size={16} color="#FFF" />
        <Text style={styles.shopButtonText}>Shop Trending</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activePurchases}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    padding: 16,
    paddingBottom: 48,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  emptySubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.tertiary,
    marginTop: 4,
    textAlign: 'center',
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 20,
    gap: 6,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  shopButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
});
