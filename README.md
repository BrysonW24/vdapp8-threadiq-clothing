<p align="center">
  <img src="assets/icon.png" width="120" alt="ThreadIQ Logo">
</p>

<h1 align="center">ThreadIQ</h1>

<p align="center">
  <strong>Smart Fashion. Effortless Style.</strong><br>
  <sub>AI-powered wardrobe management that ends "I have nothing to wear."</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue?style=flat-square" alt="Platform">
  <img src="https://img.shields.io/badge/Expo-SDK%2054-black?style=flat-square&logo=expo" alt="Expo SDK">
  <img src="https://img.shields.io/badge/React%20Native-0.76-61dafb?style=flat-square&logo=react" alt="React Native">
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178c6?style=flat-square&logo=typescript" alt="TypeScript">
</p>

---

## The Problem

Most people only wear 20% of their wardrobe regularly. The rest sits there, forgotten.

**ThreadIQ** catalogs your clothes, suggests outfit combinations, and helps you rediscover pieces you already own - so you stop buying duplicates and start wearing everything.

---

## What You Get

| Feature | Description |
|---------|-------------|
| **Digital Wardrobe** | Photograph and categorize all your clothing |
| **Outfit Builder** | Drag-and-drop interface to create looks |
| **AI Suggestions** | Smart recommendations for weather and occasion |
| **Wear Analytics** | See what you wear most (and what you don't) |
| **Calendar Planning** | Schedule outfits for upcoming events |
| **Smart Shopping** | Discover pieces that complement your wardrobe |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Run on simulators
npm run ios
npm run android
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Expo SDK 54** | React Native framework |
| **TypeScript** | Type safety |
| **Redux Toolkit** | State management |
| **TensorFlow.js** | On-device ML inference |
| **Expo Image Picker** | Camera & gallery access |

---

## Technical Approach

- **On-Device ML** - Privacy-first with TensorFlow.js
- **Background Removal** - Clean product-style photos
- **Color Analysis** - Extract dominant colors for outfit matching
- **Light Theme** - Fashion-forward design with purple (#8B5CF6) accents

---

## Project Structure

```
src/
├── components/     # Clothing cards, outfit grids
├── screens/        # Wardrobe, Builder, Suggestions
├── services/       # Image processing, ML inference
├── store/          # Redux state for wardrobe
├── theme/          # Light theme with purple
└── utils/          # Image helpers, color extraction
```

---

## App Info

| Key | Value |
|-----|-------|
| **Slug** | `threadiq` |
| **iOS Bundle** | `com.vivacity.threadiq` |
| **Android Package** | `com.vivacity.threadiq` |

---

## Future Enhancements

- Social sharing of outfit inspiration
- Barcode scanning for automatic item details
- Integration with fashion retailers
- Virtual try-on with AR

---

<p align="center">
  <strong>Built by Vivacity Digital</strong><br>
  <a href="https://vivacitydigital.com.au">vivacitydigital.com.au</a>
</p>

<p align="center">
  <sub>2025 Vivacity Digital. All rights reserved.</sub>
</p>
