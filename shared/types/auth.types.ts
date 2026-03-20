/**
 * Auth Types - iOS Simulator Ready
 *
 * KEY LEARNING: Use `Date | string` for createdAt to support both
 * Date objects (from real auth) and ISO strings (for Redux serialization)
 */

export type AuthProvider = 'email' | 'apple' | 'google' | 'facebook' | 'phone';

export interface AuthUser {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  provider: AuthProvider;
  // IMPORTANT: Accept both Date and string for Redux serialization compatibility
  createdAt: Date | string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  onboardingComplete: boolean;
}

export interface SignupCredentials {
  email: string;
  password: string;
  displayName?: string;
  confirmPassword?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SocialAuthResult {
  provider: AuthProvider;
  user: AuthUser;
  isNewUser: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  provider?: AuthProvider;
}
