'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, AuthState } from '@/types/auth.types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      onboardingComplete: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        // Simulate API call
        await new Promise((r) => setTimeout(r, 500));
        if (password.length < 6) {
          set({ isLoading: false, error: 'Invalid credentials' });
          return false;
        }
        const user: AuthUser = {
          uid: 'user-' + Date.now(),
          email,
          phoneNumber: null,
          displayName: email.split('@')[0],
          photoURL: null,
          emailVerified: true,
          phoneVerified: false,
          provider: 'email',
          createdAt: new Date().toISOString(),
        };
        set({ user, isAuthenticated: true, isLoading: false, onboardingComplete: true });
        return true;
      },

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 500));
        if (password.length < 6) {
          set({ isLoading: false, error: 'Password must be at least 6 characters' });
          return false;
        }
        const user: AuthUser = {
          uid: 'user-' + Date.now(),
          email,
          phoneNumber: null,
          displayName: name,
          photoURL: null,
          emailVerified: false,
          phoneVerified: false,
          provider: 'email',
          createdAt: new Date().toISOString(),
        };
        set({ user, isAuthenticated: true, isLoading: false, onboardingComplete: true });
        return true;
      },

      logout: () =>
        set({ user: null, isAuthenticated: false, onboardingComplete: false, error: null }),

      clearError: () => set({ error: null }),
    }),
    { name: 'threadiq-auth' }
  )
);
