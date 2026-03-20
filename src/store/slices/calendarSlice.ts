/**
 * ThreadIQ Calendar Slice
 * Manages fashion events, outfit plans, and device calendar sync
 */

import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type {
  CalendarState,
  FashionEvent,
  AddEventPayload,
  UpdateEventPayload,
  OutfitPlan,
  DeviceCalendarEvent,
} from '../../types/calendar.types';

function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

const initialState: CalendarState = {
  events: [],
  isLoading: false,
  error: null,
  selectedDate: null,
  deviceCalendarPermission: 'undetermined',
  deviceCalendarEvents: [],
};

// ============================================
// ASYNC THUNKS
// ============================================

export const addEvent = createAsyncThunk(
  'calendar/addEvent',
  async (payload: AddEventPayload) => {
    const now = new Date().toISOString();
    const event: FashionEvent = {
      id: generateId(),
      title: payload.title,
      date: payload.date,
      endDate: payload.endDate,
      location: payload.location,
      dressCode: payload.dressCode,
      photos: [],
      isFromDeviceCalendar: payload.isFromDeviceCalendar || false,
      deviceCalendarEventId: payload.deviceCalendarEventId,
      isArchived: false,
      reminderSent: false,
      notes: payload.notes,
      createdAt: now,
      updatedAt: now,
    };
    return event;
  },
);

export const syncDeviceCalendar = createAsyncThunk(
  'calendar/syncDevice',
  async (_, { rejectWithValue }) => {
    try {
      // Dynamic import to avoid crash if module not available
      const Calendar = await import('expo-calendar');
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        return { permission: 'denied' as const, events: [] as DeviceCalendarEvent[] };
      }

      const now = new Date();
      const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const calendarIds = calendars.map((c: any) => c.id);

      const events = await Calendar.getEventsAsync(calendarIds, now, threeMonthsLater);

      const mapped: DeviceCalendarEvent[] = events.slice(0, 50).map((e: any) => ({
        id: e.id,
        title: e.title || 'Untitled Event',
        startDate: e.startDate,
        endDate: e.endDate,
        location: e.location || undefined,
        notes: e.notes || undefined,
      }));

      return { permission: 'granted' as const, events: mapped };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sync calendar');
    }
  },
);

// ============================================
// SLICE
// ============================================

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    updateEvent: (state, action: PayloadAction<UpdateEventPayload>) => {
      const index = state.events.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = {
          ...state.events[index],
          ...action.payload.changes,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((e) => e.id !== action.payload);
    },

    setOutfitPlan: (state, action: PayloadAction<{ eventId: string; plan: OutfitPlan }>) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        event.outfitPlan = action.payload.plan;
        event.updatedAt = new Date().toISOString();
      }
    },

    addEventPhoto: (state, action: PayloadAction<{ eventId: string; photoUri: string }>) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        event.photos.push(action.payload.photoUri);
        event.updatedAt = new Date().toISOString();
      }
    },

    archiveEvent: (state, action: PayloadAction<string>) => {
      const event = state.events.find((e) => e.id === action.payload);
      if (event) {
        event.isArchived = true;
        event.updatedAt = new Date().toISOString();
      }
    },

    autoArchivePastEvents: (state) => {
      const now = new Date().toISOString();
      state.events.forEach((event) => {
        if (!event.isArchived && event.date < now) {
          event.isArchived = true;
          event.updatedAt = now;
        }
      });
    },

    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
    },

    markReminderSent: (state, action: PayloadAction<string>) => {
      const event = state.events.find((e) => e.id === action.payload);
      if (event) {
        event.reminderSent = true;
      }
    },

    loadMockEvents: (state, action: PayloadAction<FashionEvent[]>) => {
      state.events = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add event
    builder.addCase(addEvent.fulfilled, (state, action) => {
      state.events.unshift(action.payload);
    });

    // Sync device calendar
    builder.addCase(syncDeviceCalendar.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(syncDeviceCalendar.fulfilled, (state, action) => {
      state.isLoading = false;
      state.deviceCalendarPermission = action.payload.permission;
      state.deviceCalendarEvents = action.payload.events;
    });
    builder.addCase(syncDeviceCalendar.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Calendar sync failed';
    });
  },
});

export const {
  updateEvent,
  deleteEvent,
  setOutfitPlan,
  addEventPhoto,
  archiveEvent,
  autoArchivePastEvents,
  setSelectedDate,
  markReminderSent,
  loadMockEvents,
} = calendarSlice.actions;

// ============================================
// SELECTORS
// ============================================

const selectCalendarState = (state: { calendar: CalendarState }) => state.calendar;

export const selectUpcomingEvents = createSelector(
  [selectCalendarState],
  (calendar) => {
    const now = new Date().toISOString();
    return calendar.events
      .filter((e) => !e.isArchived && e.date >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
);

export const selectPastEvents = createSelector(
  [selectCalendarState],
  (calendar) => {
    const now = new Date().toISOString();
    return calendar.events
      .filter((e) => e.date < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
);

export const selectEventsForDate = (date: string) =>
  createSelector(
    [selectCalendarState],
    (calendar) => {
      const dayStart = date.substring(0, 10); // YYYY-MM-DD
      return calendar.events.filter((e) => e.date.substring(0, 10) === dayStart);
    },
  );

export const selectEventDates = createSelector(
  [selectCalendarState],
  (calendar) => {
    const dates: Record<string, number> = {};
    calendar.events.forEach((e) => {
      const day = e.date.substring(0, 10);
      dates[day] = (dates[day] || 0) + 1;
    });
    return dates;
  },
);

export const selectSelectedDate = (state: { calendar: CalendarState }) => state.calendar.selectedDate;
export const selectDeviceCalendarEvents = (state: { calendar: CalendarState }) => state.calendar.deviceCalendarEvents;
export const selectCalendarPermission = (state: { calendar: CalendarState }) => state.calendar.deviceCalendarPermission;

export default calendarSlice.reducer;
