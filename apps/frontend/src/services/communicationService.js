import api from './api';

// Mock data toggle
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// ─── Mock Data ────────────────────────────────────────────────────
const MOCK_STATS = {
  newApplications: 12,
  inProgress: 28,
  completed: 156,
  unreadMessages: 5,
};

const MOCK_APPLICATIONS = [
  {
    id: '1',
    applicationNumber: 'APP-2024-001234',
    businessName: 'Baqqalaa Nagaa Daldala PLC',
    owner: { fullName: 'Chaltu Kebede', email: 'chaltu@example.com' },
    category: 'Retail',
    description: 'Baqqalaa nagaa daldala kan dhiheenyaan jiru',
    permissionDocument: { fileName: 'permit_12345.pdf' },
    submittedAt: '2024-01-15T10:30:00Z',
    status: 'SUBMITTED',
  },
  {
    id: '2',
    applicationNumber: 'APP-2024-001235',
    businessName: 'Turizm Oromiyaa Enterprise',
    owner: { fullName: 'Bontu Tadesse', email: 'bontu@example.com' },
    category: 'Tourism',
    description: 'Tajaajila turizimii Oromiyaa keessatti',
    permissionDocument: { fileName: 'permit_12346.pdf' },
    submittedAt: '2024-01-16T14:20:00Z',
    status: 'SUBMITTED',
  },
];

const MOCK_MESSAGES = [
  {
    id: '1',
    subject: 'Application Review Completed',
    senderName: 'Commercial Officer',
    senderDepartment: 'Waajira Daldaala',
    applicationNumber: 'APP-2024-001230',
    body: 'The business permit for application APP-2024-001230 has been reviewed and approved. The documentation meets all commercial requirements.',
    createdAt: '2024-01-15T09:00:00Z',
    isRead: false,
  },
  {
    id: '2',
    subject: 'Language Review Query',
    senderName: 'Addaf Turizm Officer',
    senderDepartment: 'Waajira Aadaaf Turizimii',
    applicationNumber: 'APP-2024-001228',
    body: 'We need clarification on the business description for APP-2024-001228. Could you please confirm the intended meaning of certain terms with the business owner?',
    createdAt: '2024-01-14T16:30:00Z',
    isRead: false,
  },
  {
    id: '3',
    subject: 'Weekly Statistics Report',
    senderName: 'IT Admin',
    senderDepartment: 'IT Office',
    applicationNumber: null,
    body: 'This week we processed 45 applications. Waajira Daldaala approved 28, rejected 5. Waajira Aadaaf Turizimii approved 22, rejected 3. Overall system performance is optimal.',
    createdAt: '2024-01-13T10:00:00Z',
    isRead: true,
  },
];

// ─── API Functions ────────────────────────────────────────────────

/**
 * Get Waajira Kominikeeshinii dashboard statistics
 */
export async function getCommunicationStats() {
  if (USE_MOCK) {
    return { success: true, data: MOCK_STATS };
  }
  return api.get('/communication/dashboard/stats');
}

/**
 * Get incoming applications from business owners
 */
export async function getIncomingApplications() {
  if (USE_MOCK) {
    return { success: true, data: MOCK_APPLICATIONS };
  }
  return api.get('/communication/applications');
}

/**
 * Get application detail
 */
export async function getApplicationDetail(id) {
  if (USE_MOCK) {
    const app = MOCK_APPLICATIONS.find(a => a.id === id);
    return { success: true, data: app };
  }
  return api.get(`/communication/applications/${id}`);
}

/**
 * Route application to departments
 * @param {object} data - { applicationId, routeToCommercial, routeToTurizm }
 */
export async function routeApplication(data) {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Application routed successfully' };
  }
  return api.post(`/communication/applications/${data.applicationId}/route`, {
    routeToCommercial: data.routeToCommercial,
    routeToTurizm: data.routeToTurizm,
  });
}

/**
 * Get messages from departments
 */
export async function getMessages() {
  if (USE_MOCK) {
    return { success: true, data: MOCK_MESSAGES };
  }
  return api.get('/communication/messages');
}

/**
 * Get messages from specific department (turizm or commercial)
 * @param {string} department - 'turizm' or 'commercial'
 */
