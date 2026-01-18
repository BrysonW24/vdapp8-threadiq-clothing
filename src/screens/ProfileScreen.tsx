/**
 * ThreadIQ Profile Screen
 * User profile with wardrobe stats and settings
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Avatar, List, Divider, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../store';
import { colors, spacing, borderRadius, shadows } from '../theme';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const items = useAppSelector((state) => state.wardrobe.items);
  const user = useAppSelector((state) => state.auth.user);

  // Calculate wardrobe stats
  const totalItems = items.length;
  const totalWears = items.reduce((sum, item) => sum + item.wearCount, 0);
  const favoriteItems = items.filter((item) => item.isFavorite).length;
  const categoryCounts = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Avatar.Icon
            size={80}
            icon="account"
            style={styles.avatar}
            color={colors.text.inverse}
          />
          <Text style={styles.name}>{user?.displayName || 'ThreadIQ User'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Wardrobe Stats */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsTitle}>Wardrobe Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalItems}</Text>
                <Text style={styles.statLabel}>Items</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalWears}</Text>
                <Text style={styles.statLabel}>Total Wears</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{favoriteItems}</Text>
                <Text style={styles.statLabel}>Favorites</Text>
              </View>
            </View>

            {topCategory && (
              <View style={styles.insightRow}>
                <Icon name="chart-line" size={18} color={colors.accent.main} />
                <Text style={styles.insightText}>
                  Most items: {topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1)} ({topCategory[1]})
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wardrobe</Text>
          <Card style={styles.menuCard}>
            <List.Item
              title="My Items"
              description={`${totalItems} items in your wardrobe`}
              left={(props) => (
                <View style={[styles.menuIcon, { backgroundColor: colors.primary.light }]}>
                  <Icon name="hanger" size={20} color={colors.primary.main} />
                </View>
              )}
              right={(props) => <Icon name="chevron-right" size={24} color={colors.text.tertiary} />}
              onPress={() => navigation.navigate('Main', { screen: 'Wardrobe' })}
              style={styles.menuItem}
              titleStyle={styles.menuTitle}
              descriptionStyle={styles.menuDescription}
            />
            <Divider style={styles.menuDivider} />
            <List.Item
              title="Saved Outfits"
              description="Your favorite outfit combinations"
              left={(props) => (
                <View style={[styles.menuIcon, { backgroundColor: colors.accent.light }]}>
                  <Icon name="heart" size={20} color={colors.accent.main} />
                </View>
              )}
              right={(props) => <Icon name="chevron-right" size={24} color={colors.text.tertiary} />}
              onPress={() => navigation.navigate('Main', { screen: 'Outfits' })}
              style={styles.menuItem}
              titleStyle={styles.menuTitle}
              descriptionStyle={styles.menuDescription}
            />
            <Divider style={styles.menuDivider} />
            <List.Item
              title="Care Schedule"
              description="Items needing attention"
              left={(props) => (
                <View style={[styles.menuIcon, { backgroundColor: colors.status.warning + '20' }]}>
                  <Icon name="calendar-clock" size={20} color={colors.status.warning} />
                </View>
              )}
              right={(props) => <Icon name="chevron-right" size={24} color={colors.text.tertiary} />}
              onPress={() => navigation.navigate('Main', { screen: 'Wardrobe' })}
              style={styles.menuItem}
              titleStyle={styles.menuTitle}
              descriptionStyle={styles.menuDescription}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.menuCard}>
            <List.Item
              title="Notifications"
              description="Care reminders & outfit suggestions"
              left={(props) => (
                <View style={[styles.menuIcon, { backgroundColor: colors.background.secondary }]}>
                  <Icon name="bell-outline" size={20} color={colors.text.secondary} />
                </View>
              )}
              right={(props) => <Icon name="chevron-right" size={24} color={colors.text.tertiary} />}
              onPress={() => navigation.navigate('Notifications')}
              style={styles.menuItem}
              titleStyle={styles.menuTitle}
              descriptionStyle={styles.menuDescription}
            />
            <Divider style={styles.menuDivider} />
            <List.Item
              title="App Settings"
              description="Theme, privacy, data management"
              left={(props) => (
                <View style={[styles.menuIcon, { backgroundColor: colors.background.secondary }]}>
                  <Icon name="cog-outline" size={20} color={colors.text.secondary} />
                </View>
              )}
              right={(props) => <Icon name="chevron-right" size={24} color={colors.text.tertiary} />}
              onPress={() => navigation.navigate('Settings')}
              style={styles.menuItem}
              titleStyle={styles.menuTitle}
              descriptionStyle={styles.menuDescription}
            />
            <Divider style={styles.menuDivider} />
            <List.Item
              title="Help & Support"
              description="FAQs and contact support"
              left={(props) => (
                <View style={[styles.menuIcon, { backgroundColor: colors.background.secondary }]}>
                  <Icon name="help-circle-outline" size={20} color={colors.text.secondary} />
                </View>
              )}
              right={(props) => <Icon name="chevron-right" size={24} color={colors.text.tertiary} />}
              onPress={() => {}}
              style={styles.menuItem}
              titleStyle={styles.menuTitle}
              descriptionStyle={styles.menuDescription}
            />
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>ThreadIQ</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appTagline}>Your Wardrobe Operating System</Text>
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
    paddingBottom: spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  avatar: {
    backgroundColor: colors.primary.main,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  email: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  editButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  editButtonText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  statsCard: {
    marginHorizontal: spacing.base,
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  insightText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  menuItem: {
    paddingVertical: spacing.sm,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  menuDescription: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  menuDivider: {
    backgroundColor: colors.border.light,
    marginLeft: 68,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: spacing['2xl'],
    paddingVertical: spacing.xl,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  appVersion: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  appTagline: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});
