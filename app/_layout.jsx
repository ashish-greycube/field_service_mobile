import { AuthProvider } from "@/context/AuthContext";
import { FrappeProvider } from "@/services/backend";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "react-native-ui-lib";

export default function RootView() {
  return (
      <AuthProvider>
        <FrappeProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white}}>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </FrappeProvider>
      </AuthProvider>
  );
}
