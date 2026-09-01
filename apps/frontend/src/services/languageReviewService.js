import api from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const mock = async (data, delay = 600) => {
  await new Promise((r) => setTimeout(r, delay));
  return { data: { success: true, data } };
};

// ─── Language Officer ─────────────────────────────────────────────

export const getLanguageQueue = async (params) => {
  if (USE_MOCK) {
    const { MOCK_LANGUAGE_QUEUE } = await import('@/mock/applications');
    return mock(MOCK_LANGUAGE_QUEUE);
  }
  return api.get('/language/reviews', { params });
};

export const getLanguageReviewDetail = async (id) => {
  if (USE_MOCK) {
    const { MOCK_LANGUAGE_QUEUE } = await import('@/mock/applications');
    const item = MOCK_LANGUAGE_QUEUE.find((a) => a.id === id);
    if (!item) throw { response: { data: { message: 'Not found.' } } };
    return mock(item);
  }
  return api.get(`/language/reviews/${id}`);
};

export const approveLanguageReview = async (id, payload) => {
  if (USE_MOCK) return mock({ id, status: 'APPROVED' });
  return api.post(`/language/reviews/${id}/approve`, payload);
};

export const rejectLanguageReview = async (id, payload) => {
  if (USE_MOCK) return mock({ id, status: 'LANGUAGE_REJECTED' });
  return api.post(`/language/reviews/${id}/reject`, payload);
};

export const requestLanguageCorrection = async (id, payload) => {
  if (USE_MOCK) return mock({ id, status: 'LANGUAGE_CORRECTION_REQUIRED' });
  return api.post(`/language/reviews/${id}/request-correction`, payload);
};

export const getLanguageDashboardStats = async () => {
  if (USE_MOCK) {
    return mock({ pending: 8, approvedToday: 5, rejectedToday: 2, corrections: 3 });
  }
  return api.get('/language/dashboard/stats');
};
