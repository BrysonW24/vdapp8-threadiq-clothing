/**
 * Social Auth Service - iOS Simulator Ready
 *
 * Mock social authentication for iOS Simulator testing.
 * Replace with real OAuth implementations for production.
 */

import { AuthUser, SocialAuthResult, AuthProvider } from '../../types/auth.types';

const USE_MOCK_AUTH = true;

class SocialAuthService {
  /**
   * Sign in with Apple
   */
  async signInWithApple(): Promise<SocialAuthResult> {
    if (USE_MOCK_AUTH) {
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        provider: 'apple',
        user: {
          uid: 'mock-apple-id',
          email: 'mock@apple.com',
          phoneNumber: null,
          displayName: 'Mock Apple User',
          photoURL: null,
          emailVerified: true,
          phoneVerified: false,
          provider: 'apple',
          createdAt: new Date().toISOString(),
        },
        isNewUser: false,
      };
    }

    throw new Error('Real Apple auth not implemented.');
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<SocialAuthResult> {
    if (USE_MOCK_AUTH) {
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        provider: 'google',
        user: {
          uid: 'mock-google-id',
          email: 'mock@google.com',
          phoneNumber: null,
          displayName: 'Mock Google User',
          photoURL: null,
          emailVerified: true,
          phoneVerified: false,
          provider: 'google',
          createdAt: new Date().toISOString(),
        },
        isNewUser: false,
      };
    }

    throw new Error('Real Google auth not implemented.');
  }

  /**
   * Sign in with Facebook
   */
  async signInWithFacebook(): Promise<SocialAuthResult> {
    if (USE_MOCK_AUTH) {
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        provider: 'facebook',
        user: {
          uid: 'mock-facebook-id',
          email: 'mock@facebook.com',
          phoneNumber: null,
          displayName: 'Mock Facebook User',
          photoURL: null,
          emailVerified: true,
          phoneVerified: false,
          provider: 'facebook',
          createdAt: new Date().toISOString(),
        },
        isNewUser: false,
      };
    }

    throw new Error('Real Facebook auth not implemented.');
  }
}

export default new SocialAuthService();
