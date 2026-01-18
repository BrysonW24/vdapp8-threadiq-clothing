/**
 * ThreadIQ Item Details Screen
 * View and manage individual wardrobe items
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { Text, Button, Chip, IconButton, Menu, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../store';
import {
  toggleFavorite,
  setInventoryState,
  logWear,
  markCareComplete,
  deleteItem,
} from '../store/slices/wardrobeSlice';
import { colors, spacing, borderRadius, shadows } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import type { InventoryState, CareType } from '../types/wardrobe.types';

const { width } = Dimensions.get('window');

// Category labels
const CATEGORY_LABELS: Record<string, string> = {
  tops: 'Tops',
  bottoms: 'Bottoms',
  outerwear: 'Outerwear',
  suits: 'Suits',
  shoes: 'Shoes',
  accessories: 'Accessories',
};

// Care type labels and icons
const CARE_INFO: Record<CareType, { label: string; icon: string }> = {
  'machine-wash': { label: 'Machine Wash', icon: 'washing-machine' },
  'hand-wash': { label: 'Hand Wash', icon: 'hand-wash' },
  'dry-clean': { label: 'Dry Clean Only', icon: 'hanger' },
  'spot-clean': { label: 'Spot Clean', icon: 'spray' },
};

// Inventory state options
const INVENTORY_STATES: { id: InventoryState; label: string; icon: string }[] = [
  { id: 'available', label: 'Available', icon: 'check-circle' },
  { id: 'in-laundry', label: 'In Laundry', icon: 'washing-machine' },
  { id: 'in-dry-cleaning', label: 'At Dry Cleaner', icon: 'hanger' },
  { id: 'lent-out', label: 'Lent Out', icon: 'account-arrow-right' },
  { id: 'stored', label: 'Stored Away', icon: 'archive' },
  { id: 'needs-repair', label: 'Needs Repair', icon: 'wrench' },
];

type ItemDetailsRouteProp = RouteProp<RootStackParamList, 'ItemDetails'>;

export default function ItemDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<ItemDetailsRouteProp>();
  const dispatch = useAppDispatch();

  const { itemId } = route.params;
  const item = useAppSelector((state) =>
    state.wardrobe.items.find((i) => i.id === itemId)
  );

  const [menuVisible, setMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);

  // Handle missing item
  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color={colors.status.error} />
          <Text style={styles.errorText}>Item not found</Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleFavorite = useCallback(() => {
    dispatch(toggleFavorite(item.id));
  }, [dispatch, item.id]);

  const handleLogWear = useCallback(() => {
    dispatch(logWear({ itemId: item.id }));
    Alert.alert('Wear Logged', `You've worn this item ${item.wearCount + 1} times.`);
  }, [dispatch, item.id, item.wearCount]);

  const handleStatusChange = useCallback((status: InventoryState) => {
    dispatch(setInventoryState({ itemId: item.id, state: status }));
    setStatusMenuVisible(false);
  }, [dispatch, item.id]);

  const handleMarkClean = useCallback(() => {
    dispatch(markCareComplete(item.id));
    Alert.alert('Care Complete', 'Item marked as freshly cleaned!');
  }, [dispatch, item.id]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to remove this item from your wardrobe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteItem(item.id));
            navigation.goBack();
          },
        },
      ]
    );
  }, [dispatch, item.id, navigation]);

  const careInfo = CARE_INFO[item.careType];
  const currentStatus = INVENTORY_STATES.find((s) => s.id === item.inventoryState);

  // Calculate days since last care
  const daysSinceLastCare = item.lastCareDate
    ? Math.floor((Date.now() - new Date(item.lastCareDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <IconButton
            icon={item.isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            iconColor={item.isFavorite ? colors.status.error : colors.text.primary}
            onPress={handleToggleFavorite}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={24}
                iconColor={colors.text.primary}
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item onPress={() => { setMenuVisible(false); }} title="Edit Item" leadingIcon="pencil" />
            <Divider />
            <Menu.Item onPress={() => { setMenuVisible(false); handleDelete(); }} title="Delete Item" leadingIcon="delete" titleStyle={{ color: colors.status.error }} />
          </Menu>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Image */}
        <Image source={{ uri: item.imageUri }} style={styles.mainImage} resizeMode="cover" />

        {/* Care State Badge */}
        {item.careState !== 'clean' && (
          <View
            style={[styles.careStateBadge, { backgroundColor: colors.care[item.careState] }]}
          >
            <Icon name="alert-circle" size={16} color={colors.text.inverse} />
            <Text style={styles.careStateBadgeText}>
              {item.careState === 'due-soon' ? 'Care Due Soon' : 'Care Overdue'}
            </Text>
          </View>
        )}

        {/* Item Info */}
        <View style={styles.infoSection}>
          <Text style={styles.itemBrand}>{item.brand || item.subcategory}</Text>
          <Text style={styles.itemCategory}>
            {CATEGORY_LABELS[item.category]} · {item.subcategory}
          </Text>

          {/* Colors */}
          <View style={styles.colorsRow}>
            {item.colors.map((color) => (
              <View
                key={color}
                style={[
                  styles.colorDot,
                  { backgroundColor: getColorHex(color) },
                  color === 'white' && styles.colorDotBorder,
                ]}
              />
            ))}
            <Text style={styles.colorsText}>
              {item.colors.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
            </Text>
          </View>

          {/* Size */}
          {item.size && (
            <View style={styles.sizeRow}>
              <Icon name="ruler" size={18} color={colors.text.tertiary} />
              <Text style={styles.sizeText}>Size: {item.size}</Text>
            </View>
          )}
        </View>

        <Divider style={styles.divider} />

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.wearCount}</Text>
            <Text style={styles.statLabel}>Total Wears</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {item.lastWornDate
                ? new Date(item.lastWornDate).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
                : 'Never'}
            </Text>
            <Text style={styles.statLabel}>Last Worn</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {new Date(item.createdAt).toLocaleDateString('en-AU', { month: 'short', year: '2-digit' })}
            </Text>
            <Text style={styles.statLabel}>Added</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <Menu
            visible={statusMenuVisible}
            onDismiss={() => setStatusMenuVisible(false)}
            anchor={
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => setStatusMenuVisible(true)}
              >
                <Icon
                  name={currentStatus?.icon || 'check-circle'}
                  size={20}
                  color={item.inventoryState === 'available' ? colors.status.success : colors.accent.main}
                />
                <Text style={styles.statusButtonText}>{currentStatus?.label || 'Available'}</Text>
                <Icon name="chevron-down" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            }
          >
            {INVENTORY_STATES.map((status) => (
              <Menu.Item
                key={status.id}
                onPress={() => handleStatusChange(status.id)}
                title={status.label}
                leadingIcon={status.icon}
              />
            ))}
          </Menu>
        </View>

        {/* Care Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Instructions</Text>
          <View style={styles.careCard}>
            <View style={styles.careRow}>
              <Icon name={careInfo.icon} size={24} color={colors.accent.main} />
              <View style={styles.careInfo}>
                <Text style={styles.careType}>{careInfo.label}</Text>
                <Text style={styles.careDetail}>
                  {daysSinceLastCare !== null
                    ? `Last cleaned ${daysSinceLastCare} day${daysSinceLastCare !== 1 ? 's' : ''} ago`
                    : 'No care recorded yet'}
                </Text>
              </View>
            </View>
            {item.careState !== 'clean' && (
              <Button
                mode="outlined"
                onPress={handleMarkClean}
                style={styles.markCleanButton}
                labelStyle={styles.markCleanButtonText}
              >
                Mark as Clean
              </Button>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleLogWear}
            style={styles.wearButton}
            labelStyle={styles.wearButtonText}
            icon="check"
          >
            Log Wear
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper to get color hex
function getColorHex(color: string): string {
  const colorMap: Record<string, string> = {
    black: '#1A1A1A',
    white: '#FFFFFF',
    navy: '#1E3A5F',
    grey: '#808080',
    charcoal: '#36454F',
    brown: '#8B4513',
    tan: '#D2B48C',
    beige: '#F5F5DC',
    blue: '#4169E1',
    red: '#DC143C',
    green: '#228B22',
    olive: '#556B2F',
  };
  return colorMap[color] || '#808080';
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  mainImage: {
    width: width,
    height: width * 1.2,
    backgroundColor: colors.background.secondary,
  },
  careStateBadge: {
    position: 'absolute',
    top: spacing.base,
    right: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  careStateBadgeText: {
    color: colors.text.inverse,
    fontSize: 13,
    fontWeight: '600',
  },
  infoSection: {
    padding: spacing.base,
  },
  itemBrand: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  itemCategory: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textTransform: 'capitalize',
  },
  colorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  colorDotBorder: {
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  colorsText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  sizeText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  divider: {
    marginVertical: spacing.md,
    backgroundColor: colors.border.light,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border.light,
  },
  section: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  statusButtonText: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
  },
  careCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  careRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  careInfo: {
    flex: 1,
  },
  careType: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  careDetail: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  markCleanButton: {
    marginTop: spacing.md,
    borderColor: colors.primary.main,
    borderRadius: borderRadius.lg,
  },
  markCleanButtonText: {
    color: colors.primary.main,
    fontSize: 14,
  },
  actionButtons: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.xl,
  },
  wearButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xs,
  },
  wearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  errorText: {
    fontSize: 18,
    color: colors.text.secondary,
  },
});
