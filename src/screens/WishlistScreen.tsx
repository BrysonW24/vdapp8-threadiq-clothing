/**
 * ThreadIQ Wishlist Screen
 * Grid view of wanted items with sort/filter, priority badges, and move-to-wardrobe
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Text, Chip, FAB, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store';
import {
  selectWishlistItems,
  selectWishlistCount,
  selectMustHaveCount,
  selectWishlistSort,
  setWishlistSort,
  setWishlistFilterCategory,
  toggleWishlistFavorite,
  selectWishlistFilterCategory,
} from '../store/slices/wishlistSlice';
import WishlistItemCard from '../components/WishlistItemCard';
import { colors, spacing, borderRadius } from '../theme';
import type { WishlistItem, WishlistSortBy } from '../types/wishlist.types';
import type { ItemCategory } from '../types/wardrobe.types';

const { width } = Dimensions.get('window');
const GRID_GAP = spacing.sm;
const GRID_COLUMNS = 2;
const GRID_ITEM_WIDTH = (width - spacing.base * 2 - GRID_GAP) / GRID_COLUMNS;

const SORT_OPTIONS: { id: WishlistSortBy; label: string; icon: string }[] = [
  { id: 'recent', label: 'Recent', icon: 'clock-outline' },
  { id: 'priority', label: 'Priority', icon: 'star-outline' },
  { id: 'price-low', label: 'Price ↑', icon: 'arrow-up' },
  { id: 'price-high', label: 'Price ↓', icon: 'arrow-down' },
];

const CATEGORIES: { id: ItemCategory; label: string }[] = [
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessories', label: 'Accessories' },
];

export default function WishlistScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const totalCount = useAppSelector(selectWishlistCount);
  const mustHaveCount = useAppSelector(selectMustHaveCount);
  const sortBy = useAppSelector(selectWishlistSort);
  const filterCategory = useAppSelector(selectWishlistFilterCategory);

  const totalValue = useMemo(
    () => items.reduce((sum, i) => sum + (i.salePrice || i.price || 0), 0),
    [items],
  );

  const handleItemPress = useCallback((item: WishlistItem) => {
    // TODO: Navigate to WishlistItemDetail or ItemMatch
  }, []);

  const handleToggleFavorite = useCallback(
    (id: string) => {
      dispatch(toggleWishlistFavorite(id));
    },
    [dispatch],
  );

  const handleSortPress = useCallback(
    (sort: WishlistSortBy) => {
      dispatch(setWishlistSort(sort));
    },
    [dispatch],
  );

  const handleCategoryPress = useCallback(
    (cat: ItemCategory | null) => {
      dispatch(setWishlistFilterCategory(cat));
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({ item }: { item: WishlistItem }) => (
      <View style={{ width: GRID_ITEM_WIDTH }}>
        <WishlistItemCard
          item={item}
          onPress={handleItemPress}
          onToggleFavorite={handleToggleFavorite}
          size="grid"
        />
      </View>
    ),
    [handleItemPress, handleToggleFavorite],
  );

  const keyExtractor = useCallback((item: WishlistItem) => item.id, []);

  const ListHeaderComponent = useMemo(
    () => (
      <View>
        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalCount}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#E74C3C' }]}>{mustHaveCount}</Text>
            <Text style={styles.statLabel}>Must Have</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.accent.main }]}>
              ${Math.round(totalValue)}
            </Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
        </View>

        {/* Sort chips */}
        <View style={styles.sortRow}>
          {SORT_OPTIONS.map((opt) => (
            <Chip
              key={opt.id}
              selected={sortBy === opt.id}
              onPress={() => handleSortPress(opt.id)}
              style={[styles.sortChip, sortBy === opt.id && styles.sortChipActive]}
              textStyle={[styles.sortChipText, sortBy === opt.id && styles.sortChipTextActive]}
              compact
            >
              {opt.label}
            </Chip>
          ))}
        </View>

        {/* Category filter */}
        <View style={styles.categoryRow}>
          <Chip
            selected={filterCategory === null}
            onPress={() => handleCategoryPress(null)}
            style={[styles.catChip, filterCategory === null && styles.catChipActive]}
            textStyle={[styles.catChipText, filterCategory === null && styles.catChipTextActive]}
            compact
          >
            All
          </Chip>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              selected={filterCategory === cat.id}
              onPress={() => handleCategoryPress(cat.id)}
              style={[styles.catChip, filterCategory === cat.id && styles.catChipActive]}
              textStyle={[styles.catChipText, filterCategory === cat.id && styles.catChipTextActive]}
              compact
            >
              {cat.label}
            </Chip>
          ))}
        </View>
      </View>
    ),
    [totalCount, mustHaveCount, totalValue, sortBy, filterCategory, handleSortPress, handleCategoryPress],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <View style={styles.headerSpacer} />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="heart-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Save items you love to plan your next purchase
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeaderComponent}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        color={colors.text.inverse}
        onPress={() => navigation.navigate('AddItem')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 32,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sortChip: {
    backgroundColor: colors.background.secondary,
  },
  sortChipActive: {
    backgroundColor: colors.primary.main,
  },
  sortChipText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  sortChipTextActive: {
    color: colors.text.inverse,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.xs,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  catChip: {
    backgroundColor: colors.background.secondary,
  },
  catChipActive: {
    backgroundColor: colors.accent.main,
  },
  catChipText: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  catChipTextActive: {
    color: colors.text.inverse,
  },
  gridContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: 100,
  },
  gridRow: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.base,
    backgroundColor: colors.primary.main,
  },
});
