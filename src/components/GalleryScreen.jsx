// src/components/GalleryScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useAppPermissions } from "../hooks/usePermissions";

export default function GalleryScreen() {
  const [photos, setPhotos] = useState([]);
  const { mediaPermission, requestAllPermissions } = useAppPermissions();

  useEffect(() => {
    if (mediaPermission && mediaPermission.granted) {
      loadPhotos();
    }
  }, [mediaPermission]);

  const loadPhotos = async () => {
    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        first: 50,
        sortBy: ["creationTime"],
      });
      setPhotos(media.assets);
    } catch (error) {
      console.error("Error loading photos:", error);
    }
  };

  if (!mediaPermission || !mediaPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need permission to view your media library.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestAllPermissions}>
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.photoContainer}>
            <Image source={{ uri: item.uri }} style={styles.photo} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, backgroundColor: "#fff" },
  photoContainer: { flex: 1 / 3, aspectRatio: 1, padding: 1 },
  photo: { flex: 1, width: "100%", height: "100%" },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  buttonText: { color: "white", fontSize: 16, textAlign: "center" },
});
