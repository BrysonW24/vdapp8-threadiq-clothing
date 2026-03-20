/**
 * ThreadIQ Purchase Card
 * Horizontal card showing purchase status and quick actions
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Purchase } from '../types/shop.types';
import { colors, shadows } from '../theme';

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: string }> = {
  pending: { color: '#999', label: 'Pending', icon: 'clock-outline' },
  ordered: { color: '#FF6B35', label: 'Ordered', icon: 'package-variant' },
  shipped: { color: '#3498DB', label: 'Shipped', icon: 'truck-delivery' },
  delivered: { color: '#27AE60', label: 'Delivered', icon: 'check-circle' },
  'in-wardrobe': { color: '#27AE60', label: 'In Wardrobe', icon: 'check-decagram' },
};

interface PurchaseCardProps {
  purchase: Purchase;
  onPress: () => void;
}

export default function PurchaseCard({ purchase, onPress }: PurchaseCardProps) {
  const statusInfo = STATUS_CONFIG[purchase.status] || STATUS_CONFIG.pending;
  const isInWardrobe = purchase.status === 'in-wardrobe';
  const displayPrice = purchase.salePrice ?? purchase.price;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={isInWardrobe}
    >
      <Image source={{ uri: purchase.imageUri }} style={styles.thumbnail} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.productName} numberOfLines={1}>
            {purchase.productName}
          </Text>
        </View>
        <Text style={styles.retailer}>
          {purchase.brand ? `${purchase.brand} · ` : ''}{purchase.retailerName}
        </Text>
        <View style={styles.bottomRow}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '15' }]}>
            <Icon name={statusInfo.icon} size={12} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
          <Text style={styles.price}>${displayPrice.toFixed(0)}</Text>
        </View>
      </View>

      {!isInWardrobe && (
        <View style={styles.ctaButton}>
          <Icon name="plus" size={18} color="#FFF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    ...shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.2,
    flex: 1,
  },
  retailer: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text.tertiary,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  ctaButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
