/**
 * ThreadIQ Outfit Screen
 * AI-powered outfit suggestions based on context
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Text, Chip, IconButton, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../store';
import { selectAvailableItems } from '../store/slices/wardrobeSlice';
import { colors, spacing, borderRadius, shadows } from '../theme';
import type { WardrobeItem, OccasionType } from '../types/wardrobe.types';

const { width } = Dimensions.get('window');

// Occasion options
const OCCASIONS: { id: OccasionType; label: string; icon: string }[] = [
  { id: 'work', label: 'Work', icon: 'briefcase' },
  { id: 'casual', label: 'Casual', icon: 'sofa' },
  { id: 'formal', label: 'Formal', icon: 'tie' },
  { id: 'date', label: 'Date Night', icon: 'heart' },
  { id: 'workout', label: 'Workout', icon: 'dumbbell' },
  { id: 'outdoor', label: 'Outdoor', icon: 'tree' },
];

// Weather conditions
const WEATHER_OPTIONS = [
  { id: 'sunny', label: 'Sunny', icon: 'weather-sunny', temp: '25°C' },
  { id: 'cloudy', label: 'Cloudy', icon: 'weather-cloudy', temp: '20°C' },
  { id: 'rainy', label: 'Rainy', icon: 'weather-rainy', temp: '15°C' },
  { id: 'cold', label: 'Cold', icon: 'snowflake', temp: '5°C' },
];

// Mock outfit suggestions (will be replaced with AI)
interface OutfitSuggestion {
  id: string;
  name: string;
  items: string[]; // item IDs
  occasion: OccasionType;
  confidence: number;
  reason: string;
}

export default function OutfitScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const availableItems = useAppSelector(selectAvailableItems);

  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>('casual');
  const [selectedWeather, setSelectedWeather] = useState('sunny');
  const [refreshing, setRefreshing] = useState(false);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);

  // Generate mock suggestions based on available items
  const generateSuggestions = useCallback((): OutfitSuggestion[] => {
    if (availableItems.length < 2) return [];

    // Group items by category
    const tops = availableItems.filter((i) => i.category === 'tops');
    const bottoms = availableItems.filter((i) => i.category === 'bottoms');
    const shoes = availableItems.filter((i) => i.category === 'shoes');
    const outerwear = availableItems.filter((i) => i.category === 'outerwear');

    const suggestions: OutfitSuggestion[] = [];

    // Generate up to 3 outfit combinations
    for (let i = 0; i < Math.min(3, tops.length); i++) {
      const top = tops[i];
      const bottom = bottoms[i % bottoms.length];
      const shoe = shoes.length > 0 ? shoes[i % shoes.length] : null;

      if (top && bottom) {
        const items = [top.id, bottom.id];
        if (shoe) items.push(shoe.id);
        if (selectedWeather === 'cold' && outerwear.length > 0) {
          items.push(outerwear[0].id);
        }

        suggestions.push({
          id: `outfit-${i}`,
          name: `${selectedOccasion.charAt(0).toUpperCase() + selectedOccasion.slice(1)} Look ${i + 1}`,
          items,
          occasion: selectedOccasion,
          confidence: 0.85 - i * 0.1,
          reason: getOutfitReason(selectedOccasion, selectedWeather),
        });
      }
    }

    return suggestions;
  }, [availableItems, selectedOccasion, selectedWeather]);

  const suggestions = generateSuggestions();
  const currentSuggestion = suggestions[currentOutfitIndex];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCurrentOutfitIndex(0);
    setRefreshing(false);
  }, []);

  const handleNextOutfit = () => {
    if (currentOutfitIndex < suggestions.length - 1) {
      setCurrentOutfitIndex(currentOutfitIndex + 1);
    }
  };

  const handlePreviousOutfit = () => {
    if (currentOutfitIndex > 0) {
      setCurrentOutfitIndex(currentOutfitIndex - 1);
    }
  };

  const handleItemPress = (itemId: string) => {
    navigation.navigate('ItemDetails', { itemId });
  };

  const handleWearOutfit = () => {
    // TODO: Log wear for all items in outfit
    // For now, just show feedback
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="hanger" size={80} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No outfits yet</Text>
      <Text style={styles.emptySubtitle}>
        Add at least 2 items to your wardrobe to get outfit suggestions
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddItem')}
        style={styles.emptyButton}
        labelStyle={styles.emptyButtonText}
      >
        Add Items
      </Button>
    </View>
  );

  const renderOutfitItem = (itemId: string) => {
    const item = availableItems.find((i) => i.id === itemId);
    if (!item) return null;

    return (
      <TouchableOpacity
        key={itemId}
        style={styles.outfitItem}
        onPress={() => handleItemPress(itemId)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.imageUri }} style={styles.outfitItemImage} resizeMode="cover" />
        <View style={styles.outfitItemInfo}>
          <Text style={styles.outfitItemBrand} numberOfLines={1}>
            {item.brand || item.subcategory}
          </Text>
          <Text style={styles.outfitItemCategory}>{item.category}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Outfit</Text>
        <IconButton
          icon="refresh"
          size={24}
          iconColor={colors.text.primary}
          onPress={onRefresh}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Weather Context */}
        <Card style={styles.contextCard}>
          <Card.Content>
            <View style={styles.weatherRow}>
              <View style={styles.weatherInfo}>
                <Icon
                  name={WEATHER_OPTIONS.find((w) => w.id === selectedWeather)?.icon || 'weather-sunny'}
                  size={32}
                  color={colors.accent.main}
                />
                <View style={styles.weatherText}>
                  <Text style={styles.weatherTemp}>
                    {WEATHER_OPTIONS.find((w) => w.id === selectedWeather)?.temp}
                  </Text>
                  <Text style={styles.weatherLabel}>
                    {WEATHER_OPTIONS.find((w) => w.id === selectedWeather)?.label}
                  </Text>
                </View>
              </View>
              <View style={styles.weatherSelector}>
                {WEATHER_OPTIONS.map((weather) => (
                  <TouchableOpacity
                    key={weather.id}
                    style={[
                      styles.weatherOption,
                      selectedWeather === weather.id && styles.weatherOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedWeather(weather.id);
                      setCurrentOutfitIndex(0);
                    }}
                  >
                    <Icon
                      name={weather.icon}
                      size={18}
                      color={selectedWeather === weather.id ? colors.text.inverse : colors.text.tertiary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Occasion Filter */}
        <Text style={styles.sectionTitle}>What's the occasion?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.occasionList}
        >
          {OCCASIONS.map((occasion) => (
            <Chip
              key={occasion.id}
              selected={selectedOccasion === occasion.id}
              onPress={() => {
                setSelectedOccasion(occasion.id);
                setCurrentOutfitIndex(0);
              }}
              style={[
                styles.occasionChip,
                selectedOccasion === occasion.id && styles.occasionChipActive,
              ]}
              textStyle={[
                styles.occasionChipText,
                selectedOccasion === occasion.id && styles.occasionChipTextActive,
              ]}
              icon={() => (
                <Icon
                  name={occasion.icon}
                  size={16}
                  color={selectedOccasion === occasion.id ? colors.text.inverse : colors.text.secondary}
                />
              )}
            >
              {occasion.label}
            </Chip>
          ))}
        </ScrollView>

        {/* Outfit Suggestion */}
        {suggestions.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <View style={styles.suggestionHeader}>
              <Text style={styles.sectionTitle}>Suggested Outfit</Text>
              <Text style={styles.suggestionCounter}>
                {currentOutfitIndex + 1} of {suggestions.length}
              </Text>
            </View>

            {currentSuggestion && (
              <Card style={styles.outfitCard}>
                <Card.Content>
                  {/* Outfit Name & Confidence */}
                  <View style={styles.outfitHeader}>
                    <Text style={styles.outfitName}>{currentSuggestion.name}</Text>
                    <View style={styles.confidenceBadge}>
                      <Icon name="check-circle" size={14} color={colors.status.success} />
                      <Text style={styles.confidenceText}>
                        {Math.round(currentSuggestion.confidence * 100)}% match
                      </Text>
                    </View>
                  </View>

                  {/* Outfit Reason */}
                  <Text style={styles.outfitReason}>{currentSuggestion.reason}</Text>

                  {/* Outfit Items Grid */}
                  <View style={styles.outfitItemsGrid}>
                    {currentSuggestion.items.map(renderOutfitItem)}
                  </View>

                  {/* Navigation & Actions */}
                  <View style={styles.outfitActions}>
                    <TouchableOpacity
                      style={[styles.navButton, currentOutfitIndex === 0 && styles.navButtonDisabled]}
                      onPress={handlePreviousOutfit}
                      disabled={currentOutfitIndex === 0}
                    >
                      <Icon
                        name="chevron-left"
                        size={28}
                        color={currentOutfitIndex === 0 ? colors.text.tertiary : colors.text.primary}
                      />
                    </TouchableOpacity>

                    <Button
                      mode="contained"
                      onPress={handleWearOutfit}
                      style={styles.wearButton}
                      labelStyle={styles.wearButtonText}
                      icon="check"
                    >
                      Wear This
                    </Button>

                    <TouchableOpacity
                      style={[
                        styles.navButton,
                        currentOutfitIndex === suggestions.length - 1 && styles.navButtonDisabled,
                      ]}
                      onPress={handleNextOutfit}
                      disabled={currentOutfitIndex === suggestions.length - 1}
                    >
                      <Icon
                        name="chevron-right"
                        size={28}
                        color={
                          currentOutfitIndex === suggestions.length - 1
                            ? colors.text.tertiary
                            : colors.text.primary
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </Card>
            )}

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickAction}>
                <Icon name="shuffle-variant" size={24} color={colors.accent.main} />
                <Text style={styles.quickActionText}>Shuffle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction}>
                <Icon name="heart-outline" size={24} color={colors.accent.main} />
                <Text style={styles.quickActionText}>Save Look</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction}>
                <Icon name="share-variant" size={24} color={colors.accent.main} />
                <Text style={styles.quickActionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function for outfit reasons
function getOutfitReason(occasion: OccasionType, weather: string): string {
  const reasons: Record<string, Record<string, string>> = {
    work: {
      sunny: 'Light and professional for a warm office day',
      cloudy: 'Polished look with comfortable layering options',
      rainy: 'Professional and weather-appropriate',
      cold: 'Warm layers while maintaining a sharp look',
    },
    casual: {
      sunny: 'Relaxed and comfortable for a sunny day',
      cloudy: 'Easy-going style for any daytime activity',
      rainy: 'Casual comfort with practical choices',
      cold: 'Cozy and casual for cooler weather',
    },
    formal: {
      sunny: 'Elegant and refined for your occasion',
      cloudy: 'Classic sophistication with subtle layers',
      rainy: 'Formal attire with weather-conscious choices',
      cold: 'Refined layers for an elegant evening',
    },
    date: {
      sunny: 'Stylish and put-together for a special day',
      cloudy: 'Charming look for romantic moments',
      rainy: 'Date-ready with weather protection',
      cold: 'Warm and romantic for evening plans',
    },
    workout: {
      sunny: 'Breathable and performance-ready',
      cloudy: 'Comfortable for outdoor training',
      rainy: 'Weather-resistant workout gear',
      cold: 'Layered warmth for cold-weather exercise',
    },
    outdoor: {
      sunny: 'Practical and comfortable for adventure',
      cloudy: 'Versatile layers for changing conditions',
      rainy: 'Weather-ready outdoor essentials',
      cold: 'Warm and functional for outdoor activities',
    },
  };

  return reasons[occasion]?.[weather] || 'A thoughtfully curated outfit for your day';
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  contextCard: {
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  weatherText: {
    gap: 2,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  weatherLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  weatherSelector: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  weatherOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherOptionActive: {
    backgroundColor: colors.primary.main,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  occasionList: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  occasionChip: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
  },
  occasionChipActive: {
    backgroundColor: colors.primary.main,
  },
  occasionChipText: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  occasionChipTextActive: {
    color: colors.text.inverse,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  suggestionCounter: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  outfitCard: {
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  outfitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  outfitName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  confidenceText: {
    fontSize: 12,
    color: colors.status.success,
    fontWeight: '500',
  },
  outfitReason: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  outfitItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  outfitItem: {
    width: (width - spacing.base * 2 - spacing.md * 2 - spacing.sm * 2) / 3,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  outfitItemImage: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  outfitItemInfo: {
    padding: spacing.xs,
  },
  outfitItemBrand: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.primary,
  },
  outfitItemCategory: {
    fontSize: 10,
    color: colors.text.tertiary,
    textTransform: 'capitalize',
  },
  outfitActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    padding: spacing.sm,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  wearButton: {
    flex: 1,
    marginHorizontal: spacing.md,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
  },
  wearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
