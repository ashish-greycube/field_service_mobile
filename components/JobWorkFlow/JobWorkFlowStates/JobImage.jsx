import { useJob } from '@/context/JobContext';
import * as ImagePicker from 'expo-image-picker';
import { FrappeContext } from 'frappe-react-sdk';
import React, { useContext, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View as RNView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Colors, Text, View } from 'react-native-ui-lib';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const JobImage = ({ onComplete }) => {
  const { jobId } = useJob();
  const { file, db } = useContext(FrappeContext);
  const insets = useSafeAreaInsets();

  const [visible, setVisible]   = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const openCamera = async () => {
    const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      if (!canAskAgain) {
        Alert.alert(
          'Camera Permission Required',
          'Camera access was denied. Please enable it in your device Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!imageUri) return;

    setLoading(true);
    setError(null);

    try {
      const result = await file.uploadFile(
        { uri: imageUri, type: 'image/jpeg', name: `proof_photo_${jobId}_${Date.now()}.jpg` },
        { doctype: 'Job Order', docname: jobId, isPrivate: false, folder: 'Home' },
        (completed, total) => console.log(`upload: ${Math.round((completed / total) * 100)}%`)
      );
      const fileUrl = result?.data?.message?.file_url;
      if (fileUrl) {
        await db.updateDoc('Job Order', jobId, { proof_photo: fileUrl });
      }
      setVisible(false);
      onComplete({ photo: imageUri });
    } catch (e) {
      setError(e?.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setImageUri(null);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Button style={styles.openBtn} onPress={() => setVisible(true)}>
        <Text style={styles.openBtnText}>Add Photo</Text>
      </Button>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <RNView style={styles.overlay}>
          <View style={[styles.sheet, { height: SCREEN_HEIGHT * 0.6, paddingBottom: insets.bottom + 16 }]}>

            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Proof Photo</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Preview */}
            <View style={styles.previewArea}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderIcon}>📷</Text>
                  <Text style={styles.placeholderText}>No photo taken yet</Text>
                </View>
              )}
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <Button style={styles.btnCamera} onPress={openCamera} disabled={loading}>
                <Text style={styles.btnCameraText}>
                  {imageUri ? 'Retake' : 'Take Photo'}
                </Text>
              </Button>
              <Button
                style={styles.btnSubmit}
                onPress={handleSubmit}
                disabled={loading || !imageUri}
              >
                <Text style={styles.btnSubmitText}>
                  {loading ? 'Uploading…' : 'Submit'}
                </Text>
              </Button>
            </View>

          </View>
        </RNView>
      </Modal>
    </View>
  );
};

export default JobImage;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  openBtn: {
    backgroundColor: Colors.violet30,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  openBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.grey10,
  },
  closeBtn: {
    fontSize: 18,
    color: Colors.grey30,
    fontWeight: '600',
    padding: 4,
  },
  previewArea: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Colors.grey70,
    marginBottom: 16,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderIcon: {
    fontSize: 40,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.grey40,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: Colors.red30,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btnCamera: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.violet30,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btnCameraText: {
    color: Colors.violet30,
    fontWeight: '600',
    fontSize: 14,
  },
  btnSubmit: {
    flex: 1,
    backgroundColor: Colors.violet30,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnSubmitText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
