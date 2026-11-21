import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  apiSignUp, apiSignIn, apiGetCurrentUser, apiResendVerification,
  setAuthToken, clearAuthToken, getAuthToken,
} from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // On mount, try to restore session from stored token
  useEffect(() => {
    const stored = localStorage.getItem('foodloop_token');
    if (stored) {
      setAuthToken(stored);
      apiGetCurrentUser()
        .then(u => { setUser(u); })
        .catch(() => { clearAuthToken(); localStorage.removeItem('foodloop_token'); })
        .finally(() => setInitializing(false));
    } else {
      setInitializing(false);
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await apiSignIn({ email, password });
      if (data.success && data.token) {
        setAuthToken(data.token);
        localStorage.setItem('foodloop_token', data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Sign in failed.' };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async ({ name, email, password, role }) => {
    setIsLoading(true);
    try {
      const data = await apiSignUp({ name, email, password, role });
      if (data.success) {
        // User created but not verified — set local state to show verification step
        setUser(data.user);
        setVerificationPending(true);
        return { success: true };
      }
      return { success: false, error: data.error || 'Sign up failed.' };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    try {
      await apiResendVerification(email);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setVerificationPending(false);
    clearAuthToken();
    localStorage.removeItem('foodloop_token');
  }, []);

  // Keep simulateVerification as a no-op for backward compat with components
  const simulateVerification = useCallback(() => {
    if (user) {
      setUser(prev => ({ ...prev, verified: true }));
      setVerificationPending(false);
    }
  }, [user]);

  const value = {
    user,
    isLoading,
    initializing,
    isAuthenticated: !!user,
    verificationPending,
    signIn,
    signUp,
    signOut,
    simulateVerification,
    resendVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
