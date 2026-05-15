import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from 'react-native-ui-lib';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace("/(screens)/MainScreen");
    } else {
      router.replace("/Login");
    }
  }, [isAuthenticated, isLoading]);

  return <View/>;
}
