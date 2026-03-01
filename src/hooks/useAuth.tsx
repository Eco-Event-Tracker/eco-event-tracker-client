import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { login, signup } from '../api/auth';
import type { AuthSession } from '../types/auth';
import { clearAuthSession, getAuthSession, saveAuthSession } from '../utils/authSession';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  loginWithPassword: (email: string, password: string) => Promise<AuthSession>;
  signupWithPassword: (name: string, email: string, password: string) => Promise<AuthSession>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession());

  const loginWithPassword = async (email: string, password: string): Promise<AuthSession> => {
    const nextSession = await login({ email, password });
    saveAuthSession(nextSession);
    setSession(nextSession);
    return nextSession;
  };

  const signupWithPassword = async (name: string, email: string, password: string): Promise<AuthSession> => {
    const nextSession = await signup({ name, email, password });
    saveAuthSession(nextSession);
    setSession(nextSession);
    return nextSession;
  };

  const logout = () => {
    clearAuthSession();
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session?.user?.id),
      loginWithPassword,
      signupWithPassword,
      logout
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
