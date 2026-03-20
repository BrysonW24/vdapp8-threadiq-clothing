/**
 * ThreadIQ Add Event Screen
 * Create a fashion event with date, location, dress code
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Text, Button, TextInput, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useAppDispatch } from '../store';
import { addEvent } from '../store/slices/calendarSlice';
import notificationService from '../services/notifications/NotificationService';
import { colors, spacing, borderRadius } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import type { EventDressCode } from '../types/calendar.types';

const DRESS_CODES: { id: EventDressCode; label: string; icon: string }[] = [
  { id: 'casual', label: 'Casual', icon: 'tshirt-crew' },
  { id: 'smart-casual', label: 'Smart Casual', icon: 'tie' },
  { id: 'cocktail', label: 'Cocktail', icon: 'glass-cocktail' },
  { id: 'formal', label: 'Formal', icon: 'tie' },
  { id: 'black-tie', label: 'Black Tie', icon: 'bow-tie' },
  { id: 'costume', label: 'Costume', icon: 'drama-masks' },
  { id: 'activewear', label: 'Active', icon: 'run' },
  { id: 'beach', label: 'Beach', icon: 'beach' },
];

export default function AddEventScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'AddEvent'>>();
  const dispatch = useAppDispatch();

  // Pre-fill date if provided from calendar tap
  const preDate = route.params?.date;

  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState(preDate || '');
  const [timeStr, setTimeStr] = useState('18:00');
  const [location, setLocation] = useState('');
  const [dressCode, setDressCode] = useState<EventDressCode | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter an event title');
      return;
    }
    if (!dateStr.trim()) {
      Alert.alert('Required', 'Please enter a date (YYYY-MM-DD)');
      return;
    }

    setIsSubmitting(true);
    try {
      const eventDate = new Date(`${dateStr}T${timeStr}:00`);
      if (isNaN(eventDate.getTime())) {
        Alert.alert('Invalid Date', 'Please enter a valid date (YYYY-MM-DD)');
        setIsSubmitting(false);
        return;
      }

      const endDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000); // +3 hours default

      const result = await dispatch(
        addEvent({
          title: title.trim(),
          date: eventDate.toISOString(),
          endDate: endDate.toISOString(),
          location: location.trim() || undefined,
          dressCode: dressCode || undefined,
          notes: notes.trim() || undefined,
        }),
      ).unwrap();

      // Schedule notifications
      await notificationService.scheduleOutfitPlanReminder(
        result.id,
        result.title,
        result.date,
      );
      await notificationService.schedulePostEventReminder(
        result.id,
        result.title,
        endDate.toISOString(),
      );

      Alert.alert('Event Created!', `${title} has been added to your events.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  }, [title, dateStr, timeStr, location, dressCode, notes, dispatch, navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Event</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.label}>Event Name *</Text>
        <TextInput
          mode="outlined"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Sarah's Birthday Dinner"
          style={styles.input}
          outlineColor={colors.border.default}
          activeOutlineColor={colors.accent.main}
        />

        {/* Date */}
        <Text style={styles.label}>Date *</Text>
        <TextInput
          mode="outlined"
          value={dateStr}
          onChangeText={setDateStr}
          placeholder="YYYY-MM-DD"
          style={styles.input}
          outlineColor={colors.border.default}
          activeOutlineColor={colors.accent.main}
          keyboardType="numbers-and-punctuation"
        />

        {/* Time */}
        <Text style={styles.label}>Time</Text>
        <TextInput
          mode="outlined"
          value={timeStr}
          onChangeText={setTimeStr}
          placeholder="HH:MM (24h)"
          style={styles.input}
          outlineColor={colors.border.default}
          activeOutlineColor={colors.accent.main}
          keyboardType="numbers-and-punctuation"
        />

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          mode="outlined"
          value={location}
          onChangeText={setLocation}
          placeholder="e.g., Icebergs, Bondi Beach"
          style={styles.input}
          outlineColor={colors.border.default}
          activeOutlineColor={colors.accent.main}
          left={<TextInput.Icon icon="map-marker-outline" color={colors.text.tertiary} />}
        />

        {/* Dress Code */}
        <Text style={styles.label}>Dress Code</Text>
        <View style={styles.dressCodeGrid}>
          {DRESS_CODES.map((dc) => (
            <TouchableOpacity
              key={dc.id}
              style={[styles.dressCodeCard, dressCode === dc.id && styles.dressCodeCardActive]}
              onPress={() => setDressCode(dc.id === dressCode ? null : dc.id)}
              activeOpacity={0.7}
            >
              <Icon
                name={dc.icon}
                size={22}
                color={dressCode === dc.id ? colors.text.inverse : colors.text.secondary}
              />
              <Text
                style={[
                  styles.dressCodeText,
                  dressCode === dc.id && styles.dressCodeTextActive,
                ]}
              >
                {dc.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Text style={styles.label}>Notes</Text>
        <TextInput
          mode="outlined"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any outfit ideas or things to remember..."
          style={[styles.input, { height: 80 }]}
          outlineColor={colors.border.default}
          activeOutlineColor={colors.accent.main}
          multiline
          numberOfLines={3}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || !title.trim() || !dateStr.trim()}
          style={styles.submitButton}
          labelStyle={styles.submitButtonText}
          icon="calendar-plus"
        >
          Create Event
        </Button>
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
  headerSpacer: { width: 32 },
  form: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.primary,
  },
  dressCodeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dressCodeCard: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  dressCodeCardActive: {
    backgroundColor: colors.primary.main,
  },
  dressCodeText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  dressCodeTextActive: {
    color: colors.text.inverse,
  },
  submitButton: {
    marginTop: spacing['2xl'],
    marginBottom: spacing['3xl'],
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
