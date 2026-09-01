import api from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const mock = async (data, delay = 600) => {
  await new Promise((r) => setTimeout(r, delay));
  return { data: { success: true, data } };
};

// ─── Users ────────────────────────────────────────────────────────
export const getUsers = async (params) => {
  if (USE_MOCK) {
    const { MOCK_ADMIN_USERS } = await import('@/mock/users');
    return mock(MOCK_ADMIN_USERS);
  }
  return api.get('/admin/users', { params });
};

export const createUser = async (payload) => {
  if (USE_MOCK) return mock({ id: `USR-${Date.now()}`, ...payload });
  // Map frontend field names to backend expected format
  return api.post('/admin/users', {
    fullName: payload.fullName,
    email: payload.email,
    password: payload.password,
    roleName: payload.roleName,
    phoneNumber: payload.phoneNumber,
  });
};

export const updateUser = async (id, payload) => {
  if (USE_MOCK) return mock({ id, ...payload });
  // Map frontend field names to backend expected format
  const backendPayload = {
    fullName: payload.fullName,
    phoneNumber: payload.phoneNumber,
    roleName: payload.roleName,
  };
  if (payload.password) {
    backendPayload.password = payload.password;
  }
  return api.patch(`/admin/users/${id}`, backendPayload);
};

export const toggleUserStatus = async (id, status) => {
  if (USE_MOCK) return mock({ id, status });
  return api.patch(`/admin/users/${id}/status`, { status });
};

export const deleteUser = async (id) => {
  if (USE_MOCK) return mock({ id });
  return api.delete(`/admin/users/${id}`);
};

// ─── Business Categories ──────────────────────────────────────────
export const getCategories = async () => {
  if (USE_MOCK) {
    return mock({ data: [{ id: '1', name: 'IT and Software', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, { id: '2', name: 'Agriculture', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] });
  }
  return api.get('/admin/categories');
};

export const createCategory = async (payload) => {
  if (USE_MOCK) return mock({ id: `CAT-${Date.now()}`, ...payload, status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  return api.post('/admin/categories', payload);
};

export const updateCategory = async (id, payload) => {
  if (USE_MOCK) return mock({ id, ...payload });
  return api.patch(`/admin/categories/${id}`, payload);
};

export const deleteCategory = async (id) => {
  if (USE_MOCK) return mock({ id });
  return api.delete(`/admin/categories/${id}`);
};

// ─── Reserved Terms ───────────────────────────────────────────────
export const getReservedTerms = async () => {
  if (USE_MOCK) {
    const { MOCK_RESERVED_TERMS } = await import('@/mock/applications');
    return mock(MOCK_RESERVED_TERMS);
  }
  return api.get('/admin/reserved-terms');
};

export const createReservedTerm = async (payload) => {
  if (USE_MOCK) return mock({ id: `TRM-${Date.now()}`, ...payload, createdAt: new Date().toISOString() });
  return api.post('/admin/reserved-terms', payload);
};

export const updateReservedTerm = async (id, payload) => {
  if (USE_MOCK) return mock({ id, ...payload });
  return api.put(`/admin/reserved-terms/${id}`, payload);
};

export const deleteReservedTerm = async (id) => {
  if (USE_MOCK) return mock({ id });
  return api.delete(`/admin/reserved-terms/${id}`);
};

// ─── Historical Names ─────────────────────────────────────────────
export const getHistoricalNames = async (params) => {
  if (USE_MOCK) {
    const { MOCK_HISTORICAL_NAMES } = await import('@/mock/applications');
    return mock(MOCK_HISTORICAL_NAMES);
  }
  return api.get('/admin/historical-names', { params });
};

export const addHistoricalName = async (payload) => {
  if (USE_MOCK) return mock({ id: `HIST-${Date.now()}`, ...payload, source: 'MANUAL_ENTRY', isActive: true });
  return api.post('/admin/historical-names', payload);
};

export const importHistoricalNames = async (file) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1200));
    return { data: { success: true, message: 'Historical names imported successfully.' } };
  }
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/admin/historical-names/import', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ─── Audit Logs ───────────────────────────────────────────────────
export const getAuditLogs = async (params) => {
  if (USE_MOCK) {
    const { MOCK_AUDIT_LOGS } = await import('@/mock/applications');
    return mock(MOCK_AUDIT_LOGS);
  }
  return api.get('/admin/audit-logs', { params });
};

// ─── Dashboard Stats ──────────────────────────────────────────────
export const getAdminDashboardStats = async () => {
  if (USE_MOCK) {
    return mock({
      totalUsers: 247,
      totalApplications: 1243,
      pendingReviews: 45,
      approvedToday: 18,
      transactionsToday: 156,
      communication: {
        routed: 32,
        messages: 28,
      },
      commercial: {
        approved: 168,
        rejected: 8,
      },
      turizm: {
        approved: 142,
        rejected: 12,
      },
      owners: {
        active: 198,
        newToday: 5,
      },
    });
  }
  return api.get('/admin/dashboard/stats');
};

// ─── Recent Transactions ──────────────────────────────────────────
export const getRecentTransactions = async () => {
  if (USE_MOCK) {
    return mock([
      {
        id: '1',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        actor: 'Waajira Daldaala Officer',
        action: 'APPROVE_PERMIT',
        target: 'APP-2024-001234',
        status: 'SUCCESS',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        actor: 'Waajira Aadaaf Turizimii Officer',
        action: 'APPROVE_DESCRIPTION',
        target: 'APP-2024-001230',
        status: 'SUCCESS',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        actor: 'Communication Officer',
        action: 'ROUTE_APPLICATION',
        target: 'APP-2024-001235',
        status: 'SUCCESS',
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        actor: 'Business Owner',
        action: 'SUBMIT_APPLICATION',
        target: 'APP-2024-001236',
        status: 'SUCCESS',
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1500000).toISOString(),
        actor: 'Admin',
        action: 'CREATE_USER',
        target: 'user@example.com',
        status: 'SUCCESS',
      },
    ]);
  }
  return api.get('/admin/transactions/recent');
};

// ─── System Health ────────────────────────────────────────────────
export const getSystemHealth = async () => {
  if (USE_MOCK) {
    return mock({
      status: 'HEALTHY',
      uptime: '99.9%',
      database: 'HEALTHY',
      api: 'OPERATIONAL',
      storage: 'HEALTHY',
      notifications: 'OPERATIONAL',
    });
  }
  return api.get('/admin/system/health');
};
