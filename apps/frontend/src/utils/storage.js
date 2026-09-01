// Safe localStorage helpers

const TOKEN_KEY = 'aobnap_token';

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); }
  catch { return null; }
};

export const setToken = (token) => {
  try { localStorage.setItem(TOKEN_KEY, token); }
  catch { /* ignore */ }
};

export const removeToken = () => {
  try { localStorage.removeItem(TOKEN_KEY); }
  catch { /* ignore */ }
};

export const clearAuth = () => {
  removeToken();
};
