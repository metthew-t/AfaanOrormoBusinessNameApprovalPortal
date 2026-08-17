import api from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const mock = async (data, delay = 600) => {
  await new Promise((r) => setTimeout(r, delay));
  return { data: { success: true, data } };
};

// ─── Financial Officer ────────────────────────────────────────────

export const getPermissionQueue = async (params) => {
  if (USE_MOCK) {
    const { MOCK_PERMISSION_QUEUE } = await import('@/mock/applications');
    return mock(MOCK_PERMISSION_QUEUE);
  }
  return api.get('/financial/permissions', { params });
};

export const getPermissionDetail = async (id) => {
  if (USE_MOCK) {
    const { MOCK_PERMISSION_QUEUE } = await import('@/mock/applications');
    const item = MOCK_PERMISSION_QUEUE.find((a) => a.id === id);
    if (!item) throw { response: { data: { message: 'Not found.' } } };
    return mock(item);
  }
  return api.get(`/financial/permissions/${id}`);
};

export const approvePermission = async (id) => {
  if (USE_MOCK) return mock({ id, status: 'PERMISSION_APPROVED' });
  return api.post(`/financial/permissions/${id}/approve`);
};

export const rejectPermission = async (id, payload) => {
  if (USE_MOCK) return mock({ id, status: 'PERMISSION_REJECTED' });
  return api.post(`/financial/permissions/${id}/reject`, payload);
};

export const requestPermissionCorrection = async (id, payload) => {
  if (USE_MOCK) return mock({ id, status: 'PERMISSION_CORRECTION_REQUIRED' });
  return api.post(`/financial/permissions/${id}/request-correction`, payload);
};

export const getFinancialDashboardStats = async () => {
  if (USE_MOCK) {
    return mock({ pending: 12, approved: 45, rejected: 7, correctionRequired: 3 });
  }
  return api.get('/financial/dashboard/stats');
};
