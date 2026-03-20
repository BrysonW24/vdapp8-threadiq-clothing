/**
 * ThreadIQ Avatar Types
 * 3D avatar customization for virtual try-on
 */

// ============================================
// BODY CONFIGURATION
// ============================================

export type BodyShape = 'slim' | 'average' | 'athletic' | 'curvy' | 'plus-size';

export type SkinTone =
  | 'tone-1'  // Very fair
  | 'tone-2'  // Fair
  | 'tone-3'  // Light
  | 'tone-4'  // Light-medium
  | 'tone-5'  // Medium
  | 'tone-6'  // Medium-dark
  | 'tone-7'  // Dark
  | 'tone-8'  // Very dark
  | 'tone-9'  // Deep
  | 'tone-10'; // Very deep

export type HairStyle =
  | 'short'
  | 'medium'
  | 'long'
  | 'curly'
  | 'braids'
  | 'bun'
  | 'ponytail'
  | 'pixie'
  | 'bald'
  | 'buzz';

export type HairColor =
  | 'black'
  | 'brown'
  | 'blonde'
  | 'red'
  | 'grey'
  | 'platinum'
  | 'auburn'
  | 'custom';

export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'oblong';

// ============================================
// AVATAR CONFIG
// ============================================

export interface AvatarConfig {
  bodyShape: BodyShape;
  skinTone: SkinTone;
  height: number; // cm, 140-210
  hairStyle: HairStyle;
  hairColor: HairColor;
  faceShape: FaceShape;
  isComplete: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

// ============================================
// SKIN TONE COLORS
// ============================================

export const SKIN_TONE_COLORS: Record<SkinTone, string> = {
  'tone-1': '#FFDBB4',
  'tone-2': '#EDB98A',
  'tone-3': '#D08B5B',
  'tone-4': '#C68642',
  'tone-5': '#AE6C37',
  'tone-6': '#8D5524',
  'tone-7': '#6E3B1A',
  'tone-8': '#5A2D0C',
  'tone-9': '#3B1E08',
  'tone-10': '#2D1506',
};

export const HAIR_COLOR_HEX: Record<HairColor, string> = {
  'black': '#1A1A1A',
  'brown': '#654321',
  'blonde': '#E8D44D',
  'red': '#C63030',
  'grey': '#9E9E9E',
  'platinum': '#E8E4E0',
  'auburn': '#A0522D',
  'custom': '#FF6B35',
};

// ============================================
// REDUX STATE
// ============================================

export interface AvatarState {
  config: AvatarConfig | null;
  isLoading: boolean;
}
