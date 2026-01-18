/**
 * Auth Service - iOS Simulator Ready
 *
 * This service provides mock authentication for iOS Simulator testing.
 * Replace with real authentication (Firebase, Supabase, etc.) for production.
 *
 * KEY LEARNINGS:
 * - Use ISO strings for dates (not Date objects) to avoid Redux serialization errors
 * - Mock auth allows full app testing without backend dependencies
 * - Set USE_MOCK_AUTH=true in .env or hardcode for simulator testing
 */

import { AuthUser, LoginCredentials, SignupCredentials } from '../../types/auth.types';

// Toggle this for simulator testing vs real auth
const USE_MOCK_AUTH = true;

class AuthService {
  /**
   * Sign up with email and password
   */
  async signUpWithEmail(credentials: SignupCredentials): Promise<AuthUser> {
    if (USE_MOCK_AUTH) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        uid: `mock-user-${Date.now()}`,
        email: credentials.email,
        phoneNumber: null,
        displayName: credentials.displayName || 'Mock User',
        photoURL: null,
        emailVerified: true,
        phoneVerified: false,
        provider: 'email',
        // IMPORTANT: Use ISO string, not Date object, for Redux serialization
        createdAt: new Date().toISOString(),
      };
    }

    // TODO: Implement real auth here (Firebase, Supabase, etc.)
    throw new Error('Real auth not implemented. Set USE_MOCK_AUTH=true for testing.');
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(credentials: LoginCredentials): Promise<AuthUser> {
    if (USE_MOCK_AUTH) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        uid: 'mock-user-id',
        email: credentials.email,
        phoneNumber: null,
        displayName: 'Mock User',
        photoURL: null,
        emailVerified: true,
        phoneVerified: false,
        provider: 'email',
        createdAt: new Date().toISOString(),
      };
    }

    throw new Error('Real auth not implemented. Set USE_MOCK_AUTH=true for testing.');
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    if (USE_MOCK_AUTH) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }

    throw new Error('Real auth not implemented.');
  }

  /**
   * Get current auth state listener
   * Returns unsubscribe function
   */
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    if (USE_MOCK_AUTH) {
      // For mock auth, just call with null initially
      // Real auth would listen to auth state changes
      callback(null);
      return () => {};
    }

    return () => {};
  }
}

export default new AuthService();
