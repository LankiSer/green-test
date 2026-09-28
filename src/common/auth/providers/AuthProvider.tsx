import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  CREDENTIALS_STORAGE_KEY,
  type GreenApiCredentials,
} from '@/common/auth/entities/credentials';

interface AuthContextValue {
  credentials: GreenApiCredentials | null;
  login: (credentials: GreenApiCredentials) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStored(): GreenApiCredentials | null {
  try {
    const raw = sessionStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GreenApiCredentials;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<GreenApiCredentials | null>(readStored);

  const login = useCallback((next: GreenApiCredentials) => {
    sessionStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(next));
    setCredentials(next);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(CREDENTIALS_STORAGE_KEY);
    setCredentials(null);
  }, []);

  const value = useMemo(
    () => ({
      credentials,
      login,
      logout,
      isAuthenticated: credentials !== null,
    }),
    [credentials, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
