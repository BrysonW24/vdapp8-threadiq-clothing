# React Native Base

> **The standard Vivacity Digital React Native boilerplate**

A production-ready React Native boilerplate **pre-configured for seamless iOS Simulator development**. Built with all the fixes and learnings from real-world app development.

## What Makes This Different

This is the **iOS Simulator-ready** variant of the react-native-base boilerplate with these key improvements:

| Feature | react-native-base | ios-simulator-ready |
|---------|------------------|---------------------|
| Expo SDK | 50.0 | **54.0** |
| React Native | 0.73 | **0.81.5** |
| Node Requirement | Any | **20+** (required) |
| Mock Auth | Manual setup | **Pre-configured** |
| Maps | Google (needs API key) | **Apple Maps** (no key!) |
| Onboarding Skip | Manual | **Automatic** |
| Date Serialization | Potential issues | **Fixed (ISO strings)** |

## Requirements

- **Node.js 20+** (REQUIRED - React Native 0.81 needs Node 20 for `toReversed()`)
- **Xcode 15+** with iOS 17+ Simulator
- **Ruby 3.0+** (for CocoaPods - NOT Ruby 4.x)
- **CocoaPods** (`gem install cocoapods`)

## Quick Start

```bash
# 1. Navigate to template
cd boilerplates/app-variants/react-native-ios-simulator-ready

# 2. Ensure Node 20+ is active
node --version  # Should be v20.x.x or higher
# If not: nvm install 20 && nvm use 20

# 3. Install dependencies
npm install

# 4. Copy environment variables
cp .env.example .env

# 5. Build iOS native project
npx expo prebuild --platform ios

# 6. Install CocoaPods
cd ios && pod install && cd ..

# 7. Start Metro bundler
npm run ios:simulator

# 8. App will launch automatically on simulator!
```

## Key Learnings (From Real App Development)

### 1. Node 20+ is REQUIRED

React Native 0.81 uses `Array.toReversed()` which was added in Node 20.

**Error you'll see without Node 20:**
```
TypeError: configs.toReversed is not a function
```

**Fix:**
```bash
nvm install 20
nvm use 20
```

### 2. Use ISO Strings for Dates (Not Date Objects)

Redux can't serialize Date objects. This causes a nasty error that doesn't break the app but prevents state updates.

**Error you'll see:**
```
A non-serializable value was detected in an action, in the path: `payload.createdAt`
```

**BAD:**
```typescript
createdAt: new Date(),  // Redux serialization error!
```

**GOOD:**
```typescript
createdAt: new Date().toISOString(),  // Works perfectly
```

### 3. Use Apple Maps (No API Key Needed!)

`PROVIDER_DEFAULT` uses Apple Maps on iOS - works without any API key!

```typescript
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';

<MapView
  provider={PROVIDER_DEFAULT}  // Apple Maps - no API key needed!
  // provider={PROVIDER_GOOGLE}  // Would require API key
/>
```

### 4. Skip Onboarding for Testing

To test the main app UI, set `onboardingComplete: true` after auth:

```typescript
// In authSlice.ts
.addCase(signInWithApple.fulfilled, (state, action) => {
  state.user = action.payload;
  state.isAuthenticated = true;
  state.onboardingComplete = true;  // Skip onboarding!
})
```

### 5. Firebase/gRPC C++20 Compatibility Issue

If using Firebase Native SDK with React Native 0.81:
- gRPC-Core 1.62.5 uses deprecated `std::result_of` (removed in C++20)
- React Native 0.81 requires C++20
- **Solution**: Remove Firebase for simulator testing, or use web SDK

## iOS Simulator Setup Guide

### First-Time Setup

1. **Install Xcode** from the App Store
2. **Open Xcode** and accept license, install components
3. **Start a simulator**:
   ```bash
   open -a Simulator
   ```

### Running the App

```bash
# Recommended: Start with cache clear
npm run ios:simulator

# Or manually:
npx expo start --ios --clear
```

### Taking Screenshots

```bash
# Save to file
xcrun simctl io booted screenshot ~/Desktop/screenshot.png

# Copy to clipboard
xcrun simctl io booted screenshot - | pbcopy
```

### Simulator Keyboard Issues

If keyboard doesn't work:
- Press **Cmd + Shift + K** to toggle
- Or: Simulator menu > **I/O > Keyboard > Connect Hardware Keyboard**

## Tech Stack

| Package | Version | Notes |
|---------|---------|-------|
| Expo | ~54.0.0 | Latest managed workflow |
| React Native | 0.81.5 | C++20 support |
| React | 18.3.1 | Latest stable |
| React Navigation | 7.x | Native stack + tabs |
| Redux Toolkit | 2.x | State management |
| React Native Paper | 5.x | Material Design 3 |
| React Native Maps | 1.10+ | Apple Maps default |

## Project Structure

```
src/
├── components/
│   ├── map/
│   │   └── MapView.tsx      # Apple Maps (PROVIDER_DEFAULT)
│   └── ...
├── services/
│   └── auth/
│       ├── AuthService.ts   # Mock auth with ISO string dates
│       └── SocialAuthService.ts
├── store/
│   └── slices/
│       └── authSlice.ts     # onboardingComplete auto-set
├── types/
│   └── auth.types.ts        # createdAt: Date | string
├── screens/
├── navigation/
└── theme/
```

## NPM Scripts

```bash
npm start           # Start Expo server
npm run ios         # Run on iOS
npm run ios:simulator  # Run with cache clear (recommended)
npm run ios:build   # Full iOS prebuild + pod install
npm run android     # Run on Android
npm run web         # Run on web
npm run lint        # Run ESLint
npm test            # Run tests
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| `toReversed is not a function` | Node < 20 | `nvm use 20` |
| Map shows blank | PROVIDER_GOOGLE without key | Use PROVIDER_DEFAULT |
| Redux serialization error | Date object in state | Use `.toISOString()` |
| App stays on login after auth | Onboarding not complete | Set `onboardingComplete: true` |
| Keyboard doesn't work | Simulator bug | Cmd+Shift+K |
| Pod install fails | Wrong Ruby version | Use Ruby 3.x, not 4.x |

## Production Checklist

Before deploying:

- [ ] Replace mock auth with real auth (Firebase, Supabase, etc.)
- [ ] Set `USE_MOCK_AUTH=false`
- [ ] Add real API endpoints
- [ ] Configure Google Maps API key (if needed)
- [ ] Set up crash reporting
- [ ] Configure push notifications
- [ ] Test on physical devices

## Extending the Boilerplate

See the original `react-native-base` README for:
- Adding new screens
- Adding Redux state
- Using the API client
- Form validation
- Component library usage

## Documentation

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

---

**Part of Vivacity Digital Boilerplates**
*Standard for iOS Simulator Testing*
