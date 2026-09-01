import api from './api';

// Mock data toggle
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// ─── Mock Data ────────────────────────────────────────────────────
const MOCK_STATS = {
  pending: 10,
  approved: 168,
  rejected: 8,
  correctionRequired: 4,
};

const MOCK_APPLICATIONS = [
  {
    id: '1',
    applicationNumber: 'APP-2024-001234',
    businessName: 'Baqqalaa Nagaa Daldala PLC',
    owner: { 
      fullName: 'Chaltu Kebede', 
      email: 'chaltu@example.com',
      phone: '+251-911-234567'
    },
    category: 'Retail',
    description: 'Baqqalaa nagaa daldala kan dhiheenyaan jiru. Meeshaalee nyaataa fi dhugaatii adda addaa gurgurra.',
    address: 'Finfinnee, Oromiyaa, Booraa 03',
    permissionDocument: {
      fileName: 'business_permit_12345.pdf',
      fileSize: 2457600, // 2.4 MB
      uploadedAt: '2024-01-15T09:30:00Z',
      url: '#',
    },
    receivedAt: '2024-01-15T10:30:00Z',
    status: 'PERMISSION_PENDING',
    commercialStatus: 'PENDING',
    timeline: [
      { event: 'Application Submitted', timestamp: '2024-01-15T09:00:00Z' },
      { event: 'Routed by Communication Biro', timestamp: '2024-01-15T10:00:00Z' },
      { event: 'Assigned to Commercial Review', timestamp: '2024-01-15T10:30:00Z' },
    ],
  },
  {
    id: '2',
    applicationNumber: 'APP-2024-001235',
    businessName: 'Turizm Oromiyaa Enterprise',
    owner: { 
      fullName: 'Bontu Tadesse', 
      email: 'bontu@example.com',
      phone: '+251-922-345678'
    },
    category: 'Tourism',
    description: 'Tajaajila turizimii Oromiyaa keessatti kenninu. Iddoowwan aadaa fi seenaa ilaalchisuun beeksiisuu.',
    address: 'Adama, Oromiyaa',
    permissionDocument: {
      fileName: 'tourism_license_56789.pdf',
      fileSize: 3145728, // 3 MB
      uploadedAt: '2024-01-16T13:45:00Z',
      url: '#',
    },
    receivedAt: '2024-01-16T14:20:00Z',
    status: 'PERMISSION_PENDING',
    commercialStatus: 'PENDING',
    timeline: [
      { event: 'Application Submitted', timestamp: '2024-01-16T13:00:00Z' },
      { event: 'Routed by Waajira Kominikeeshinii', timestamp: '2024-01-16T14:00:00Z' },
      { event: 'Assigned to Commercial Review', timestamp: '2024-01-16T14:20:00Z' },
    ],
  },
];

// ─── API Functions ────────────────────────────────────────────────

/**
 * Get Waajira Daldaala dashboard statistics
 */
export async function getCommercialStats() {
  if (USE_MOCK) {
    return { success: true, data: MOCK_STATS };
  }
  return api.get('/commercial/dashboard/stats');
}

/**
 * Get commercial review queue
 */
export async function getCommercialQueue() {
  if (USE_MOCK) {
    return { success: true, data: MOCK_APPLICATIONS };
  }
  return api.get('/commercial/reviews');
}

/**
 * Get application detail for review
 */
export async function getApplicationForReview(id) {
  if (USE_MOCK) {
    const app = MOCK_APPLICATIONS.find(a => a.id === id);
    return { success: true, data: app };
  }
  return api.get(`/commercial/reviews/${id}`);
}

/**
 * Approve business permit
 * @param {object} data - { applicationId, comment }
 */
export async function approvePermit(data) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Business permit approved successfully' };
  }
  return api.post(`/commercial/reviews/${data.applicationId}/approve`, {
    comment: data.comment,
  });
}

/**
 * Reject business permit
 * @param {object} data - { applicationId, reason }
 */
export async function rejectPermit(data) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Application rejected' };
  }
  return api.post(`/commercial/reviews/${data.applicationId}/reject`, {
    reason: data.reason,
  });
}

/**
 * Request correction to business permit
 * @param {object} data - { applicationId, correctionNotes }
 */
export async function requestCorrection(data) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: 'Correction requested' };
  }
  return api.post(`/commercial/reviews/${data.applicationId}/request-correction`, {
    correctionNotes: data.correctionNotes,
  });
}
