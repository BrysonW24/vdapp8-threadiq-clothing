<p align="center">
  <img src="assets/icon.png" width="100" alt="ThreadIQ Logo">
</p>

<h1 align="center">ThreadIQ</h1>

<p align="center">
  <strong>Smart Fashion. Effortless Style.</strong><br>
  <sub>AI-powered wardrobe management that ends "I have nothing to wear."</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue?style=flat-square" alt="Platform">
  <img src="https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat-square&logo=expo" alt="Expo">
  <img src="https://img.shields.io/badge/React%20Native-0.76-61dafb?style=flat-square&logo=react" alt="React Native">
  <img src="https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat-square&logo=tensorflow&logoColor=white" alt="TensorFlow.js">
</p>

<p align="center">
  <a href="https://vivacitydigital.com.au">vivacitydigital.com.au</a>
</p>

---

### The Idea

Most people only wear 20% of their wardrobe regularly. The rest sits there, forgotten. ThreadIQ catalogs your clothes, suggests outfit combinations, and helps you rediscover pieces you already own — so you stop buying duplicates and start wearing everything.

---

### What It Does

| | |
|---|---|
| **Digital Wardrobe** | Photograph and categorize all your clothing |
| **Outfit Builder** | Drag-and-drop interface to create looks |
| **AI Suggestions** | Smart recommendations for weather and occasion |
| **Wear Analytics** | See what you wear most — and what you don't |
| **Calendar Planning** | Schedule outfits for upcoming events |
| **Smart Shopping** | Discover pieces that complement your wardrobe |

---

### Technical Approach

- **On-Device ML** — privacy-first with TensorFlow.js, no photos leave your phone
- **Background Removal** — clean product-style photos automatically
- **Color Analysis** — extract dominant colors for outfit matching

---

### Tech Stack

| | |
|---|---|
| Expo SDK 54 | React Native framework |
| TypeScript 5.3 | Type safety |
| Redux Toolkit | State management |
| TensorFlow.js | On-device ML inference |
| Expo Image Picker | Camera & gallery access |

---

### Architecture

```
src/
├── components/     # Clothing cards, outfit grids
├── screens/        # Wardrobe, Builder, Suggestions
├── services/       # Image processing, ML inference
├── store/          # Redux state for wardrobe
├── theme/          # Light theme with purple (#8B5CF6)
└── utils/          # Image helpers, color extraction
```

---

### Quick Start

```bash
npm install && npx expo start
```

| Key | Value |
|-----|-------|
| **iOS Bundle** | `com.vivacity.threadiq` |
| **Android Package** | `com.vivacity.threadiq` |

---

### On the Roadmap

- [ ] Social sharing of outfit inspiration
- [ ] Barcode scanning for automatic item details
- [ ] Fashion retailer integrations
- [ ] Virtual try-on with AR

---

<p align="center">
  <sub>Part of the <strong>Vivacity Digital</strong> app portfolio — <code>vdapp8</code></sub><br>
  <sub>Built by <a href="https://github.com/BrysonW24">Bryson Walter</a> · <a href="https://vivacitydigital.com.au">vivacitydigital.com.au</a></sub>
</p>
