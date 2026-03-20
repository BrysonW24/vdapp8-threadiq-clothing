/**
 * ThreadIQ Calendar Mock Data
 * Sample fashion events for development/testing
 */

import type { FashionEvent } from '../types/calendar.types';

// Helper to create dates relative to now
function futureDate(daysFromNow: number, hour = 18): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function pastDate(daysAgo: number, hour = 19): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const mockCalendarEvents: FashionEvent[] = [
  {
    id: 'evt_001',
    title: 'Sarah\'s Birthday Dinner',
    date: futureDate(3, 19),
    endDate: futureDate(3, 23),
    location: 'Icebergs, Bondi Beach',
    dressCode: 'smart-casual',
    outfitPlan: {
      itemIds: [],
      notes: 'Something elevated but not too formal',
    },
    photos: [],
    isFromDeviceCalendar: false,
    isArchived: false,
    reminderSent: false,
    notes: 'Her favourite restaurant, rooftop terrace',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt_002',
    title: 'Work Conference',
    date: futureDate(10, 9),
    endDate: futureDate(10, 17),
    location: 'ICC Sydney',
    dressCode: 'formal',
    photos: [],
    isFromDeviceCalendar: true,
    deviceCalendarEventId: 'device_cal_123',
    isArchived: false,
    reminderSent: false,
    notes: 'Need to look professional but comfortable for all day',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt_003',
    title: 'Beach BBQ',
    date: futureDate(7, 12),
    endDate: futureDate(7, 18),
    location: 'Bronte Beach',
    dressCode: 'beach',
    photos: [],
    isFromDeviceCalendar: false,
    isArchived: false,
    reminderSent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt_004',
    title: 'Friend\'s Wedding',
    date: pastDate(5, 14),
    endDate: pastDate(5, 23),
    location: 'The Grounds of Alexandria',
    dressCode: 'cocktail',
    outfitPlan: {
      itemIds: [],
      notes: 'Navy suit with brown shoes',
    },
    photos: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=400'],
    isFromDeviceCalendar: false,
    isArchived: true,
    reminderSent: true,
    notes: 'Great time!',
    createdAt: pastDate(14).split('T')[0] + 'T10:00:00.000Z',
    updatedAt: pastDate(5).split('T')[0] + 'T23:00:00.000Z',
  },
];
