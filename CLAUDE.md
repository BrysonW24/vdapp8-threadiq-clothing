# vdapp8 — ThreadIQ Clothing

Smart wardrobe / clothing fashion app with 3D visualization.

## Stack
- **Framework**: Expo 54, React Native 0.81, React 19
- **3D**: @react-three/fiber + Three.js (3D garment rendering)
- **State**: Redux Toolkit + redux-persist
- **Navigation**: React Navigation (bottom tabs)
- **Storage**: AsyncStorage

## Unique Patterns
- **React Native / Expo** — NOT a web app, mobile-first
- **Three.js in mobile** — 3D rendering for clothing visualization
- **Redux** instead of Zustand (differs from standard VD pattern)

## Dev
```bash
npm install && npx expo start
```
