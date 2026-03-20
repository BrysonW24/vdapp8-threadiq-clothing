import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TrendingItem, StyleProfile } from '../types/discover.types';
import { formatTrendingScore, getTrendingColor } from '../utils/trending';
import { colors, spacing, borderRadius, shadows } from '../theme';

interface TrendingItemCardProps {
  item: TrendingItem;
  sourceProfile: StyleProfile | undefined;
  onPress: () => void;
  onShopPress?: () => void;
}

export default React.memo(function TrendingItemCard({
  item,
  sourceProfile,
  onPress,
  onShopPress,
}: TrendingItemCardProps) {
  const trendLabel = formatTrendingScore(item.trendingScore);
  const trendColor = getTrendingColor(item.trendingScore);
  const hasAffiliateLinks = item.affiliateLinks.length > 0;
  const lowestPrice = hasAffiliateLinks
    ? Math.min(
        ...item.affiliateLinks.map((l) => l.salePrice || l.price),
      )
    : null;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
      {/* Image with overlay gradient */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUri }} style={styles.image} />
        {/* Trend badge - floating on image */}
        <View style={[styles.trendBadge, { backgroundColor: trendColor }]}>
          <Icon name="fire" size={11} color="#FFF" />
          <Text style={styles.trendText}>{trendLabel}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        {item.brand && (
          <Text style={styles.brand} numberOfLines={1}>
            {item.brand}
          </Text>
        )}
        {sourceProfile && (
          <View style={styles.wornByRow}>
            <Image source={{ uri: sourceProfile.avatarUri }} style={styles.wornByAvatar} />
            <Text style={styles.wornBy} numberOfLines={1}>
              {sourceProfile.handle}
            </Text>
          </View>
        )}
        <View style={styles.bottomRow}>
          {lowestPrice !== null && (
            <Text style={styles.price}>
              ${lowestPrice.toFixed(0)}
            </Text>
          )}
          {hasAffiliateLinks && onShopPress && (
            <TouchableOpacity style={styles.shopButton} onPress={onShopPress}>
              <Icon name="shopping-outline" size={14} color="#FFF" />
              <Text style={styles.shopText}>Shop</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    ...shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 120,
    backgroundColor: colors.background.secondary,
  },
  trendBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  trendText: {
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 3,
    color: '#FFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  info: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  brand: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
    fontWeight: '500',
  },
  wornByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  wornByAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.background.secondary,
    marginRight: 5,
  },
  wornBy: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  shopText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 4,
  },
});
