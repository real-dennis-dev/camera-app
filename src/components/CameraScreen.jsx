// src/components/CameraScreen.jsx
import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { CameraView, CameraType, FlashMode } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useAppPermissions } from "../hooks/usePermissions";

export default function CameraScreen() {
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [zoom, setZoom] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);
  const { cameraPermission, mediaPermission, requestAllPermissions } =
    useAppPermissions();

  // If permissions are not yet loaded, show nothing
  if (!cameraPermission || !mediaPermission) {
    return <View style={styles.container} />;
  }

  // If permissions are not granted, show a button to request them
  if (!cameraPermission.granted || !mediaPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to access the camera and save photos.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestAllPermissions}>
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => {
      switch (current) {
        case "off":
          return "on";
        case "on":
          return "auto";
        default:
          return "off";
      }
    });
  };

  const handleZoom = (direction) => {
    setZoom((currentZoom) => {
      const newZoom =
        direction === "in"
          ? Math.min(currentZoom + 0.1, 1)
          : Math.max(currentZoom - 0.1, 0);
      return Number(newZoom.toFixed(1));
    });
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      Alert.alert("Success", "Photo saved to gallery!");
    } catch (error) {
      console.error("Failed to take picture:", error);
      Alert.alert("Error", "Failed to capture or save photo.");
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;
    setIsRecording(true);
    try {
      const video = await cameraRef.current.recordAsync();
      await MediaLibrary.saveToLibraryAsync(video.uri);
      Alert.alert("Success", "Video saved to gallery!");
    } catch (error) {
      console.error("Recording failed:", error);
      Alert.alert("Error", "Recording failed.");
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        zoom={zoom}
        barcodeScannerEnabled={true}
        onBarcodeScanned={(data) => {
          if (data) {
            Alert.alert("Barcode Scanned", `Data: ${data.data}`);
          }
        }}
      >
        <View style={styles.controlsContainer}>
          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.buttonText}>🔄 Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleFlash}
            >
              <Text style={styles.buttonText}>💡 {flash}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setZoom(0)}
            >
              <Text style={styles.buttonText}>🔍 Reset Zoom</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.zoomButton}
              onPress={() => handleZoom("out")}
            >
              <Text style={styles.buttonText}>➖</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.captureButton,
                isRecording && styles.recordingButton,
              ]}
              onPress={takePicture}
              onLongPress={startRecording}
              onPressOut={stopRecording}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.zoomButton}
              onPress={() => handleZoom("in")}
            >
              <Text style={styles.buttonText}>➕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  camera: { flex: 1 },
  controlsContainer: { flex: 1, justifyContent: "space-between", padding: 20 },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 30,
  },
  controlButton: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 5,
  },
  zoomButton: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 40,
  },
  buttonText: { color: "white", fontSize: 16 },
  message: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "white",
  },
  recordingButton: {
    backgroundColor: "red",
    borderColor: "red",
  },
});
