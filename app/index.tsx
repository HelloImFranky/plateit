import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function Index() {
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!showCamera) {
    return (
      <View style={styles.container}>
        <Button title="Open Camera" onPress={() => setShowCamera(true)} />
      </View>
    );
  }

  if (!permission || !mediaPermission) {
    // Permissions are still loading.
    return <View />;
  }

  if (!permission.granted || !mediaPermission.granted) {
    // Camera or media permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera and save photos</Text>
        {!permission.granted && (
          <Button onPress={requestPermission} title="Grant Camera Permission" />
        )}
        {!mediaPermission.granted && (
          <Button onPress={requestMediaPermission} title="Grant Media Permission" />
        )}
        <Button onPress={() => setShowCamera(false)} title="Back" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePhoto() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        await MediaLibrary.createAssetAsync(photo.uri);
        Alert.alert('Photo Captured', `Photo saved to gallery!`);
      } catch (e) {
        Alert.alert('Error', 'Failed to take or save photo');
      }
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        key={facing + showCamera}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleCameraFacing}
            accessibilityLabel="Flip Camera"
          >
            <Text style={styles.iconText}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shutterButton}
            onPress={takePhoto}
            accessibilityLabel="Take Photo"
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowCamera(false)}
            accessibilityLabel="Close Camera"
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e0f7fa', // light sky blue background
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#0288d1',
    fontSize: 18,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 8,
    elevation: 10,
    shadowColor: '#0288d1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    gap: 20, // Add this line if supported
  },
  skyButton: {
    backgroundColor: '#4fc3f7',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0288d1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#81d4fa',
    transform: [{ scale: 1 }],
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: '#0288d1',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  iconButton: {
  backgroundColor: 'rgba(79, 195, 247, 0.15)',
  padding: 14,
  borderRadius: 50,
  alignItems: 'center',
  justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
    color: '#0288d1',
  },
  shutterButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#4fc3f7',
    borderWidth: 4,
    borderColor: '#0288d1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#0288d1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  closeButton: {
    backgroundColor: 'rgba(79, 195, 247, 0.12)',
    padding: 14,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 28,
    color: '#0288d1',
  },
});