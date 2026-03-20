/**
 * ThreadIQ URL Preview Card
 * Beautiful product preview from scraped URL data
 * Shows hero image, title, price, retailer, and action buttons
 */

import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius, shadows } from '../theme';
import type { ScrapedProduct } from '../services/urlScraper/UrlScraperService';

interface Props {
  product: ScrapedProduct;
  onAddToWardrobe: () => void;
  onAddToWishlist: () => void;
  onRetry?: () => void;
}

export default function UrlPreviewCard({
  product,
  onAddToWardrobe,
  onAddToWishlist,
  onRetry,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Hero Image */}
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Icon name="image-off-outline" size={48} color={colors.text.tertiary} />
        </View>
      )}

      {/* Product Info */}
      <View style={styles.info}>
        {/* Retailer badge */}
        {product.siteName && (
          <View style={styles.retailerBadge}>
            <Icon name="shopping" size={12} color={colors.accent.main} />
            <Text style={styles.retailerName}>{product.siteName}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Brand */}
        {product.brand && (
          <Text style={styles.brand}>{product.brand}</Text>
        )}

        {/* Description */}
        {product.description && (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        )}

        {/* Price */}
        {product.price != null && (
          <View style={styles.priceRow}>
            {product.salePrice != null ? (
              <>
                <Text style={styles.salePrice}>
                  ${product.salePrice.toFixed(2)}
                </Text>
                <Text style={styles.originalPrice}>
                  ${product.price.toFixed(2)}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.price}>
                ${product.price.toFixed(2)} {product.currency || 'AUD'}
              </Text>
            )}
          </View>
        )}

        {/* Inferred tags */}
        <View style={styles.tagsRow}>
          {product.suggestedCategory && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {product.suggestedCategory.charAt(0).toUpperCase() + product.suggestedCategory.slice(1)}
              </Text>
            </View>
          )}
          {product.suggestedColors?.map((color) => (
            <View key={color} style={styles.tag}>
              <Text style={styles.tagText}>{color}</Text>
            </View>
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={onAddToWardrobe}
            style={styles.primaryButton}
            labelStyle={styles.primaryButtonText}
            icon="hanger"
          >
            Add to Wardrobe
          </Button>
          <Button
            mode="outlined"
            onPress={onAddToWishlist}
            style={styles.secondaryButton}
            labelStyle={styles.secondaryButtonText}
            icon="heart-outline"
          >
            Add to Wishlist
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: colors.background.secondary,
  },
  placeholderImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: spacing.lg,
  },
  retailerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  retailerName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent.main,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 26,
  },
  brand: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary.main,
  },
  salePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E74C3C',
  },
  originalPrice: {
    fontSize: 14,
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#E74C3C15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E74C3C',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    borderColor: colors.accent.main,
    borderRadius: borderRadius.lg,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent.main,
  },
});
