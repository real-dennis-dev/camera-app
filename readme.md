````markdown
# My Camera App

A feature-rich, production-ready camera application built with **Expo** (React Native). It includes photo & video capture, zoom, flash, camera flip, barcode scanning, media gallery access, and robust permission handling.

![Camera Preview](https://via.placeholder.com/800x600/000/fff?text=Camera+Preview) <!-- Replace with actual screenshots -->

## ✨ Features

- **High-quality Camera Preview** using `expo-camera`
- **Photo Capture** with instant save to gallery
- **Video Recording** (tap and hold to record)
- **Camera Flip** (front/back)
- **Flash Control** (Off / On / Auto)
- **Pinch-to-Zoom** simulation with on-screen controls
- **Barcode/QR Code Scanning** with alert on detection
- **Media Gallery** – Browse photos saved by the app
- **Smart Permission Handling** – Respects OS "remembered" choices and guides users to Settings when needed
- **Bottom Tab Navigation** (Camera + Gallery)

## 📱 Permission Philosophy

Modern mobile OSes (Android 6.0+ / iOS) **remember** the user's permission decision. This app follows best practices:

- Uses `useCameraPermissions()` and `MediaLibrary.usePermissions()`
- Only prompts when status is `'undetermined'`
- Shows helpful alerts and directs users to system Settings when permissions are permanently denied
- Never spams the user with repeated permission requests

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/my-camera-app.git
cd my-camera-app
```
````

### 2. Install dependencies

```bash
npx expo install
# or
npm install
```

**Core packages used:**

```bash
npx expo install expo-camera expo-media-library
npx expo install @react-navigation/native @react-navigation/bottom-tabs
```

### 3. Configure `app.json`

Make sure your `app.json` (or `app.config.js`) includes the proper plugins and permissions (see the full configuration in the codebase).

Key sections:

- `expo-media-library` plugin with custom permission messages
- iOS `NSCameraUsageDescription`
- Android CAMERA and RECORD_AUDIO permissions

### 4. Run the app

```bash
npx expo start
```

Scan the QR code with Expo Go on your physical device (recommended for camera testing).

## 📁 Project Structure

```
my-camera-app/
├── App.jsx                    # Main entry + Navigation
├── app.json                   # Expo config & permissions
├── src/
│   ├── components/
│   │   ├── CameraScreen.jsx   # Main camera UI + controls
│   │   └── GalleryScreen.jsx  # Media library viewer
│   ├── hooks/
│   │   └── usePermissions.jsx # Centralized permission logic
│   └── utils/                 # (Optional) media utilities
```

## 📋 How Permissions Work

The custom `useAppPermissions` hook intelligently handles:

- Already granted permissions → proceed immediately
- Can ask again → show native prompt
- Permanently denied → alert with "Open Settings" button

This prevents the common frustration of repeated permission dialogs.

## 🎛️ Camera Controls

| Action       | How to Use                    |
| ------------ | ----------------------------- |
| Take Photo   | Tap the big white button      |
| Record Video | Long press the capture button |
| Flip Camera  | Top-left "Flip" button        |
| Toggle Flash | Top "💡" button               |
| Zoom In/Out  | +/- buttons                   |
| Reset Zoom   | "Reset Zoom" button           |

## 🖼️ Gallery

The Gallery tab automatically loads the latest 50 photos from your media library (sorted by creation time) once permission is granted.

## Technologies Used

- **Expo** (SDK)
- `expo-camera`
- `expo-media-library`
- React Native
- React Navigation (Bottom Tabs)

## Notes & Limitations

- Portrait Mode (bokeh) is not natively supported by `expo-camera`. Advanced effects would require custom native modules or third-party SDKs.
- Video recording stops on button release.
- Barcode scanning works on both front and back cameras.

## Future Enhancements

- Timer for photos
- Video duration limit
- Gallery video playback
- Sharing options
- Filters / post-processing

---

**Made with ❤️ using Expo**

Feel free to star the project if you found it useful!
