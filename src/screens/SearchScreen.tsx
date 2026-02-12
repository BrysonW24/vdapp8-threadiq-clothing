import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../store';
import { useDebounce } from '../hooks';
import { colors, spacing, borderRadius } from '../theme';
import type { WardrobeItem } from '../types/wardrobe.types';

const SearchResultItem = React.memo(({ item, onPress }: {
  item: WardrobeItem;
  onPress: (item: WardrobeItem) => void;
}) => (
  <TouchableOpacity
    style={styles.resultItem}
    onPress={() => onPress(item)}
    activeOpacity={0.7}
  >
    <Image source={{ uri: item.imageUri }} style={styles.resultImage} resizeMode="cover" />
    <View style={styles.resultInfo}>
      <Text style={styles.resultBrand}>{item.brand || item.subcategory}</Text>
      <Text style={styles.resultCategory}>{item.category}</Text>
      <Text style={styles.resultMeta}>
        {item.colors.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
      </Text>
    </View>
    <Icon name="chevron-right" size={20} color={colors.text.tertiary} />
  </TouchableOpacity>
));

const keyExtractor = (item: WardrobeItem) => item.id;

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const items = useAppSelector((state) => state.wardrobe.items);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredData = useMemo(() => {
    if (!debouncedSearch) return [];
    const query = debouncedSearch.toLowerCase();
    return items.filter(
      (item) =>
        item.brand?.toLowerCase().includes(query) ||
        item.subcategory.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.colors.some((c) => c.toLowerCase().includes(query))
    );
  }, [items, debouncedSearch]);

  const handleItemPress = useCallback((item: WardrobeItem) => {
    navigation.navigate('ItemDetails', { itemId: item.id });
  }, [navigation]);

  const renderItem = useCallback(({ item }: { item: WardrobeItem }) => (
    <SearchResultItem item={item} onPress={handleItemPress} />
  ), [handleItemPress]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Searchbar
        placeholder="Search your wardrobe..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        iconColor={colors.text.tertiary}
        autoFocus
      />

      {!debouncedSearch ? (
        <View style={styles.emptyState}>
          <Icon name="magnify" size={48} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>Search Your Wardrobe</Text>
          <Text style={styles.emptyText}>
            Search by brand, type, category, or colour
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="magnify-close" size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyTitle}>No Results</Text>
              <Text style={styles.emptyText}>
                No items match &quot;{debouncedSearch}&quot;
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  searchbar: {
    margin: spacing.base,
    backgroundColor: colors.background.secondary,
    elevation: 0,
    borderRadius: borderRadius.lg,
  },
  list: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
  },
  resultImage: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
  },
  resultInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  resultBrand: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  resultCategory: {
    fontSize: 13,
    color: colors.text.secondary,
    textTransform: 'capitalize',
    marginTop: 1,
  },
  resultMeta: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptyText: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontSize: 14,
    color: colors.text.secondary,
  },
});
