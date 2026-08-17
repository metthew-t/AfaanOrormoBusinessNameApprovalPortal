import api from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const mock = async (data, delay = 400) => {
  await new Promise((r) => setTimeout(r, delay));
  return { data: { success: true, data } };
};

export const getNotifications = async () => {
  if (USE_MOCK) {
    const { MOCK_NOTIFICATIONS } = await import('@/mock/notifications');
    return mock(MOCK_NOTIFICATIONS);
  }
  return api.get('/notifications');
};

export const getUnreadCount = async () => {
  if (USE_MOCK) {
    const { MOCK_NOTIFICATIONS } = await import('@/mock/notifications');
    const count = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
    return mock({ count });
  }
  return api.get('/notifications/unread-count');
};

export const markNotificationRead = async (id) => {
  if (USE_MOCK) return mock({ id, read: true }, 200);
  return api.patch(`/notifications/${id}/read`);
};

export const markAllRead = async () => {
  if (USE_MOCK) return mock({ success: true }, 300);
  return api.patch('/notifications/mark-all-read');
};
