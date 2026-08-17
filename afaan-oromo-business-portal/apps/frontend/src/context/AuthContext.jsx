import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, login as loginService, logout as logoutService } from '@/services/authService';
import { setToken, clearAuth, getToken } from '@/utils/storage';
import { extractData, extractErrorMessage } from '@/utils/apiHelpers';
import { ROLE_HOME_PATHS } from '@/constants/roles';

// ─── Context ─────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while checking session
  const [authError, setAuthError] = useState(null);

  // ── Bootstrap: restore session on mount ──────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((res) => setUser(extractData(res)))
      .catch(() => { clearAuth(); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  // ── Login ─────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    setAuthError(null);
    const res   = await loginService({ email, password });
    const data  = extractData(res);
    // Backend returns { user, token } inside data
    const token = data?.token;
    const userData = data?.user ?? data;
    if (token) setToken(token);
    setUser(userData);
    return userData;
  }, []);

  // ── Logout ────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────
  const isAuthenticated = Boolean(user);
  const role            = user?.role ?? null;
  const homePath        = role ? ROLE_HOME_PATHS[role] : '/login';

  const refreshUser = useCallback(async () => {
    const res = await getMe();
    setUser(extractData(res));
  }, []);

  const value = {
    user,
    role,
    isAuthenticated,
    loading,
    authError,
    homePath,
    login,
    logout,
    refreshUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
