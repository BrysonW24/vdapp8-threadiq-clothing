/**
 * ThreadIQ Today Screen (Home)
 * Daily view with outfit suggestion, weather context, and quick stats
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../store';
import { colors, spacing, borderRadius, shadows } from '../theme';

// Get greeting based on time of day
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Get day of week
function getDayOfWeek(): string {
  return new Date().toLocaleDateString('en-AU', { weekday: 'long' });
}

// Get formatted date
function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-AU', { month: 'long', day: 'numeric' });
}

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const items = useAppSelector((state) => state.wardrobe.items);
  const totalItems = items.length;

  // Filter available items inline instead of using selector
  const availableItems = items.filter((item) => item.inventoryState === 'available');

  // Filter care alerts inline
  const careAlerts = items.filter(
    (item) => item.careState === 'due-soon' || item.careState === 'overdue'
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleViewOutfits = () => {
    navigation.navigate('Main', { screen: 'Outfits' });
  };

  const handleViewWardrobe = () => {
    navigation.navigate('Main', { screen: 'Wardrobe' });
  };

  const handleAddItem = () => {
    navigation.navigate('AddItem');
  };

  // Get a random suggestion item for today
  const todayItem = availableItems.length > 0
    ? availableItems[Math.floor(Math.random() * availableItems.length)]
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.dateText}>
              {getDayOfWeek()}, {getFormattedDate()}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <IconButton
              icon="bell-outline"
              size={24}
              iconColor={colors.text.primary}
              onPress={() => navigation.navigate('Notifications')}
            />
            <IconButton
              icon="cog-outline"
              size={24}
              iconColor={colors.text.primary}
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>

        {/* Weather Card */}
        <Card style={styles.weatherCard}>
          <Card.Content style={styles.weatherContent}>
            <View style={styles.weatherLeft}>
              <Icon name="weather-sunny" size={40} color={colors.accent.main} />
              <View style={styles.weatherInfo}>
                <Text style={styles.weatherTemp}>24°C</Text>
                <Text style={styles.weatherDesc}>Sunny, perfect for layers</Text>
              </View>
            </View>
            <View style={styles.weatherRight}>
              <Text style={styles.weatherLocation}>Sydney</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Today's Look Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Look</Text>
            <TouchableOpacity onPress={handleViewOutfits}>
              <Text style={styles.sectionLink}>See all</Text>
            </TouchableOpacity>
          </View>

          {totalItems === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Icon name="hanger" size={48} color={colors.text.tertiary} />
                <Text style={styles.emptyTitle}>Build your wardrobe</Text>
                <Text style={styles.emptySubtitle}>
                  Add items to get personalized outfit suggestions
                </Text>
                <Button
                  mode="contained"
                  onPress={handleAddItem}
                  style={styles.addButton}
                  labelStyle={styles.addButtonText}
                  icon="plus"
                >
                  Add First Item
                </Button>
              </Card.Content>
            </Card>
          ) : (
            <TouchableOpacity style={styles.outfitCard} onPress={handleViewOutfits}>
              <View style={styles.outfitPreview}>
                {todayItem && (
                  <Image
                    source={{ uri: todayItem.imageUri }}
                    style={styles.outfitImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.outfitOverlay}>
                  <View style={styles.outfitBadge}>
                    <Icon name="auto-fix" size={14} color={colors.accent.main} />
                    <Text style={styles.outfitBadgeText}>AI Suggestion</Text>
                  </View>
                </View>
              </View>
              <View style={styles.outfitInfo}>
                <Text style={styles.outfitTitle}>Casual Day Look</Text>
                <Text style={styles.outfitDesc}>
                  Perfect for today's weather and your schedule
                </Text>
                <Button
                  mode="contained"
                  onPress={handleViewOutfits}
                  style={styles.viewOutfitButton}
                  labelStyle={styles.viewOutfitButtonText}
                  compact
                >
                  View Outfit
                </Button>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Wardrobe</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity style={styles.statCard} onPress={handleViewWardrobe}>
              <View style={[styles.statIcon, { backgroundColor: colors.primary.light }]}>
                <Icon name="hanger" size={24} color={colors.primary.main} />
              </View>
              <Text style={styles.statValue}>{totalItems}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statCard} onPress={handleViewWardrobe}>
              <View style={[styles.statIcon, { backgroundColor: '#27AE6020' }]}>
                <Icon name="check-circle" size={24} color={colors.status.success} />
              </View>
              <Text style={styles.statValue}>{availableItems.length}</Text>
              <Text style={styles.statLabel}>Available</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statCard} onPress={handleViewWardrobe}>
              <View style={[styles.statIcon, { backgroundColor: '#F39C1220' }]}>
                <Icon name="alert-circle" size={24} color={colors.status.warning} />
              </View>
              <Text style={styles.statValue}>{careAlerts.length}</Text>
              <Text style={styles.statLabel}>Care Alerts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddItem}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary.main }]}>
                <Icon name="camera-plus" size={24} color={colors.text.inverse} />
              </View>
              <Text style={styles.actionLabel}>Add Item</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleViewOutfits}>
              <View style={[styles.actionIcon, { backgroundColor: colors.accent.main }]}>
                <Icon name="shuffle-variant" size={24} color={colors.text.inverse} />
              </View>
              <Text style={styles.actionLabel}>Shuffle Look</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleViewWardrobe}>
              <View style={[styles.actionIcon, { backgroundColor: colors.text.secondary }]}>
                <Icon name="magnify" size={24} color={colors.text.inverse} />
              </View>
              <Text style={styles.actionLabel}>Browse</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
  },
  weatherCard: {
    marginHorizontal: spacing.base,
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherInfo: {
    marginLeft: spacing.md,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  weatherDesc: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  weatherRight: {
    alignItems: 'flex-end',
  },
  weatherLocation: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sectionLink: {
    fontSize: 14,
    color: colors.accent.main,
    fontWeight: '500',
  },
  emptyCard: {
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  addButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  outfitCard: {
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  outfitPreview: {
    height: 180,
    backgroundColor: colors.background.secondary,
  },
  outfitImage: {
    width: '100%',
    height: '100%',
  },
  outfitOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  outfitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  outfitBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent.main,
    marginLeft: spacing.xs,
  },
  outfitInfo: {
    padding: spacing.md,
  },
  outfitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  outfitDesc: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  viewOutfitButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
  },
  viewOutfitButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});