export async function getMessagesFromDepartment(department) {
  if (USE_MOCK) {
    // Mock applications with reviews from departments
    const mockFromTurizm = [
      {
        id: '1',
        applicationNumber: 'APP-2024-001234',
        businessName: 'Baqqalaa Nagaa Daldala PLC',
        category: { id: '1', name: 'Retail' },
        description: 'Baqqalaa nagaa daldala kan dhiheenyaan jiru',
        submittedAt: '2024-01-15T10:30:00Z',
        turizmStatus: 'APPROVED',
        turizmComment: 'The Afaan Oromo description is grammatically correct, culturally appropriate, and conveys the business purpose clearly. Approved for language compliance.',
        turizmReviewedAt: '2024-01-16T14:20:00Z',
        finalDecision: null,
        finalDecisionReason: null,
      },
      {
        id: '2',
        applicationNumber: 'APP-2024-001235',
        businessName: 'Turizm Oromiyaa Enterprise',
        category: { id: '2', name: 'Tourism' },
        description: 'Tajaajila turizimii Oromiyaa keessatti kan kennu',
        submittedAt: '2024-01-16T08:00:00Z',
        turizmStatus: 'CORRECTION_REQUESTED',
        turizmComment: 'Minor grammatical issues detected. The phrase "kan kennu" should be clarified to better express the service offering.',
        turizmReviewedAt: '2024-01-17T10:15:00Z',
        finalDecision: null,
        finalDecisionReason: null,
      },
    ];

    const mockFromCommercial = [
      {
        id: '3',
        applicationNumber: 'APP-2024-001236',
        businessName: 'Gargaarsa Tekinoolijii PLC',
        category: { id: '3', name: 'Technology Services' },
        permitDocuments: [
          { name: 'business_permit.pdf', url: '/docs/permit1.pdf' },
          { name: 'tax_clearance.pdf', url: '/docs/tax1.pdf' },
        ],
        submittedAt: '2024-01-14T09:30:00Z',
        commercialStatus: 'APPROVED',
        commercialComment: 'All permit documents are valid, authentic, and meet regulatory requirements. The business activities are properly documented and authorized.',
        commercialReviewedAt: '2024-01-15T16:45:00Z',
        finalDecision: null,
        finalDecisionReason: null,
      },
    ];

    if (department === 'turizm') {
      return { success: true, data: mockFromTurizm };
    } else if (department === 'commercial') {
      return { success: true, data: mockFromCommercial };
    }
    return { success: true, data: [] };
  }
  return api.get(`/communication/from-${department}`);
}

/**
 * Get applications with completed reviews from both departments
 * Waiting for final decision by Communication office
 */
export async function getReviewedApplications() {
  if (USE_MOCK) {
    const mockReviewedApps = [
      {
        id: '1',
        applicationNumber: 'APP-2026-640778',
        businessName: 'Mana Uffata',
        owner: { fullName: 'Hawwi', email: 'hawig3521@gmail.com' },
        category: 'Geojiiba fi Konkolaataa',
        description: 'irieryhioyhiow45yitiyu',
        submittedAt: '2026-08-31T10:30:00Z',
        commercialReview: {
          status: 'APPROVED',
          comment: 'All permits verified and approved',
          reviewedBy: 'Ogeessa Faayinaansii',
          reviewedAt: '2026-08-31T11:00:00Z',
        },
        languageReview: {
          status: 'APPROVED',
          comment: 'Language compliance verified',
          reviewedBy: 'Ogeessa Afaan Oromoo',
          reviewedAt: '2026-08-31T11:30:00Z',
        },
        documents: [],
      },
    ];
    return { success: true, data: mockReviewedApps };
  }
  return api.get('/communication/reviewed-applications');
}

/**
 * Make final decision on application after reviewing both department responses
 * @param {string} applicationId - Application ID
 * @param {object} data - { decision: 'APPROVED' | 'REJECTED', reason: string }
 */
export async function makeFinalDecision(applicationId, data) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Final decision made successfully' };
  }
  return api.post(`/communication/applications/${applicationId}/final-decision`, data);
}

/**
 * Send final decision on application after department reviews
 * @param {object} data - { applicationId, decision, reason, source }
 */
export async function sendFinalDecision(data) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Final decision sent successfully' };
  }
  return api.post('/communication/final-decision', data);
}

/**
 * Send a message to a department
 * @param {object} data - { recipient, subject, body, applicationNumber }
 */
export async function sendMessage(data) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: 'Message sent successfully' };
  }
  return api.post('/communication/messages', data);
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId) {
  if (USE_MOCK) {
    return { success: true };
  }
  return api.patch(`/communication/messages/${messageId}/read`);
}

/**
 * Get applications from Waajira Daldaala (completed reviews)
 */
export async function getFromCommercial() {
  if (USE_MOCK) {
    return { success: true, data: [] };
  }
  return api.get('/communication/from-commercial');
}

/**
 * Get applications from Waajira Aadaaf Turizimii (completed reviews)
 */
export async function getFromTurizm() {
  if (USE_MOCK) {
    return { success: true, data: [] };
  }
  return api.get('/communication/from-turizm');
}

/**
 * Update application status / make editable
 * @param {string} id - Application ID
 * @param {object} data - { status, comment }
 */
export async function updateApplicationStatus(id, data) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, message: 'Status updated successfully' };
  }
  return api.patch(`/communication/applications/${id}/status`, data);
}

/**
 * Accept an application (send acceptance message to business owner)
 * @param {object} data - { applicationId, reason }
 */
export async function acceptApplication(data) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: 'Application accepted, message sent to business owner' };
  }
  return api.post('/communication/applications/accept', data);
}

/**
 * Reject an application (send rejection message to business owner)
 * @param {object} data - { applicationId, reason }
 */
export async function rejectApplication(data) {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: 'Application rejected, message sent to business owner' };
  }
  return api.post('/communication/applications/reject', data);
}
