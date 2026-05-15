import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const storage = createAsyncStorage("appDB");

const FRAPPE_TOKEN_KEY = "frappe_token";
const USER_INFO_KEY = "user_info";

export const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  frappeToken: null,
  userInfo: null,
  loginSuccess: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [frappeToken, setFrappeToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Restore session on app start
  useEffect(() => {
    const restore = async () => {
      try {
        const token = await SecureStore.getItemAsync(FRAPPE_TOKEN_KEY);
        if (token) {
          setFrappeToken(token);
          setIsAuthenticated(true);
          const stored = await storage.getItem(USER_INFO_KEY);
          if (stored) setUserInfo(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to restore session:", e);
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const loginSuccess = useCallback(async (token, info) => {
    await SecureStore.deleteItemAsync(FRAPPE_TOKEN_KEY);
    await SecureStore.setItemAsync(FRAPPE_TOKEN_KEY, token);
    setFrappeToken(token);

    if (info) {
      setUserInfo(info);
      await storage.setItem(USER_INFO_KEY, JSON.stringify(info));
    }
    setIsAuthenticated(true);
    router.replace("/(screens)/MainScreen");
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(FRAPPE_TOKEN_KEY);
    await storage.removeItem(USER_INFO_KEY);
    setFrappeToken(null);
    setUserInfo(null);
    setIsAuthenticated(false);
    router.replace("/Login");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        frappeToken,
        userInfo,
        loginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
