import api from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

const mock = async (data, delay = 600) => {
  await new Promise((r) => setTimeout(r, delay));
  return { data: { success: true, data } };
};

// ─── Business Owner: Applications ────────────────────────────────

export const getMyApplications = async (params) => {
  if (USE_MOCK) {
    const { MOCK_APPLICATIONS } = await import('@/mock/applications');
    return mock(MOCK_APPLICATIONS);
  }
  return api.get('/applications', { params });
};

export const getApplicationById = async (id) => {
  if (USE_MOCK) {
    const { MOCK_APPLICATIONS } = await import('@/mock/applications');
    const app = MOCK_APPLICATIONS.find((a) => a.id === id);
    if (!app) throw { response: { data: { message: 'Application not found.' } } };
    return mock(app);
  }
  return api.get(`/applications/${id}`);
};

export const createApplication = async (payload) => {
  if (USE_MOCK) {
    const { MOCK_APPLICATIONS } = await import('@/mock/applications');
    const newApp = {
      id: `APP-${Date.now()}`,
      applicationNumber: `AOB-2026-${String(MOCK_APPLICATIONS.length + 1).padStart(4, '0')}`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      ...payload,
    };
    MOCK_APPLICATIONS.unshift(newApp);
    return mock(newApp);
  }
  return api.post('/applications', payload);
};

export const updateApplication = async (id, payload) => {
  if (USE_MOCK) return mock({ id, ...payload });
  return api.put(`/applications/${id}`, payload);
};

export const submitApplication = async (id) => {
  if (USE_MOCK) return mock({ id, status: 'SUBMITTED' });
  return api.post(`/applications/${id}/submit`);
};

export const uploadPermissionDocument = async (id, file, onProgress) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1200));
    return { data: { success: true, data: { url: '/mock/document.pdf', name: file.name, id: `DOC-${Date.now()}` } } };
  }
  const fd = new FormData();
  fd.append('document', file);
  return api.post(`/applications/${id}/documents`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });
};

export const deletePermissionDocument = async (id, docId) => {
  if (USE_MOCK) return mock({ success: true });
  return api.delete(`/applications/${id}/documents/${docId}`);
};

export const validateBusinessName = async (payload) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700));
    return {
      data: {
        success: true,
        data: {
          isValid: true,
          checks: {
            validCharacters:      true,
            validLength:          true,
            noExactDuplicate:     true,
            noNormalizedDuplicate:true,
            noPendingDuplicate:   true,
            noReservedTerm:       true,
          },
        },
      },
    };
  }
  return api.post('/business-names/validate', payload);
};

export const getMyCorrections = async () => {
  if (USE_MOCK) {
    const { MOCK_CORRECTIONS } = await import('@/mock/applications');
    return mock(MOCK_CORRECTIONS);
  }
  return api.get('/applications/corrections');
};

export const submitCorrection = async (id, payload) => {
  if (USE_MOCK) return mock({ id, status: 'SUBMITTED' });
  return api.post(`/applications/${id}/corrections`, payload);
};
