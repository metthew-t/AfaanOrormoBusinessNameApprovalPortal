import api from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const mock = async (data, delay = 600) => {
  await new Promise((r) => setTimeout(r, delay));
  return { data: { success: true, data } };
};

// ─── Business Owner: Appeals ──────────────────────────────────────

export const getMyAppeals = async () => {
  if (USE_MOCK) {
    const { MOCK_APPEALS } = await import('@/mock/appeals');
    return mock(MOCK_APPEALS);
  }
  return api.get('/appeals/my');
};

export const submitAppeal = async (payload) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return { data: { success: true, message: 'Appeal submitted successfully.', data: { id: `APL-${Date.now()}` } } };
  }
  return api.post('/appeals', payload);
};

export const uploadAppealDocument = async (appealId, file) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1000));
    return { data: { success: true, data: { url: '/mock/appeal-doc.pdf' } } };
  }
  const fd = new FormData();
  fd.append('document', file);
  return api.post(`/appeals/${appealId}/documents`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ─── Senior Officer: Appeals ──────────────────────────────────────

export const getAppealsQueue = async (params) => {
  if (USE_MOCK) {
    const { MOCK_APPEALS } = await import('@/mock/appeals');
    return mock(MOCK_APPEALS);
  }
  return api.get('/senior/appeals', { params });
};

export const getAppealDetail = async (id) => {
  if (USE_MOCK) {
    const { MOCK_APPEALS } = await import('@/mock/appeals');
    const appeal = MOCK_APPEALS.find((a) => a.id === id);
    if (!appeal) throw { response: { data: { message: 'Appeal not found.' } } };
    return mock(appeal);
  }
  return api.get(`/senior/appeals/${id}`);
};

export const approveAppeal = async (id, payload) => {
  if (USE_MOCK) return mock({ id, status: 'APPROVED' });
  return api.post(`/senior/appeals/${id}/approve`, payload);
};

export const rejectAppeal = async (id, payload) => {
  if (USE_MOCK) return mock({ id, status: 'REJECTED' });
  return api.post(`/senior/appeals/${id}/reject`, payload);
};

export const getSeniorDashboardStats = async () => {
  if (USE_MOCK) {
    return mock({ pending: 4, approved: 18, rejected: 6 });
  }
  return api.get('/senior/dashboard/stats');
};
