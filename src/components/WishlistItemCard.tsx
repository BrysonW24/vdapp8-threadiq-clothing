/**
 * ThreadIQ Wishlist Item Card
 * Displays a wishlist item with price, priority badge, and quick actions
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius } from '../theme';
import type { WishlistItem, WishlistPriority } from '../types/wishlist.types';

const PRIORITY_CONFIG: Record<WishlistPriority, { label: string; color: string; bg: string }> = {
  'must-have': { label: 'Must Have', color: '#E74C3C', bg: '#E74C3C15' },
  'want': { label: 'Want', color: '#FF6B35', bg: '#FF6B3515' },
  'maybe': { label: 'Maybe', color: colors.text.tertiary, bg: `${colors.text.tertiary}15` },
};

interface Props {
  item: WishlistItem;
  onPress: (item: WishlistItem) => void;
  onToggleFavorite?: (id: string) => void;
  size?: 'grid' | 'list';
}

export default function WishlistItemCard({ item, onPress, onToggleFavorite, size = 'grid' }: Props) {
  const priority = PRIORITY_CONFIG[item.priority];

  if (size === 'list') {
    return (
      <TouchableOpacity style={styles.listCard} onPress={() => onPress(item)} activeOpacity={0.7}>
        <Image source={{ uri: item.imageUri }} style={styles.listImage} resizeMode="cover" />
        <View style={styles.listInfo}>
          <Text style={styles.listName} numberOfLines={1}>{item.name}</Text>
          {item.brand && <Text style={styles.listBrand}>{item.brand}</Text>}
          <View style={styles.listBottom}>
            {item.price != null && (
              <View style={styles.priceRow}>
                {item.salePrice != null ? (
                  <>
                    <Text style={styles.salePrice}>${item.salePrice}</Text>
                    <Text style={styles.originalPrice}>${item.price}</Text>
                  </>
                ) : (
                  <Text style={styles.price}>${item.price}</Text>
                )}
              </View>
            )}
            <View style={[styles.priorityBadge, { backgroundColor: priority.bg }]}>
              <Text style={[styles.priorityText, { color: priority.color }]}>{priority.label}</Text>
            </View>
          </View>
        </View>
        {onToggleFavorite && (
          <TouchableOpacity onPress={() => onToggleFavorite(item.id)} style={styles.favButton}>
            <Icon
              name={item.isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={item.isFavorite ? '#E74C3C' : colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  // Grid view
  return (
    <TouchableOpacity style={styles.gridCard} onPress={() => onPress(item)} activeOpacity={0.7}>
      <Image source={{ uri: item.imageUri }} style={styles.gridImage} resizeMode="cover" />

      {/* Priority badge */}
      <View style={[styles.gridPriorityBadge, { backgroundColor: priority.bg }]}>
        <Text style={[styles.gridPriorityText, { color: priority.color }]}>{priority.label}</Text>
      </View>

      {/* Favorite */}
      {onToggleFavorite && (
        <TouchableOpacity
          style={styles.gridFavButton}
          onPress={() => onToggleFavorite(item.id)}
        >
          <Icon
            name={item.isFavorite ? 'heart' : 'heart-outline'}
            size={16}
            color={item.isFavorite ? '#E74C3C' : 'rgba(255,255,255,0.8)'}
          />
        </TouchableOpacity>
      )}

      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
        {item.brand && <Text style={styles.gridBrand} numberOfLines={1}>{item.brand}</Text>}
        {item.price != null && (
          <View style={styles.priceRow}>
            {item.salePrice != null ? (
              <>
                <Text style={styles.gridSalePrice}>${item.salePrice}</Text>
                <Text style={styles.gridOriginalPrice}>${item.price}</Text>
              </>
            ) : (
              <Text style={styles.gridPrice}>${item.price}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Grid styles
  gridCard: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card.background,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: colors.background.secondary,
  },
  gridPriorityBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  gridPriorityText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  gridFavButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridInfo: {
    padding: spacing.sm,
  },
  gridName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  gridBrand: {
    fontSize: 10,
    color: colors.text.tertiary,
    marginTop: 1,
  },
  gridPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary.main,
    marginTop: 2,
  },
  gridSalePrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E74C3C',
    marginTop: 2,
  },
  gridOriginalPrice: {
    fontSize: 11,
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
    marginTop: 2,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  // List styles
  listCard: {
    flexDirection: 'row',
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  listImage: {
    width: 80,
    height: 100,
    backgroundColor: colors.background.secondary,
  },
  listInfo: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  listName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  listBrand: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  listBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary.main,
  },
  salePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E74C3C',
  },
  originalPrice: {
    fontSize: 12,
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  favButton: {
    padding: spacing.md,
    justifyContent: 'center',
  },
});
