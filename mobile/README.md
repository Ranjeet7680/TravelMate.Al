# TravelMate AI – Mobile App (React Native & Expo)
### Team Innovation 27X7 – AI Agents & Intelligent Systems

**Vision**: A mobile travel experience combining modern booking apps with an autonomous AI travel copilot.

---

## 🎨 Visual Identity & Design System

- **Primary Color**: Deep Navy `#101B35`
- **Accent Color**: Electric Blue `#3478F6`
- **Secondary Color**: Travel Teal `#19B9A5`
- **AI Purple**: `#7956F5`
- **Background**: `#F5F7FB`
- **Cards**: Pure White `#FFFFFF`, rounded 20px with soft shadow
- **Buttons**: Rounded 14px, gradient action buttons
- **Navigation**: Bottom tab bar (`Home`, `Explore`, `Copilot`, `Packages`, `My Trips`)
- **Animations**:
  - Button press scale: `0.97` (120ms)
  - Card entrance: `translateY` (350ms)
  - Bottom nav icon scale: `1.15` (180ms)
  - Favourite heart pop: `300ms` bounce
  - Booking success checkmark & confetti

---

## 📱 Mobile Screen Flow

1. **Splash Screen (`/`)**: Animated globe, airplane path, TravelMate AI branding.
2. **Home Dashboard (`/(tabs)/index.tsx`)**: Greeting, location, search, AI Copilot hero banner, quick services (packages, cabs, self-drive, bikes, flights, hotels), and curated packages carousel.
3. **Explore Destinations (`/(tabs)/explore.tsx`)**: India Local & Domestic (Jharkhand, Bihar, Bengal, etc.) vs International discovery, category filters, interactive heart toggles.
4. **AI Travel Copilot (`/(tabs)/copilot.tsx`)**: Autonomous 13-agent chat, English & Hindi toggle, voice input waveform, streaming responses.
5. **Holiday Packages & Mobility (`/(tabs)/packages.tsx`)**: Domestic & international tour packages, outstation cabs (Sedan/SUV), self-drive cars, and bike rentals (Royal Enfield / Activa).
6. **My Trips & Boarding Pass (`/(tabs)/trips.tsx`)**: Active Dubai 10-day itinerary, digital QR boarding pass modal, budget allocation meter.

---

## 🚀 Running the Mobile App

```bash
cd mobile
npm install
npm run start
```

- Press `i` to launch in iOS Simulator
- Press `a` to launch in Android Emulator
- Scan QR code with the **Expo Go** app on your physical iPhone or Android phone
