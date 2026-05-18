import { AuthProvider } from "@/context/AuthContext";
import { FrappeProvider } from "@/services/backend";
import * as ImagePicker from 'expo-image-picker';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "react-native-ui-lib";

function PermissionRequester() {
  useEffect(() => {
    ImagePicker.requestCameraPermissionsAsync();
  }, []);
  return null;
}

export default function RootView() {
  return (
      <AuthProvider>
        <FrappeProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white}}>
            <StatusBar style="dark" />
            <PermissionRequester />
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </FrappeProvider>
      </AuthProvider>
  );
}
