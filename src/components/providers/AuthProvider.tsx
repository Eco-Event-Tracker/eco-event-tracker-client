import { useMemo, useState, type PropsWithChildren } from 'react';
import { login, signup } from '../../api/auth';
import { AuthContext } from '../../context/authContext';
import type { AuthSession } from '../../types/auth';
import { clearAuthSession, getAuthSession, saveAuthSession } from '../../utils/authSession';

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
