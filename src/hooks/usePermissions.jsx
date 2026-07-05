// src/hooks/usePermissions.jsx
import { useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Alert, Linking } from "react-native";

export const useAppPermissions = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const requestAllPermissions = async () => {
    let cameraGranted = false;
    let mediaGranted = false;

    // Handle Camera Permission
    if (cameraPermission.granted) {
      cameraGranted = true;
    } else if (cameraPermission.canAskAgain) {
      // If we can ask again, request it
      const result = await requestCameraPermission();
      cameraGranted = result.granted;
    } else {
      // User selected "Never ask again" or "Deny" permanently.
      Alert.alert(
        "Camera Access Required",
        "Camera access has been blocked. Please enable it in your system settings to use this feature.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return { cameraGranted: false, mediaGranted };
    }

    // Handle Media Library Permission
    if (mediaPermission.granted) {
      mediaGranted = true;
    } else if (mediaPermission.canAskAgain) {
      const result = await requestMediaPermission();
      mediaGranted = result.granted;
    } else {
      Alert.alert(
        "Storage Access Required",
        "Storage access is needed to save photos and videos.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return { cameraGranted, mediaGranted: false };
    }

    return { cameraGranted, mediaGranted };
  };

  return {
    cameraPermission,
    mediaPermission,
    requestAllPermissions,
  };
};
