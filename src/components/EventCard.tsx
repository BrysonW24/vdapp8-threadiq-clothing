/**
 * ThreadIQ Event Card
 * Compact card for fashion events in lists
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius } from '../theme';
import type { FashionEvent, EventDressCode } from '../types/calendar.types';

const DRESS_CODE_CONFIG: Record<EventDressCode, { label: string; icon: string; color: string }> = {
  'casual': { label: 'Casual', icon: 'tshirt-crew', color: '#27AE60' },
  'smart-casual': { label: 'Smart Casual', icon: 'tie', color: '#3498DB' },
  'cocktail': { label: 'Cocktail', icon: 'glass-cocktail', color: '#9B59B6' },
  'formal': { label: 'Formal', icon: 'tie', color: '#2C3E50' },
  'black-tie': { label: 'Black Tie', icon: 'bow-tie', color: '#1A1A2E' },
  'costume': { label: 'Costume', icon: 'drama-masks', color: '#E74C3C' },
  'activewear': { label: 'Active', icon: 'run', color: '#FF6B35' },
  'beach': { label: 'Beach', icon: 'beach', color: '#00BCD4' },
};

function formatEventDate(dateStr: string): { day: string; month: string; time: string; dayOfWeek: string } {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString(),
    month: d.toLocaleDateString('en-AU', { month: 'short' }),
    time: d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true }),
    dayOfWeek: d.toLocaleDateString('en-AU', { weekday: 'short' }),
  };
}

function daysUntil(dateStr: string): string {
  const now = new Date();
  const eventDate = new Date(dateStr);
  const diff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 0) return `${Math.abs(diff)}d ago`;
  return `In ${diff} days`;
}

interface Props {
  event: FashionEvent;
  onPress: (eventId: string) => void;
  compact?: boolean;
}

export default function EventCard({ event, onPress, compact = false }: Props) {
  const dateInfo = formatEventDate(event.date);
  const dressConfig = event.dressCode ? DRESS_CODE_CONFIG[event.dressCode] : null;
  const countdown = daysUntil(event.date);

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact]}
      onPress={() => onPress(event.id)}
      activeOpacity={0.7}
    >
      {/* Date column */}
      <View style={styles.dateColumn}>
        <Text style={styles.dateDay}>{dateInfo.day}</Text>
        <Text style={styles.dateMonth}>{dateInfo.month}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
        <View style={styles.detailsRow}>
          {event.location && (
            <View style={styles.detail}>
              <Icon name="map-marker-outline" size={12} color={colors.text.tertiary} />
              <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
            </View>
          )}
          <View style={styles.detail}>
            <Icon name="clock-outline" size={12} color={colors.text.tertiary} />
            <Text style={styles.detailText}>{dateInfo.time}</Text>
          </View>
        </View>

        {/* Tags row */}
        <View style={styles.tagsRow}>
          {dressConfig && (
            <View style={[styles.dressCodeBadge, { backgroundColor: dressConfig.color + '15' }]}>
              <Icon name={dressConfig.icon} size={10} color={dressConfig.color} />
              <Text style={[styles.dressCodeText, { color: dressConfig.color }]}>
                {dressConfig.label}
              </Text>
            </View>
          )}

          {event.outfitPlan && (
            <View style={styles.plannedBadge}>
              <Icon name="check-circle" size={10} color="#27AE60" />
              <Text style={styles.plannedText}>Outfit Planned</Text>
            </View>
          )}
        </View>
      </View>

      {/* Countdown */}
      <View style={styles.countdownColumn}>
        <Text style={[styles.countdown, event.isArchived && styles.countdownPast]}>
          {countdown}
        </Text>
        {event.isFromDeviceCalendar && (
          <Icon name="calendar-sync" size={14} color={colors.text.tertiary} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  cardCompact: {
    padding: spacing.sm,
  },
  dateColumn: {
    width: 48,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  dateDay: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary.main,
    lineHeight: 28,
  },
  dateMonth: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 4,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  detailText: {
    fontSize: 11,
    color: colors.text.tertiary,
    maxWidth: 120,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  dressCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  dressCodeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  plannedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: '#27AE6015',
  },
  plannedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#27AE60',
  },
  countdownColumn: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  countdown: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent.main,
  },
  countdownPast: {
    color: colors.text.tertiary,
  },
});
