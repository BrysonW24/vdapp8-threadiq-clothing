/**
 * ThreadIQ Discover Feed Screen
 * Browse all style icons, trending items, and community wardrobes
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppSelector, useAppDispatch } from '../store';
import {
  fetchFeaturedProfiles,
  fetchTrendingItems,
  fetchAllProfiles,
  toggleFollowProfile,
  selectFeaturedProfiles,
  selectTrendingItems,
  selectFollowedProfileIds,
} from '../store/slices/discoverSlice';
import { StyleProfile, StyleTag, TrendingItem, AffiliateLink } from '../types/discover.types';
import { getProfileById } from '../data/discoverMockData';
import StyleIconCard from '../components/StyleIconCard';
import TrendingItemCard from '../components/TrendingItemCard';
import FollowButton from '../components/FollowButton';
import affiliateService from '../services/affiliate/AffiliateService';
import { colors, spacing, shadows } from '../theme';

const FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Influencers', value: 'influencer' },
  { label: 'Community', value: 'user' },
];

const STYLE_FILTERS: StyleTag[] = [
  'minimalist',
  'streetwear',
  'classic',
  'bohemian',
  'preppy',
  'athleisure',
];

export default function DiscoverFeedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const featuredProfiles = useAppSelector(selectFeaturedProfiles);
  const trendingItems = useAppSelector(selectTrendingItems);
  const allProfiles = useAppSelector((state) => state.discover.allProfiles);
  const followedProfileIds = useAppSelector(selectFollowedProfileIds);
  const allProfilesLoading = useAppSelector((state) => state.discover.allProfilesLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeStyleFilter, setActiveStyleFilter] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchFeaturedProfiles(10));
    dispatch(fetchTrendingItems(10));
    dispatch(fetchAllProfiles(1));
  }, [dispatch]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleProfilePress = useCallback(
    (profileId: string) => {
      navigation.navigate('StyleProfile', { profileId });
    },
    [navigation],
  );

  const handleFollowToggle = useCallback(
    (profileId: string) => {
      dispatch(toggleFollowProfile(profileId));
    },
    [dispatch],
  );

  const handleTrendingItemPress = useCallback(
    (trendingItemId: string, sourceProfileId: string) => {
      navigation.navigate('ItemMatch', { trendingItemId, sourceProfileId });
    },
    [navigation],
  );

  const handleShopPress = useCallback(
    async (item: TrendingItem, link: AffiliateLink) => {
      const purchaseId = await affiliateService.openShopLink(
        link,
        {
          trendingItemId: item.id,
          productName: item.name,
          brand: item.brand,
          imageUri: item.imageUri,
          suggestedCategory: item.category,
          suggestedColors: item.colors,
        },
        item.sourceProfileId,
        'trending',
      );
      if (purchaseId) {
        setTimeout(() => navigation.navigate('PurchaseConfirm', { purchaseId }), 800);
      }
    },
    [navigation],
  );

  // Filter profiles
  const filteredProfiles = allProfiles.filter((profile) => {
    if (activeFilter !== 'all' && profile.type !== activeFilter) return false;
    if (activeStyleFilter && !profile.styleTags.includes(activeStyleFilter as StyleTag)) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        profile.displayName.toLowerCase().includes(query) ||
        profile.handle.toLowerCase().includes(query) ||
        profile.styleTags.some((tag) => tag.includes(query))
      );
    }
    return true;
  });

  const renderProfileRow = (profile: StyleProfile) => (
    <TouchableOpacity
      key={profile.id}
      style={styles.profileRow}
      onPress={() => handleProfilePress(profile.id)}
      activeOpacity={0.85}
    >
      {/* Avatar with small ring */}
      <View style={styles.profileRowAvatarRing}>
        <Image source={{ uri: profile.avatarUri }} style={styles.profileRowAvatar} />
      </View>
      <View style={styles.profileRowInfo}>
        <View style={styles.profileRowNameRow}>
          <Text style={styles.profileRowName}>{profile.displayName}</Text>
          {profile.isVerified && (
            <Icon name="check-decagram" size={14} color="#FF6B35" />
          )}
        </View>
        <Text style={styles.profileRowHandle}>{profile.handle}</Text>
        <Text style={styles.profileRowMeta} numberOfLines={1}>
          {profile.styleTags.join(' · ')} · {profile.totalSharedItems} items
        </Text>
      </View>
      <FollowButton
        isFollowing={followedProfileIds.includes(profile.id)}
        onToggle={() => handleFollowToggle(profile.id)}
        size="small"
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={colors.text.tertiary} />
          <TextInput
            placeholder="Search styles, people..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Type filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setActiveFilter(option.value)}
            style={[
              styles.filterChip,
              activeFilter === option.value && styles.filterChipActive,
            ]}
          >
            {activeFilter === option.value && (
              <Icon name="check" size={12} color="#FFF" style={{ marginRight: 4 }} />
            )}
            <Text
              style={[
                styles.filterChipText,
                activeFilter === option.value && styles.filterChipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={styles.filterDivider} />
        {STYLE_FILTERS.map((style) => (
          <TouchableOpacity
            key={style}
            onPress={() =>
              setActiveStyleFilter(activeStyleFilter === style ? null : style)
            }
            style={[
              styles.filterChip,
              activeStyleFilter === style && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                activeStyleFilter === style && styles.filterChipTextActive,
              ]}
            >
              {style}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured profiles */}
      {!searchQuery && (
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Featured</Text>
          </View>
          <FlatList
            data={featuredProfiles}
            renderItem={({ item }) => (
              <StyleIconCard
                profile={item}
                isFollowing={followedProfileIds.includes(item.id)}
                onPress={() => handleProfilePress(item.id)}
                onFollowToggle={() => handleFollowToggle(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
          />
        </View>
      )}

      {/* Trending */}
      {!searchQuery && (
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionAccent, { backgroundColor: '#E74C3C' }]} />
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          {trendingItems.map((item) => (
            <TrendingItemCard
              key={item.id}
              item={item}
              sourceProfile={getProfileById(item.sourceProfileId)}
              onPress={() => handleTrendingItemPress(item.id, item.sourceProfileId)}
              onShopPress={
                item.affiliateLinks.length > 0
                  ? () => handleShopPress(item, item.affiliateLinks[0])
                  : undefined
              }
            />
          ))}
        </View>
      )}

      {/* All profiles */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <View style={[styles.sectionAccent, { backgroundColor: colors.accent.main }]} />
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Results' : 'All Styles'}
          </Text>
        </View>
        {filteredProfiles.map(renderProfileRow)}
        {allProfilesLoading && (
          <ActivityIndicator
            size="small"
            color="#FF6B35"
            style={styles.loader}
          />
        )}
        {filteredProfiles.length === 0 && !allProfilesLoading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Icon name="magnify" size={32} color={colors.text.tertiary} />
            </View>
            <Text style={styles.emptyText}>No profiles found</Text>
            <Text style={styles.emptySubtext}>Try a different search or filter</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    color: colors.text.primary,
    fontWeight: '500',
  },
  filterRow: {
    marginTop: 14,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...shadows.sm,
  },
  filterChipActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.3,
  },
  filterChipText: {
    fontSize: 12,
    textTransform: 'capitalize',
    fontWeight: '600',
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  filterDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E9ECEF',
    alignSelf: 'center',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E74C3C15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E74C3C',
    marginRight: 4,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E74C3C',
    letterSpacing: 0.5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  profileRowAvatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileRowAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.secondary,
  },
  profileRowInfo: {
    flex: 1,
    marginRight: 8,
  },
  profileRowNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileRowName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  profileRowHandle: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 1,
    fontWeight: '500',
  },
  profileRowMeta: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 2,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  loader: {
    paddingVertical: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 4,
  },
});
