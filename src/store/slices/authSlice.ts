/**
 * Auth Slice - iOS Simulator Ready
 *
 * Redux state management for authentication.
 *
 * KEY LEARNINGS:
 * - Set onboardingComplete=true on social sign-in for simulator testing
 * - This bypasses onboarding flows so you can test the main app UI
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AuthService from '../../services/auth/AuthService';
import SocialAuthService from '../../services/auth/SocialAuthService';
import {
  AuthState,
  AuthUser,
  SignupCredentials,
  LoginCredentials,
} from '../../types/auth.types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  onboardingComplete: false,
};

// Async thunks
export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async (credentials: SignupCredentials, { rejectWithValue }) => {
    try {
      const user = await AuthService.signUpWithEmail(credentials);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const user = await AuthService.signInWithEmail(credentials);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithApple = createAsyncThunk(
  'auth/signInWithApple',
  async (_, { rejectWithValue }) => {
    try {
      const result = await SocialAuthService.signInWithApple();
      return result.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const result = await SocialAuthService.signInWithGoogle();
      return result.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithFacebook = createAsyncThunk(
  'auth/signInWithFacebook',
  async (_, { rejectWithValue }) => {
    try {
      const result = await SocialAuthService.signInWithFacebook();
      return result.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    await AuthService.signOut();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
      state.onboardingComplete = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Sign up with email
    builder
      .addCase(signUpWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        // For simulator testing, skip onboarding
        state.onboardingComplete = true;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign in with email
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.onboardingComplete = true;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Social sign-in helper
    const handleSocialSignIn = (builder: any, action: any) => {
      builder
        .addCase(action.pending, (state: AuthState) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(action.fulfilled, (state: AuthState, actionResult: PayloadAction<AuthUser>) => {
          state.isLoading = false;
          state.user = actionResult.payload;
          state.isAuthenticated = true;
          // KEY: Skip onboarding for simulator testing
          state.onboardingComplete = true;
        })
        .addCase(action.rejected, (state: AuthState, actionResult: any) => {
          state.isLoading = false;
          state.error = actionResult.payload as string;
        });
    };

    handleSocialSignIn(builder, signInWithApple);
    handleSocialSignIn(builder, signInWithGoogle);
    handleSocialSignIn(builder, signInWithFacebook);

    // Sign out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.onboardingComplete = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUser,
  setOnboardingComplete,
  clearError,
  setError,
} = authSlice.actions;

export default authSlice.reducer;
