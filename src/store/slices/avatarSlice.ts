/**
 * ThreadIQ Avatar Slice
 * Manages 3D avatar configuration state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  AvatarState,
  AvatarConfig,
  BodyShape,
  SkinTone,
  HairStyle,
  HairColor,
  FaceShape,
} from '../../types/avatar.types';

const initialState: AvatarState = {
  config: null,
  isLoading: false,
};

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    initializeAvatar: (state) => {
      if (!state.config) {
        const now = new Date().toISOString();
        state.config = {
          bodyShape: 'average',
          skinTone: 'tone-5',
          height: 170,
          hairStyle: 'medium',
          hairColor: 'brown',
          faceShape: 'oval',
          isComplete: false,
          createdAt: now,
          updatedAt: now,
        };
      }
    },

    setBodyShape: (state, action: PayloadAction<BodyShape>) => {
      if (state.config) {
        state.config.bodyShape = action.payload;
        state.config.updatedAt = new Date().toISOString();
      }
    },

    setSkinTone: (state, action: PayloadAction<SkinTone>) => {
      if (state.config) {
        state.config.skinTone = action.payload;
        state.config.updatedAt = new Date().toISOString();
      }
    },

    setHeight: (state, action: PayloadAction<number>) => {
      if (state.config) {
        state.config.height = Math.max(140, Math.min(210, action.payload));
        state.config.updatedAt = new Date().toISOString();
      }
    },

    setHairStyle: (state, action: PayloadAction<HairStyle>) => {
      if (state.config) {
        state.config.hairStyle = action.payload;
        state.config.updatedAt = new Date().toISOString();
      }
    },

    setHairColor: (state, action: PayloadAction<HairColor>) => {
      if (state.config) {
        state.config.hairColor = action.payload;
        state.config.updatedAt = new Date().toISOString();
      }
    },

    setFaceShape: (state, action: PayloadAction<FaceShape>) => {
      if (state.config) {
        state.config.faceShape = action.payload;
        state.config.updatedAt = new Date().toISOString();
      }
    },

    markAvatarComplete: (state) => {
      if (state.config) {
        state.config.isComplete = true;
        state.config.updatedAt = new Date().toISOString();
      }
    },

    resetAvatar: (state) => {
      state.config = null;
    },
  },
});

export const {
  initializeAvatar,
  setBodyShape,
  setSkinTone,
  setHeight,
  setHairStyle,
  setHairColor,
  setFaceShape,
  markAvatarComplete,
  resetAvatar,
} = avatarSlice.actions;

// Selectors
export const selectAvatarConfig = (state: { avatar: AvatarState }) => state.avatar.config;
export const selectAvatarComplete = (state: { avatar: AvatarState }) => state.avatar.config?.isComplete || false;

export default avatarSlice.reducer;
