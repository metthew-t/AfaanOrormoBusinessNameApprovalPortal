import api from './api';

// Mock data toggle
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// ─── Mock Data ────────────────────────────────────────────────────
const MOCK_STATS = {
  pending: 8,
  approved: 142,
  rejected: 12,
  correctionRequired: 5,
};

const MOCK_APPLICATIONS = [
  {
    id: '1',
    applicationNumber: 'APP-2024-001234',
    businessName: 'Baqqalaa Nagaa Daldala PLC',
    owner: { fullName: 'Chaltu Kebede', email: 'chaltu@example.com' },
    category: 'Retail',
    description: 'Baqqalaa nagaa daldala kan dhiheenyaan jiru. Meeshaalee nyaataa fi dhugaatii adda addaa gurgurra.',
    address: 'Finfinnee, Oromiyaa, Booraa 03',
    receivedAt: '2024-01-15T10:30:00Z',
    status: 'LANGUAGE_REVIEW_PENDING',
    turizmStatus: 'PENDING',
    timeline: [
      { event: 'Application Submitted', timestamp: '2024-01-15T09:00:00Z' },
      { event: 'Routed by Communication Biro', timestamp: '2024-01-15T10:00:00Z' },
      { event: 'Assigned to Language Review', timestamp: '2024-01-15T10:30:00Z' },
    ],
  },
  {
    id: '2',
    applicationNumber: 'APP-2024-001235',
    businessName: 'Turizm Oromiyaa Enterprise',
    owner: { fullName: 'Bontu Tadesse', email: 'bontu@example.com' },
    category: 'Tourism',
    description: 'Tajaajila turizimii Oromiyaa keessatti kenninu. Iddoowwan aadaa fi seenaa ilaalchisuun beeksiisuu.',
    address: 'Adama, Oromiyaa',
    receivedAt: '2024-01-16T14:20:00Z',
    status: 'LANGUAGE_REVIEW_PENDING',
    turizmStatus: 'PENDING',
    timeline: [
      { event: 'Application Submitted', timestamp: '2024-01-16T13:00:00Z' },
      { event: 'Routed by Communication Biro', timestamp: '2024-01-16T14:00:00Z' },
      { event: 'Assigned to Language Review', timestamp: '2024-01-16T14:20:00Z' },
    ],
  },
];

// ─── API Functions ────────────────────────────────────────────────

/**
 * Get Addaf Turizm Biro dashboard statistics
 */
export async function getTurizmStats() {
  if (USE_MOCK) {
    return { success: true, data: MOCK_STATS };
  }
  return api.get('/turizm/dashboard/stats');
}

/**
 * Get language review queue
 */
export async function getTurizmQueue() {
  if (USE_MOCK) {
    return { success: true, data: MOCK_APPLICATIONS };
  }
  return api.get('/turizm/reviews');
}

/**
 * Get application detail for review
 */
export async function getApplicationForReview(id) {
  if (USE_MOCK) {
    const app = MOCK_APPLICATIONS.find(a => a.id === id);
    return { success: true, data: app };
  }
  return api.get(`/turizm/reviews/${id}`);
}

/**
 * Approve business description
 * @param {object} data - { applicationId, comment }
 */
export async function approveDescription(data) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Description approved successfully' };
  }
  return api.post(`/turizm/reviews/${data.applicationId}/approve`, {
    comment: data.comment,
  });
}

/**
 * Reject business description
 * @param {object} data - { applicationId, reason }
 */
export async function rejectDescription(data) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Application rejected' };
  }
  return api.post(`/turizm/reviews/${data.applicationId}/reject`, {
    reason: data.reason,
  });
}

/**
 * Request correction to business description
 * @param {object} data - { applicationId, correctionNotes }
 */
export async function requestCorrection(data) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: 'Correction requested' };
  }
  return api.post(`/turizm/reviews/${data.applicationId}/request-correction`, {
    correctionNotes: data.correctionNotes,
  });
}
