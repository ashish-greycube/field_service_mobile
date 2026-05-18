import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/constants";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

async function fetchUserImage(token, email) {
  try {
    const res = await fetch(
      `${BASE_URL}api/resource/User/${encodeURIComponent(email)}`,
      { headers: { Authorization: `token ${token}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const img = data?.data?.user_image;
    if (!img) return null;
    return img.startsWith("http") ? img : `${BASE_URL}${img.replace(/^\//, "")}`;
  } catch {
    return null;
  }
}

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
          const cached = stored ? JSON.parse(stored) : null;
          if (cached) setUserInfo(cached);
          // Refresh user image from Frappe in the background
          if (cached?.email) {
            fetchUserImage(token, cached.email).then((freshImage) => {
              if (freshImage && freshImage !== cached.user_image) {
                const updated = { ...cached, user_image: freshImage };
                setUserInfo(updated);
                storage.setItem(USER_INFO_KEY, JSON.stringify(updated));
              }
            });
          }
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
      const user_image = info.email ? await fetchUserImage(token, info.email) : null;
      const fullInfo = { ...info, ...(user_image ? { user_image } : {}) };
      setUserInfo(fullInfo);
      await storage.setItem(USER_INFO_KEY, JSON.stringify(fullInfo));
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
