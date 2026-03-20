/**
 * ThreadIQ Purchase Confirm Screen
 * Two-stage modal: confirm purchase → pre-filled wardrobe add
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { useAppSelector, useAppDispatch } from '../store';
import {
  selectPurchaseById,
  confirmPurchase,
  dismissPurchase,
  addPurchaseToWardrobe,
} from '../store/slices/shopSlice';
import { colors, shadows } from '../theme';
import type { ItemCategory, ItemColor } from '../types/wardrobe.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RETAILER_COLORS: Record<string, string> = {
  'THE ICONIC': '#1A1A2E',
  'ASOS': '#2D2D2D',
  'SSENSE': '#000000',
  'Mr Porter': '#1B3A4B',
  'Farfetch': '#222222',
  'Net-a-Porter': '#000000',
  'Uniqlo': '#C4161C',
  'Zara': '#000000',
  'H&M': '#CC0023',
  'Generic': '#FF6B35',
};

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: string }> = {
  pending: { color: '#999', label: 'Pending', icon: 'clock-outline' },
  ordered: { color: '#FF6B35', label: 'Ordered', icon: 'package-variant' },
  shipped: { color: '#3498DB', label: 'Shipped', icon: 'truck-delivery' },
  delivered: { color: '#27AE60', label: 'Delivered', icon: 'check-circle' },
};

const COLOR_SWATCHES: Record<string, string> = {
  black: '#000000',
  white: '#FFFFFF',
  navy: '#1B2A4A',
  grey: '#9B9B9B',
  beige: '#D4C5A9',
  brown: '#6B4226',
  olive: '#556B2F',
  burgundy: '#722F37',
  cream: '#FFFDD0',
  charcoal: '#36454F',
  camel: '#C19A6B',
  khaki: '#C3B091',
  blue: '#4169E1',
  red: '#DC143C',
  green: '#228B22',
  pink: '#FFB6C1',
  orange: '#FF6B35',
  purple: '#663399',
  yellow: '#FFD700',
  multi: '#FF6B35',
};

type Stage = 'confirming' | 'adding' | 'success';

export default function PurchaseConfirmScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'PurchaseConfirm'>>();
  const { purchaseId } = route.params;
  const dispatch = useAppDispatch();

  const selector = useMemo(() => selectPurchaseById(purchaseId), [purchaseId]);
  const purchase = useAppSelector(selector);

  const [stage, setStage] = useState<Stage>('confirming');

  // Pre-filled form state
  const [category] = useState<ItemCategory>(purchase?.suggestedCategory ?? 'tops');
  const [selectedColors] = useState<ItemColor[]>(purchase?.suggestedColors ?? []);
  const [brand] = useState(purchase?.brand ?? '');
  const [size, setSize] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(
    String(purchase?.salePrice ?? purchase?.price ?? ''),
  );
  const [notes, setNotes] = useState('');

  // Auto-dismiss on success
  useEffect(() => {
    if (stage === 'success') {
      const timer = setTimeout(() => navigation.goBack(), 1500);
      return () => clearTimeout(timer);
    }
  }, [stage, navigation]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleConfirmPurchase = useCallback(() => {
    if (!purchase) return;
    dispatch(confirmPurchase(purchase.id));
    setStage('adding');
  }, [dispatch, purchase]);

  const handleDismiss = useCallback(() => {
    if (!purchase) return;
    dispatch(dismissPurchase(purchase.id));
    navigation.goBack();
  }, [dispatch, purchase, navigation]);

  const handleAddToWardrobe = useCallback(async () => {
    if (!purchase) return;
    try {
      await dispatch(
        addPurchaseToWardrobe({
          purchaseId: purchase.id,
          category,
          subcategory: purchase.suggestedSubcategory ?? 't-shirt',
          colors: selectedColors,
          brand: brand || undefined,
          size: size || undefined,
          purchasePrice: parseFloat(purchasePrice) || undefined,
          notes: notes || undefined,
        }),
      ).unwrap();
      setStage('success');
    } catch {
      // Error is handled by Redux state
    }
  }, [dispatch, purchase, category, selectedColors, brand, size, purchasePrice, notes]);

  if (!purchase) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Purchase not found</Text>
        </View>
      </View>
    );
  }

  const retailerColor = RETAILER_COLORS[purchase.retailerName] || '#FF6B35';
  const statusInfo = STATUS_CONFIG[purchase.status] || STATUS_CONFIG.pending;
  const displayPrice = purchase.salePrice ?? purchase.price;

  // ==========================================
  // SUCCESS STATE
  // ==========================================
  if (stage === 'success') {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.successCircle}>
          <Icon name="check" size={48} color="#FFF" />
        </View>
        <Text style={styles.successTitle}>Added to Wardrobe!</Text>
        <Text style={styles.successSubtext}>
          {purchase.productName} is now in your collection
        </Text>
      </View>
    );
  }

  // ==========================================
  // CONFIRMING STAGE
  // ==========================================
  if (stage === 'confirming') {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={22} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Purchase Detected</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Product card */}
          <View style={styles.productCard}>
            <Image source={{ uri: purchase.imageUri }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <View style={[styles.retailerBadge, { backgroundColor: retailerColor }]}>
                <Text style={styles.retailerBadgeText}>{purchase.retailerName}</Text>
              </View>
              <Text style={styles.productName}>{purchase.productName}</Text>
              {purchase.brand && (
                <Text style={styles.productBrand}>{purchase.brand}</Text>
              )}
              <View style={styles.priceRow}>
                {purchase.salePrice != null && purchase.salePrice < purchase.price && (
                  <Text style={styles.originalPrice}>${purchase.price.toFixed(0)}</Text>
                )}
                <Text style={styles.price}>${displayPrice.toFixed(0)}</Text>
                <Text style={styles.currency}>{purchase.currency}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '15' }]}>
                <Icon name={statusInfo.icon} size={14} color={statusInfo.color} />
                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                  {statusInfo.label}
                </Text>
              </View>
            </View>
          </View>

          {/* Pre-filled metadata preview */}
          <View style={styles.metaPreview}>
            <Text style={styles.metaLabel}>Will be added as</Text>
            <View style={styles.metaChips}>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>{purchase.suggestedCategory}</Text>
              </View>
              {purchase.suggestedColors.map((color) => (
                <View key={color} style={styles.metaChip}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: COLOR_SWATCHES[color] || '#999' },
                      color === 'white' && { borderWidth: 1, borderColor: '#DDD' },
                    ]}
                  />
                  <Text style={styles.metaChipText}>{color}</Text>
                </View>
              ))}
              {purchase.brand && (
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>{purchase.brand}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmPurchase}
              activeOpacity={0.85}
            >
              <Icon name="check" size={20} color="#FFF" />
              <Text style={styles.confirmButtonText}>Yes, I bought this</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={handleDismiss}
              activeOpacity={0.85}
            >
              <Text style={styles.dismissButtonText}>Not my purchase</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ==========================================
  // ADDING STAGE
  // ==========================================
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStage('confirming')} style={styles.closeButton}>
            <Icon name="arrow-left" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add to Wardrobe</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Compact product preview */}
        <View style={styles.compactPreview}>
          <Image source={{ uri: purchase.imageUri }} style={styles.compactImage} />
          <View style={styles.compactInfo}>
            <Text style={styles.compactName} numberOfLines={1}>
              {purchase.productName}
            </Text>
            <Text style={styles.compactRetailer}>from {purchase.retailerName}</Text>
          </View>
        </View>

        {/* Pre-filled fields */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Category</Text>
          <View style={styles.readOnlyChip}>
            <Text style={styles.readOnlyChipText}>{category}</Text>
            <Icon name="check" size={14} color="#FF6B35" />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Colors</Text>
          <View style={styles.colorRow}>
            {selectedColors.map((color) => (
              <View key={color} style={styles.colorChip}>
                <View
                  style={[
                    styles.colorSwatchLarge,
                    { backgroundColor: COLOR_SWATCHES[color] || '#999' },
                    color === 'white' && { borderWidth: 1, borderColor: '#DDD' },
                  ]}
                />
                <Text style={styles.colorChipText}>{color}</Text>
              </View>
            ))}
          </View>
        </View>

        {brand ? (
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Brand</Text>
            <View style={styles.readOnlyChip}>
              <Text style={styles.readOnlyChipText}>{brand}</Text>
              <Icon name="check" size={14} color="#FF6B35" />
            </View>
          </View>
        ) : null}

        {/* Editable fields */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Size (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. M, 32, 10"
            placeholderTextColor={colors.text.tertiary}
            value={size}
            onChangeText={setSize}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Purchase Price</Text>
          <View style={styles.priceInput}>
            <Text style={styles.pricePrefix}>$</Text>
            <TextInput
              style={styles.priceInputField}
              keyboardType="numeric"
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Any notes about this item..."
            placeholderTextColor={colors.text.tertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        {/* Add button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddToWardrobe}
          activeOpacity={0.85}
        >
          <Icon name="hanger" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Add to Wardrobe</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 48,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },

  // Product card (confirming stage)
  productCard: {
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  productImage: {
    width: '100%',
    height: SCREEN_WIDTH * 0.65,
    backgroundColor: '#F0F0F0',
  },
  productInfo: {
    padding: 18,
  },
  retailerBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  retailerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  productBrand: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
    gap: 6,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  currency: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 10,
    gap: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  // Meta preview
  metaPreview: {
    marginHorizontal: 16,
    marginTop: 4,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  metaChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  metaChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // Actions (confirming stage)
  actions: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.2,
  },
  dismissButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  dismissButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.tertiary,
  },

  // Compact preview (adding stage)
  compactPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 14,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  compactImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  compactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  compactName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  compactRetailer: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.tertiary,
    marginTop: 2,
  },

  // Form fields (adding stage)
  formSection: {
    marginHorizontal: 16,
    marginTop: 18,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  readOnlyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FF6B3530',
    ...shadows.sm,
  },
  readOnlyChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FF6B3530',
    ...shadows.sm,
  },
  colorSwatchLarge: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  colorChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...shadows.sm,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...shadows.sm,
  },
  pricePrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
    marginRight: 4,
  },
  priceInputField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },

  // Add button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 28,
    gap: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.2,
  },

  // Success state
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  successSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  // Error
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
});
