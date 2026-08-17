import api from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const mock = async (data, delay = 600) => {
  await new Promise((r) => setTimeout(r, delay));
  return { data: { success: true, data } };
};

export const getMyCertificates = async () => {
  if (USE_MOCK) {
    const { MOCK_CERTIFICATES } = await import('@/mock/certificates');
    return mock(MOCK_CERTIFICATES);
  }
  return api.get('/certificates/my');
};

export const getCertificateById = async (id) => {
  if (USE_MOCK) {
    const { MOCK_CERTIFICATES } = await import('@/mock/certificates');
    const cert = MOCK_CERTIFICATES.find((c) => c.id === id);
    if (!cert) throw { response: { data: { message: 'Certificate not found.' } } };
    return mock(cert);
  }
  return api.get(`/certificates/${id}`);
};

export const downloadCertificate = async (id) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return { data: { success: true, message: 'Certificate download started (mock).' } };
  }
  return api.get(`/certificates/${id}/download`, { responseType: 'blob' });
};

export const verifyCertificate = async (approvalNumber) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700));
    if (approvalNumber === 'INVALID') {
      return { data: { success: true, data: { valid: false } } };
    }
    return {
      data: {
        success: true,
        data: {
          valid: true,
          businessName: 'Baqqalaa Nagaa Daldala PLC',
          category: 'Retail Trade',
          approvalNumber,
          approvalDate: '2026-03-15T10:00:00.000Z',
          issuingOffice: 'Oromia Trade Bureau',
          status: 'ISSUED',
        },
      },
    };
  }
  return api.get('/public/verify-certificate', { params: { approvalNumber } });
};

export const searchPublicBusinessNames = async (params) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700));
    const names = [
      { id: '1', businessName: 'Baqqalaa Nagaa Daldala PLC', category: 'Retail Trade', approvalDate: '2026-01-10T00:00:00.000Z', approvalNumber: 'AOB-2026-0001' },
      { id: '2', businessName: 'Ifaa Teknolojii Dhaabbata', category: 'Information Technology', approvalDate: '2026-02-14T00:00:00.000Z', approvalNumber: 'AOB-2026-0002' },
      { id: '3', businessName: 'Horsiisee Bulaa Qonnaa', category: 'Agriculture', approvalDate: '2026-03-05T00:00:00.000Z', approvalNumber: 'AOB-2026-0003' },
    ];
    const filtered = params?.q
      ? names.filter((n) => n.businessName.toLowerCase().includes(params.q.toLowerCase()))
      : names;
    return { data: { success: true, data: filtered } };
  }
  return api.get('/public/business-names', { params });
};
