/**
 * ThreadIQ Item Match Screen
 * Find where to buy a trending item, see who wears it, and discover similar items in your wardrobe
 */

import React, { useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store';
import { selectTrendingItems, selectAffiliateLinks } from '../store/slices/discoverSlice';
import {
  mockTrendingItems,
  mockAffiliateLinks,
  getProfileById,
  mockStyleProfiles,
} from '../data/discoverMockData';
import AffiliateLinkRow from '../components/AffiliateLinkRow';
import { findSimilarItems } from '../utils/itemMatcher';
import { formatTrendingScore, getTrendingColor } from '../utils/trending';
import affiliateService from '../services/affiliate/AffiliateService';
import { AffiliateLink } from '../types/discover.types';
import { colors, spacing, borderRadius } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ItemMatchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ItemMatch'>>();
  const { trendingItemId, sourceProfileId } = route.params;

  const userItems = useAppSelector((state) => state.wardrobe.items);

  // Find the trending item from mock data
  const trendingItem = useMemo(
    () => mockTrendingItems.find((t) => t.id === trendingItemId),
    [trendingItemId],
  );

  const sourceProfile = useMemo(
    () => getProfileById(sourceProfileId),
    [sourceProfileId],
  );

  // Get affiliate links for this item
  const affiliateLinks = useMemo(() => {
    if (!trendingItem) return [];
    // Check both trending item's embedded links and the mock data
    if (trendingItem.affiliateLinks.length > 0) return trendingItem.affiliateLinks;
    return mockAffiliateLinks[trendingItem.sourceItemId] || [];
  }, [trendingItem]);

  // Find similar items in user's wardrobe
  const similarItems = useMemo(() => {
    if (!trendingItem) return [];
    return findSimilarItems(trendingItem, userItems);
  }, [trendingItem, userItems]);

  // Find other profiles that wear similar items
  const wornByProfiles = useMemo(() => {
    if (!trendingItem) return [];
    return mockStyleProfiles.filter((p) => p.id !== sourceProfileId).slice(0, 3);
  }, [trendingItem, sourceProfileId]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAffiliateLinkPress = useCallback(
    async (link: AffiliateLink) => {
      if (!trendingItem) return;
      const purchaseId = await affiliateService.openShopLink(
        link,
        {
          trendingItemId: trendingItem.id,
          productName: trendingItem.name,
          brand: trendingItem.brand,
          imageUri: trendingItem.imageUri,
          suggestedCategory: trendingItem.category,
          suggestedColors: trendingItem.colors,
        },
        trendingItem.sourceProfileId,
        'match',
      );
      if (purchaseId) {
        setTimeout(() => navigation.navigate('PurchaseConfirm', { purchaseId }), 800);
      }
    },
    [trendingItem, navigation],
  );

  const handleProfilePress = useCallback(
    (profileId: string) => {
      navigation.navigate('StyleProfile', { profileId });
    },
    [navigation],
  );

  if (!trendingItem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Item not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const trendLabel = formatTrendingScore(trendingItem.trendingScore);
  const trendColor = getTrendingColor(trendingItem.trendingScore);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find This Item</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Item hero */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: trendingItem.imageUri }} style={styles.heroImage} />
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{trendingItem.name}</Text>
            {trendingItem.brand && (
              <Text style={styles.heroBrand}>{trendingItem.brand}</Text>
            )}
            <View style={styles.heroMetaRow}>
              <View style={styles.heroCategory}>
                <Text style={styles.heroCategoryText}>{trendingItem.category}</Text>
              </View>
              {trendingItem.colors.map((color) => (
                <View key={color} style={styles.heroColor}>
                  <Text style={styles.heroColorText}>{color}</Text>
                </View>
              ))}
              <View style={[styles.trendBadge, { backgroundColor: trendColor + '20' }]}>
                <Icon name="fire" size={14} color={trendColor} />
                <Text style={[styles.trendText, { color: trendColor }]}>{trendLabel}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Worn by */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Worn by</Text>
          <View style={styles.wornByRow}>
            {sourceProfile && (
              <TouchableOpacity
                style={styles.wornByProfile}
                onPress={() => handleProfilePress(sourceProfile.id)}
              >
                <Image source={{ uri: sourceProfile.avatarUri }} style={styles.wornByAvatar} />
                <Text style={styles.wornByName} numberOfLines={1}>
                  {sourceProfile.displayName}
                </Text>
              </TouchableOpacity>
            )}
            {wornByProfiles.map((profile) => (
              <TouchableOpacity
                key={profile.id}
                style={styles.wornByProfile}
                onPress={() => handleProfilePress(profile.id)}
              >
                <Image source={{ uri: profile.avatarUri }} style={styles.wornByAvatar} />
                <Text style={styles.wornByName} numberOfLines={1}>
                  {profile.displayName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Shop This Look */}
        {affiliateLinks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shop This Look</Text>
            {affiliateLinks.map((link) => (
              <AffiliateLinkRow
                key={link.id}
                link={link}
                onPress={() => handleAffiliateLinkPress(link)}
              />
            ))}
          </View>
        )}

        {/* Similar in Your Wardrobe */}
        {similarItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Similar in Your Wardrobe</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarScroll}
            >
              {similarItems.map((item) => (
                <View key={item.id} style={styles.similarItem}>
                  <Image source={{ uri: item.imageUri }} style={styles.similarImage} />
                  <Text style={styles.similarBrand} numberOfLines={1}>
                    {item.brand || item.subcategory}
                  </Text>
                  <Text style={styles.similarCategory} numberOfLines={1}>
                    {item.category}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* No affiliate links empty state */}
        {affiliateLinks.length === 0 && (
          <View style={styles.section}>
            <View style={styles.emptyShop}>
              <Icon name="shopping-outline" size={40} color={colors.text.tertiary} />
              <Text style={styles.emptyShopTitle}>No shops available yet</Text>
              <Text style={styles.emptyShopDesc}>
                We're working on finding retailers for this item
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.text.tertiary,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  heroContainer: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  heroImage: {
    width: '100%',
    height: SCREEN_WIDTH * 0.7,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.md,
  },
  heroInfo: {
    paddingHorizontal: spacing.xs,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
  },
  heroBrand: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 4,
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  heroCategory: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  heroCategoryText: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  heroColor: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  heroColorText: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  section: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  wornByRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  wornByProfile: {
    alignItems: 'center',
    width: 64,
  },
  wornByAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.xs,
  },
  wornByName: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  similarScroll: {
    gap: spacing.sm,
    paddingRight: spacing.base,
  },
  similarItem: {
    width: 100,
  },
  similarImage: {
    width: 100,
    height: 125,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.xs,
  },
  similarBrand: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  similarCategory: {
    fontSize: 11,
    color: colors.text.tertiary,
    textTransform: 'capitalize',
  },
  emptyShop: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
  },
  emptyShopTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptyShopDesc: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});
