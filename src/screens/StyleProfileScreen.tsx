/**
 * ThreadIQ Style Profile Screen
 * View a style icon's wardrobe, outfits, and shop their looks
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, ActivityIndicator, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { useAppSelector, useAppDispatch } from '../store';
import {
  fetchProfileDetail,
  toggleFollowProfile,
  clearSelectedProfile,
  selectSelectedProfile,
  selectFollowedProfileIds,
  selectAffiliateLinks,
} from '../store/slices/discoverSlice';
import FollowButton from '../components/FollowButton';
import { colors, spacing, borderRadius, shadows } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_SIZE = (SCREEN_WIDTH - 16 * 2 - 12) / 2;

type TabType = 'items' | 'outfits';

export default function StyleProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'StyleProfile'>>();
  const dispatch = useAppDispatch();
  const { profileId } = route.params;

  const { profile, items, outfits, loading } = useAppSelector(selectSelectedProfile);
  const followedProfileIds = useAppSelector(selectFollowedProfileIds);
  const affiliateLinks = useAppSelector(selectAffiliateLinks);
  const isFollowing = followedProfileIds.includes(profileId);

  const [activeTab, setActiveTab] = useState<TabType>('items');

  useEffect(() => {
    dispatch(fetchProfileDetail({ profileId }));
    return () => {
      dispatch(clearSelectedProfile());
    };
  }, [dispatch, profileId]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleFollowToggle = useCallback(() => {
    dispatch(toggleFollowProfile(profileId));
  }, [dispatch, profileId]);

  const handleItemPress = useCallback(
    (itemId: string) => {
      const itemLinks = affiliateLinks[itemId];
      if (itemLinks && itemLinks.length > 0) {
        navigation.navigate('ItemMatch', {
          trendingItemId: itemId,
          sourceProfileId: profileId,
        });
      }
    },
    [navigation, profileId, affiliateLinks],
  );

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      </SafeAreaView>
    );
  }

  const formatCount = (count: number): string => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-left" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{profile.handle}</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Icon name="share-variant-outline" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Profile hero */}
        <View style={styles.profileHero}>
          {/* Avatar with gradient ring */}
          <View style={styles.avatarRing}>
            <View style={styles.avatarInnerRing}>
              <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
            </View>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{profile.displayName}</Text>
            {profile.isVerified && (
              <Icon name="check-decagram" size={20} color="#FF6B35" />
            )}
          </View>
          <Text style={styles.bio}>{profile.bio}</Text>
          {profile.location && (
            <View style={styles.locationRow}>
              <Icon name="map-marker" size={14} color="#FF6B35" />
              <Text style={styles.locationText}>{profile.location}</Text>
            </View>
          )}

          {/* Style tags */}
          <View style={styles.tagsRow}>
            {profile.styleTags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Stats - Card style */}
          <View style={styles.statsCard}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatCount(profile.followerCount)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.totalSharedItems}</Text>
              <Text style={styles.statLabel}>Items</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.totalSharedOutfits}</Text>
              <Text style={styles.statLabel}>Outfits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <View style={styles.scoreRow}>
                <Icon name="star" size={14} color="#FF6B35" />
                <Text style={[styles.statValue, { color: '#FF6B35' }]}>
                  {profile.trendingScore}
                </Text>
              </View>
              <Text style={styles.statLabel}>Style Score</Text>
            </View>
          </View>

          <FollowButton
            isFollowing={isFollowing}
            onToggle={handleFollowToggle}
            size="medium"
          />
        </View>

        {/* Tab selector */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'items' && styles.tabActive]}
            onPress={() => setActiveTab('items')}
          >
            <Icon
              name="hanger"
              size={20}
              color={activeTab === 'items' ? '#FF6B35' : colors.text.tertiary}
            />
            <Text style={[styles.tabText, activeTab === 'items' && styles.tabTextActive]}>
              Items
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'outfits' && styles.tabActive]}
            onPress={() => setActiveTab('outfits')}
          >
            <Icon
              name="tshirt-crew-outline"
              size={20}
              color={activeTab === 'outfits' ? '#FF6B35' : colors.text.tertiary}
            />
            <Text style={[styles.tabText, activeTab === 'outfits' && styles.tabTextActive]}>
              Outfits
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'items' ? (
          <View style={styles.gridContainer}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={() => handleItemPress(item.id)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: item.imageUri }} style={styles.gridImage} />
                <View style={styles.gridItemInfo}>
                  <Text style={styles.gridItemBrand} numberOfLines={1}>
                    {item.brand || item.subcategory}
                  </Text>
                  <Text style={styles.gridItemCategory} numberOfLines={1}>
                    {item.category}
                  </Text>
                </View>
                {affiliateLinks[item.id] && (
                  <View style={styles.shopBadge}>
                    <Icon name="shopping-outline" size={13} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.outfitsList}>
            {outfits.map((outfit) => (
              <View key={outfit.id} style={styles.outfitRow}>
                <View style={styles.outfitThumbnails}>
                  {outfit.itemIds.slice(0, 3).map((itemId) => {
                    const item = items.find((i) => i.id === itemId);
                    return item ? (
                      <Image
                        key={itemId}
                        source={{ uri: item.imageUri }}
                        style={styles.outfitThumb}
                      />
                    ) : null;
                  })}
                  {outfit.itemIds.length > 3 && (
                    <View style={styles.outfitThumbMore}>
                      <Text style={styles.outfitThumbMoreText}>
                        +{outfit.itemIds.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.outfitRowInfo}>
                  <Text style={styles.outfitName}>{outfit.name || 'Untitled'}</Text>
                  <Text style={styles.outfitMeta}>
                    {outfit.occasion} · {outfit.itemIds.length} items · Worn {outfit.wornCount}x
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={colors.text.tertiary} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  profileHero: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    paddingTop: 24,
    ...shadows.md,
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarInnerRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: colors.background.secondary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  bio: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 8,
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  locationText: {
    fontSize: 13,
    color: colors.text.secondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  tagChip: {
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.15)',
  },
  tagChipText: {
    fontSize: 12,
    textTransform: 'capitalize',
    fontWeight: '600',
    color: '#FF6B35',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E9ECEF',
    alignSelf: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 10,
    color: colors.text.tertiary,
    marginTop: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 4,
    ...shadows.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  tabTextActive: {
    color: '#FF6B35',
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  gridItem: {
    width: ITEM_SIZE,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    ...shadows.md,
  },
  gridImage: {
    width: '100%',
    height: ITEM_SIZE * 1.25,
    backgroundColor: colors.background.secondary,
  },
  gridItemInfo: {
    padding: 10,
  },
  gridItemBrand: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  gridItemCategory: {
    fontSize: 11,
    color: colors.text.tertiary,
    textTransform: 'capitalize',
    marginTop: 2,
    fontWeight: '500',
  },
  shopBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  outfitsList: {
    padding: 16,
  },
  outfitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    ...shadows.sm,
  },
  outfitThumbnails: {
    flexDirection: 'row',
    marginRight: 14,
  },
  outfitThumb: {
    width: 44,
    height: 54,
    borderRadius: 8,
    marginRight: -10,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: colors.background.secondary,
  },
  outfitThumbMore: {
    width: 44,
    height: 54,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  outfitThumbMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B35',
  },
  outfitRowInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  outfitName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  outfitMeta: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
});
