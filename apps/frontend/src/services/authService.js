import api from './api';
import { setToken, clearAuth } from '@/utils/storage';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// ─── Mock Implementations ─────────────────────────────────────────
const mockLogin = async ({ email, password }) => {
  await new Promise((r) => setTimeout(r, 800));
  const { MOCK_USERS } = await import('@/mock/users');
  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) throw { response: { data: { message: 'Invalid email or password.' } } };
  const token = `mock-token-${user.id}`;
  setToken(token);
  const { password: _pw, ...safeUser } = user;
  return { data: { success: true, data: { user: safeUser, token } } };
};

const mockSignup = async (payload) => {
  await new Promise((r) => setTimeout(r, 900));
  return { data: { success: true, message: 'Account created. Please log in.', data: {} } };
};

const mockGetMe = async () => {
  await new Promise((r) => setTimeout(r, 400));
  const { MOCK_USERS } = await import('@/mock/users');
  const token = (await import('@/utils/storage')).getToken();
  const userId = token?.replace('mock-token-', '');
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) throw { response: { status: 401, data: { message: 'Unauthorized' } } };
  const { password: _pw, ...safeUser } = user;
  return { data: { success: true, data: safeUser } };
};

// ─── Real Implementations ─────────────────────────────────────────
const realLogin = (payload) => api.post('/auth/login', payload);
const realSignup = (payload) => api.post('/auth/register', payload);
const realGetMe = () => api.get('/auth/me');

// ─── Exports ─────────────────────────────────────────────────────
export const login = USE_MOCK ? mockLogin : realLogin;
export const signup = USE_MOCK ? mockSignup : realSignup;
export const getMe = USE_MOCK ? mockGetMe : realGetMe;

export const logout = () => {
  clearAuth();
  if (!USE_MOCK) {
    return api.post('/auth/logout').catch(() => {});
  }
};

export const changePassword = (payload) => {
  if (USE_MOCK) {
    return new Promise((r) =>
      setTimeout(() => r({ data: { success: true, message: 'Password changed.' } }), 600)
    );
  }
  return api.post('/auth/change-password', payload);
};

export const updateProfile = (payload) => {
  if (USE_MOCK) {
    return new Promise((r) =>
      setTimeout(() => r({ data: { success: true, message: 'Profile updated.', data: payload } }), 600)
    );
  }
  return api.put('/auth/profile', payload);
};
