/**
 * ThreadIQ Calendar Screen (Events Tab)
 * Month view with event dots + upcoming events list
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, SegmentedButtons, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store';
import {
  selectUpcomingEvents,
  selectPastEvents,
  selectEventDates,
  syncDeviceCalendar,
  autoArchivePastEvents,
} from '../store/slices/calendarSlice';
import EventCard from '../components/EventCard';
import { colors, spacing, borderRadius } from '../theme';
import type { FashionEvent } from '../types/calendar.types';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

export default function CalendarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const upcomingEvents = useAppSelector(selectUpcomingEvents);
  const pastEvents = useAppSelector(selectPastEvents);
  const eventDates = useAppSelector(selectEventDates);

  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  useEffect(() => {
    dispatch(autoArchivePastEvents());
  }, [dispatch]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDay, daysInMonth]);

  const handleEventPress = useCallback((eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  }, [navigation]);

  const handleAddEvent = useCallback(() => {
    navigation.navigate('AddEvent');
  }, [navigation]);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleSyncCalendar = useCallback(() => {
    dispatch(syncDeviceCalendar());
  }, [dispatch]);

  const displayEvents = view === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Events</Text>
          <View style={styles.headerActions}>
            <IconButton
              icon="calendar-sync"
              size={22}
              iconColor={colors.text.secondary}
              onPress={handleSyncCalendar}
            />
          </View>
        </View>

        {/* Mini Calendar */}
        <View style={styles.calendarCard}>
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={handlePrevMonth}>
              <Icon name="chevron-left" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
            <TouchableOpacity onPress={handleNextMonth}>
              <Icon name="chevron-right" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Weekday headers */}
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((day) => (
              <Text key={day} style={styles.weekdayLabel}>{day}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <View key={`empty-${index}`} style={styles.calendarCell} />;
              }
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const hasEvent = eventDates[dateStr] > 0;
              const isToday = dateStr === todayStr;

              return (
                <TouchableOpacity
                  key={dateStr}
                  style={[styles.calendarCell, isToday && styles.todayCell]}
                  onPress={() => {
                    navigation.navigate('AddEvent', { date: dateStr });
                  }}
                >
                  <Text style={[styles.calendarDay, isToday && styles.todayText]}>
                    {day}
                  </Text>
                  {hasEvent && (
                    <View style={styles.eventDot} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Segment Toggle */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentButton, view === 'upcoming' && styles.segmentActive]}
            onPress={() => setView('upcoming')}
          >
            <Text style={[styles.segmentText, view === 'upcoming' && styles.segmentTextActive]}>
              Upcoming ({upcomingEvents.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentButton, view === 'past' && styles.segmentActive]}
            onPress={() => setView('past')}
          >
            <Text style={[styles.segmentText, view === 'past' && styles.segmentTextActive]}>
              Past ({pastEvents.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Events List */}
        <View style={styles.eventsSection}>
          {displayEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon
                name={view === 'upcoming' ? 'calendar-plus' : 'calendar-check'}
                size={48}
                color={colors.text.tertiary}
              />
              <Text style={styles.emptyTitle}>
                {view === 'upcoming' ? 'No upcoming events' : 'No past events'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {view === 'upcoming'
                  ? 'Add an event to start planning your outfit'
                  : 'Past events and their outfits will appear here'}
              </Text>
            </View>
          ) : (
            displayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={handleEventPress}
              />
            ))
          )}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        color={colors.text.inverse}
        onPress={handleAddEvent}
        label="Add Event"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  calendarCard: {
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.xl,
    margin: spacing.base,
    padding: spacing.md,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCell: {
    backgroundColor: colors.primary.main,
    borderRadius: 20,
  },
  calendarDay: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  todayText: {
    color: colors.text.inverse,
    fontWeight: '700',
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent.main,
    position: 'absolute',
    bottom: 4,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.base,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: 3,
    marginBottom: spacing.md,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  segmentActive: {
    backgroundColor: colors.card.background,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  segmentTextActive: {
    color: colors.text.primary,
  },
  eventsSection: {
    paddingHorizontal: spacing.base,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
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
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.base,
    backgroundColor: colors.primary.main,
  },
});
