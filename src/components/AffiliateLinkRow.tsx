import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AffiliateLink } from '../types/discover.types';
import { colors, spacing, shadows } from '../theme';

// Retailer brand colors
const RETAILER_COLORS: Record<string, string> = {
  'THE ICONIC': '#1A1A2E',
  'ASOS': '#2D2D2D',
  'SSENSE': '#000000',
  'Mr Porter': '#1B3A4B',
};

interface AffiliateLinkRowProps {
  link: AffiliateLink;
  onPress: () => void;
}

export default function AffiliateLinkRow({ link, onPress }: AffiliateLinkRowProps) {
  const hasSale = link.salePrice != null && link.salePrice < link.price;
  const retailerColor = RETAILER_COLORS[link.retailerName] || colors.primary.main;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
      {/* Retailer accent bar */}
      <View style={[styles.accentBar, { backgroundColor: retailerColor }]} />

      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.retailerRow}>
            <Text style={styles.retailerName}>{link.retailerName}</Text>
            <View
              style={[
                styles.stockBadge,
                { backgroundColor: link.inStock ? '#27AE6020' : '#E74C3C20' },
              ]}
            >
              <View
                style={[
                  styles.stockDot,
                  { backgroundColor: link.inStock ? '#27AE60' : '#E74C3C' },
                ]}
              />
              <Text style={[
                styles.stockText,
                { color: link.inStock ? '#27AE60' : '#E74C3C' },
              ]}>
                {link.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
          </View>
          <Text style={styles.productName} numberOfLines={1}>
            {link.productName}
          </Text>
        </View>
        <View style={styles.rightSection}>
          <View style={styles.priceColumn}>
            {hasSale && (
              <Text style={styles.originalPrice}>${link.price.toFixed(0)}</Text>
            )}
            <Text style={[styles.price, hasSale && styles.salePrice]}>
              ${(hasSale ? link.salePrice! : link.price).toFixed(0)}
            </Text>
          </View>
          <View style={styles.shopButton}>
            <Icon name="arrow-right" size={18} color="#FFF" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    ...shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  leftSection: {
    flex: 1,
    marginRight: spacing.md,
  },
  retailerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retailerName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  stockDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  stockText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 3,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceColumn: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 11,
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  salePrice: {
    color: '#E74C3C',
  },
  shopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
});
