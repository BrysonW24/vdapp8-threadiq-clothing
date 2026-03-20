/**
 * ThreadIQ Calendar Types
 * Fashion events, outfit planning, and device calendar integration
 */

// ============================================
// DRESS CODES
// ============================================

export type EventDressCode =
  | 'casual'
  | 'smart-casual'
  | 'cocktail'
  | 'formal'
  | 'black-tie'
  | 'costume'
  | 'activewear'
  | 'beach';

// ============================================
// OUTFIT PLAN
// ============================================

export interface OutfitPlan {
  outfitId?: string; // reference to saved Outfit
  itemIds: string[]; // individual wardrobe item IDs
  notes?: string;
}

// ============================================
// FASHION EVENT
// ============================================

export interface FashionEvent {
  id: string;
  title: string;
  date: string; // ISO
  endDate?: string; // ISO
  location?: string;
  dressCode?: EventDressCode;
  outfitPlan?: OutfitPlan;
  photos: string[]; // URIs of post-event outfit photos
  isFromDeviceCalendar: boolean;
  deviceCalendarEventId?: string;
  isArchived: boolean;
  reminderSent: boolean;
  notes?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

// ============================================
// PAYLOADS
// ============================================

export interface AddEventPayload {
  title: string;
  date: string;
  endDate?: string;
  location?: string;
  dressCode?: EventDressCode;
  notes?: string;
  isFromDeviceCalendar?: boolean;
  deviceCalendarEventId?: string;
}

export interface UpdateEventPayload {
  id: string;
  changes: Partial<Omit<FashionEvent, 'id' | 'createdAt'>>;
}

// ============================================
// DEVICE CALENDAR EVENT (simplified from expo-calendar)
// ============================================

export interface DeviceCalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location?: string;
  notes?: string;
}

// ============================================
// REDUX STATE
// ============================================

export interface CalendarState {
  events: FashionEvent[];
  isLoading: boolean;
  error: string | null;
  selectedDate: string | null; // ISO date string for calendar view
  deviceCalendarPermission: 'undetermined' | 'granted' | 'denied';
  deviceCalendarEvents: DeviceCalendarEvent[];
}
