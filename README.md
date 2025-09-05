# TaskFlow

A modern React Native + TypeScript cross-platform application with offline-first data storage using Realm.

**Created by:** Roshan  
**Application ID:** com.roshan.taskflow  
**Platform:** Mobile (iOS/Android/Web)

## Features

- ✅ Add, edit, delete todos
- ✅ Real-time UI updates
- ✅ Offline-first with Realm database
- ✅ Clean, modern UI design
- ✅ TypeScript for type safety

## Tech Stack

- React Native 0.72.6
- TypeScript
- Realm Database
- React Hooks

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install iOS dependencies (macOS only):
```bash
cd ios && pod install
```

3. Run the app:
```bash
# Android
npm run android

# iOS
npm run ios
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── models/         # Realm database schemas
├── database/       # Database configuration
├── hooks/          # Custom React hooks
└── utils/          # Utility functions
```

## Database

Uses Realm for offline-first data storage with real-time synchronization. All data persists locally without requiring internet connection.