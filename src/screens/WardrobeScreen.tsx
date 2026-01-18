/**
 * ThreadIQ Wardrobe Screen
 * Main inventory view with grid/list toggle and filtering
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Text, IconButton, Chip, FAB, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store';
import {
  selectFilteredItems,
  setViewMode,
  toggleCategoryFilter,
  clearFilters,
  toggleFavorite,
} from '../store/slices/wardrobeSlice';
import { colors, spacing, borderRadius, shadows } from '../theme';
import type { WardrobeItem, ItemCategory } from '../types/wardrobe.types';

const { width } = Dimensions.get('window');
const GRID_COLUMNS = 3;
const GRID_GAP = spacing.sm;
const GRID_ITEM_SIZE = (width - spacing.base * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

// Category icons
const CATEGORY_ICONS: Record<ItemCategory, string> = {
  tops: 'tshirt-crew',
  bottoms: 'human-male',
  outerwear: 'coat-rack',
  suits: 'tie',
  shoes: 'shoe-formal',
  accessories: 'watch',
};

// Category labels
const CATEGORY_LABELS: Record<ItemCategory, string> = {
  tops: 'Tops',
  bottoms: 'Bottoms',
  outerwear: 'Outerwear',
  suits: 'Suits',
  shoes: 'Shoes',
  accessories: 'Accessories',
};

const ALL_CATEGORIES: ItemCategory[] = ['tops', 'bottoms', 'outerwear', 'suits', 'shoes', 'accessories'];

export default function WardrobeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectFilteredItems);
  const { viewMode, activeFilters } = useAppSelector((state) => state.wardrobe);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items by search query
  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.brand?.toLowerCase().includes(query) ||
      item.subcategory.toLowerCase().includes(query) ||
      item.colors.some((c) => c.toLowerCase().includes(query))
    );
  });

  const handleItemPress = useCallback((item: WardrobeItem) => {
    navigation.navigate('ItemDetails', { itemId: item.id });
  }, [navigation]);

  const handleAddPress = useCallback(() => {
    navigation.navigate('AddItem');
  }, [navigation]);

  const handleToggleFavorite = useCallback((itemId: string) => {
    dispatch(toggleFavorite(itemId));
  }, [dispatch]);

  const renderGridItem = ({ item }: { item: WardrobeItem }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imageUri }} style={styles.gridImage} resizeMode="cover" />

      {/* Care indicator */}
      {item.careState !== 'clean' && (
        <View style={[styles.careIndicator, { backgroundColor: colors.care[item.careState] }]} />
      )}

      {/* Favorite button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleToggleFavorite(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon
          name={item.isFavorite ? 'heart' : 'heart-outline'}
          size={16}
          color={item.isFavorite ? colors.status.error : colors.text.inverse}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }: { item: WardrobeItem }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imageUri }} style={styles.listImage} resizeMode="cover" />
      <View style={styles.listInfo}>
        <Text style={styles.listBrand}>{item.brand || item.subcategory}</Text>
        <Text style={styles.listCategory}>{CATEGORY_LABELS[item.category]}</Text>
        <View style={styles.listMeta}>
          <Text style={styles.listWearCount}>{item.wearCount} wears</Text>
          {item.careState !== 'clean' && (
            <View style={[styles.listCareChip, { backgroundColor: colors.care[item.careState] }]}>
              <Text style={styles.listCareText}>
                {item.careState === 'due-soon' ? 'Care Soon' : 'Overdue'}
              </Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleToggleFavorite(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon
          name={item.isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={item.isFavorite ? colors.status.error : colors.text.tertiary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="hanger" size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>Your wardrobe is empty</Text>
      <Text style={styles.emptySubtitle}>
        Start by adding your first item
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleAddPress}>
        <Icon name="plus" size={20} color={colors.text.inverse} />
        <Text style={styles.emptyButtonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wardrobe</Text>
        <View style={styles.headerActions}>
          <IconButton
            icon={viewMode === 'grid' ? 'view-list' : 'view-grid'}
            size={24}
            iconColor={colors.text.primary}
            onPress={() => dispatch(setViewMode(viewMode === 'grid' ? 'list' : 'grid'))}
          />
          <IconButton
            icon="filter-variant"
            size={24}
            iconColor={colors.text.primary}
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search items..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={colors.text.tertiary}
        />
      </View>

      {/* Category Chips */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={ALL_CATEGORIES}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item: category }) => {
            const isActive = activeFilters.categories.includes(category);
            return (
              <Chip
                selected={isActive}
                onPress={() => dispatch(toggleCategoryFilter(category))}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                textStyle={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}
                icon={() => (
                  <Icon
                    name={CATEGORY_ICONS[category]}
                    size={16}
                    color={isActive ? colors.text.inverse : colors.text.secondary}
                  />
                )}
              >
                {CATEGORY_LABELS[category]}
              </Chip>
            );
          }}
        />
      </View>

      {/* Items Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        </Text>
        {activeFilters.categories.length > 0 && (
          <TouchableOpacity onPress={() => dispatch(clearFilters())}>
            <Text style={styles.clearFilters}>Clear filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Items List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? GRID_COLUMNS : 1}
        key={viewMode} // Force re-render when switching view mode
        renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
        contentContainerStyle={[
          styles.listContent,
          filteredItems.length === 0 && styles.listContentEmpty,
        ]}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        color={colors.text.inverse}
        onPress={handleAddPress}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  searchContainer: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    backgroundColor: colors.background.secondary,
    elevation: 0,
    borderRadius: borderRadius.lg,
  },
  searchInput: {
    fontSize: 16,
  },
  categoryContainer: {
    paddingBottom: spacing.sm,
  },
  categoryList: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  categoryChip: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
  },
  categoryChipActive: {
    backgroundColor: colors.primary.main,
  },
  categoryChipText: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  categoryChipTextActive: {
    color: colors.text.inverse,
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  countText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  clearFilters: {
    fontSize: 14,
    color: colors.accent.main,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: 100,
  },
  listContentEmpty: {
    flex: 1,
  },
  gridRow: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE * 1.3,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  careIndicator: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    padding: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.full,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    ...shadows.sm,
  },
  listImage: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
  },
  listInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  listBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  listCategory: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  listWearCount: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  listCareChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  listCareText: {
    fontSize: 10,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  emptyButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: spacing.base,
    bottom: spacing.xl,
    backgroundColor: colors.primary.main,
  },
});
