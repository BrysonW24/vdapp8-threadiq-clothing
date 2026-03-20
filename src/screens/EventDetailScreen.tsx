/**
 * ThreadIQ Event Detail Screen
 * Event info, outfit planning, post-event photos, share
 */

import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../store';
import { deleteEvent } from '../store/slices/calendarSlice';
import { colors, spacing, borderRadius } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import type { EventDressCode } from '../types/calendar.types';

const DRESS_CODE_LABELS: Record<EventDressCode, string> = {
  'casual': 'Casual',
  'smart-casual': 'Smart Casual',
  'cocktail': 'Cocktail',
  'formal': 'Formal',
  'black-tie': 'Black Tie',
  'costume': 'Costume',
  'activewear': 'Activewear',
  'beach': 'Beach',
};

export default function EventDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EventDetail'>>();
  const dispatch = useAppDispatch();

  const event = useAppSelector((state) =>
    state.calendar.events.find((e) => e.id === route.params.eventId),
  );

  const wardrobeItems = useAppSelector((state) => state.wardrobe.items);

  const plannedItems = useMemo(() => {
    if (!event?.outfitPlan?.itemIds.length) return [];
    return wardrobeItems.filter((i) => event.outfitPlan!.itemIds.includes(i.id));
  }, [event, wardrobeItems]);

  const handleCapturePhoto = useCallback(() => {
    if (!event) return;
    navigation.navigate('PostEventCapture', { eventId: event.id });
  }, [event, navigation]);

  const handleDelete = useCallback(() => {
    if (!event) return;
    dispatch(deleteEvent(event.id));
    navigation.goBack();
  }, [event, dispatch, navigation]);

  if (!event) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyState}>
          <Text>Event not found</Text>
          <Button onPress={() => navigation.goBack()}>Go Back</Button>
        </View>
      </SafeAreaView>
    );
  }

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Icon name="delete-outline" size={22} color={colors.text.tertiary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Event Info Card */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.eventTitle}>{event.title}</Text>

            <View style={styles.infoRow}>
              <Icon name="calendar" size={18} color={colors.accent.main} />
              <Text style={styles.infoText}>
                {eventDate.toLocaleDateString('en-AU', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="clock-outline" size={18} color={colors.accent.main} />
              <Text style={styles.infoText}>
                {eventDate.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </Text>
            </View>

            {event.location && (
              <View style={styles.infoRow}>
                <Icon name="map-marker-outline" size={18} color={colors.accent.main} />
                <Text style={styles.infoText}>{event.location}</Text>
              </View>
            )}

            {event.dressCode && (
              <View style={styles.infoRow}>
                <Icon name="tie" size={18} color={colors.accent.main} />
                <Text style={styles.infoText}>{DRESS_CODE_LABELS[event.dressCode]}</Text>
              </View>
            )}

            {event.notes && (
              <Text style={styles.notes}>{event.notes}</Text>
            )}
          </Card.Content>
        </Card>

        {/* Outfit Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outfit Plan</Text>
          {plannedItems.length > 0 ? (
            <View style={styles.outfitGrid}>
              {plannedItems.map((item) => (
                <View key={item.id} style={styles.outfitItem}>
                  <Image source={{ uri: item.imageUri }} style={styles.outfitImage} resizeMode="cover" />
                  <Text style={styles.outfitItemName} numberOfLines={1}>
                    {item.brand || item.subcategory}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <TouchableOpacity style={styles.planButton}>
              <Icon name="plus-circle-outline" size={24} color={colors.accent.main} />
              <Text style={styles.planButtonText}>Plan your outfit</Text>
            </TouchableOpacity>
          )}
          {event.outfitPlan?.notes && (
            <Text style={styles.planNotes}>{event.outfitPlan.notes}</Text>
          )}
        </View>

        {/* Post-Event Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isPast ? 'Outfit Photos' : 'After the Event'}
          </Text>
          {event.photos.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {event.photos.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.photo} resizeMode="cover" />
              ))}
            </ScrollView>
          ) : isPast ? (
            <Button
              mode="contained"
              onPress={handleCapturePhoto}
              icon="camera"
              style={styles.captureButton}
              labelStyle={styles.captureButtonText}
            >
              Snap Your Look
            </Button>
          ) : (
            <Text style={styles.futureText}>
              After your event, capture a photo of your outfit to remember and share!
            </Text>
          )}
        </View>

        {/* Share Button */}
        {event.photos.length > 0 && (
          <Button
            mode="outlined"
            icon="share-variant"
            style={styles.shareButton}
            labelStyle={styles.shareButtonText}
          >
            Share Outfit
          </Button>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  backButton: { padding: spacing.xs },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.text.primary },
  deleteButton: { padding: spacing.xs },
  content: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  notes: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  outfitGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  outfitItem: {
    width: 80,
    alignItems: 'center',
  },
  outfitImage: {
    width: 80,
    height: 100,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
  },
  outfitItemName: {
    fontSize: 10,
    color: colors.text.tertiary,
    marginTop: 4,
    textAlign: 'center',
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  planButtonText: {
    fontSize: 15,
    color: colors.accent.main,
    fontWeight: '600',
  },
  planNotes: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  photo: {
    width: 150,
    height: 200,
    borderRadius: borderRadius.lg,
    marginRight: spacing.sm,
    backgroundColor: colors.background.secondary,
  },
  captureButton: {
    backgroundColor: colors.accent.main,
    borderRadius: borderRadius.lg,
  },
  captureButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  futureText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
    padding: spacing.lg,
  },
  shareButton: {
    borderColor: colors.accent.main,
    borderRadius: borderRadius.lg,
  },
  shareButtonText: {
    color: colors.accent.main,
    fontWeight: '600',
  },
});
