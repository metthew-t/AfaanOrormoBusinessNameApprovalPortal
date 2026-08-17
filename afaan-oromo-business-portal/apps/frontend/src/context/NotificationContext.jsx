import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

// ─── Context ─────────────────────────────────────────────────────
const NotificationContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────
export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulate real-time notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Initialize with some mock notifications based on role
    const mockNotifications = generateMockNotifications(user.role);
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);

    // Simulate receiving new notifications every 30 seconds
    const interval = setInterval(() => {
      const newNotification = generateNewNotification(user.role);
      if (newNotification) {
        setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
        setUnreadCount(prev => prev + 1);
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification('AOBNAP - New Notification', {
            body: newNotification.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
          });
        }
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      const newNotifications = prev.filter(n => n.id !== notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return newNotifications;
    });
  }, []);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>');
  return ctx;
}

// ─── Helper Functions ─────────────────────────────────────────────

function generateMockNotifications(role) {
  const now = new Date();
  const notifications = [];

  switch (role) {
    case 'BUSINESS_OWNER':
      notifications.push(
        {
          id: '1',
          type: 'success',
          title: 'Application Approved',
          message: 'Your application APP-2024-001230 has been approved by all departments!',
          timestamp: new Date(now - 3600000).toISOString(),
          isRead: false,
          actionUrl: '/owner/approval-messages',
        },
        {
          id: '2',
          type: 'info',
          title: 'Under Review',
          message: 'Your application APP-2024-001234 is currently being reviewed by Commercial Office.',
          timestamp: new Date(now - 7200000).toISOString(),
          isRead: false,
          actionUrl: '/owner/applications',
        },
        {
          id: '3',
          type: 'info',
          title: 'Application Submitted',
          message: 'Your application has been successfully submitted and routed to review departments.',
          timestamp: new Date(now - 86400000).toISOString(),
          isRead: true,
        }
      );
      break;

    case 'FINANCIAL_OFFICER':
      notifications.push(
        {
          id: '1',
          type: 'info',
          title: 'New Application',
          message: '3 new applications received from business owners awaiting routing.',
          timestamp: new Date(now - 1800000).toISOString(),
          isRead: false,
          actionUrl: '/communication/applications',
        },
        {
          id: '2',
          type: 'success',
          title: 'Review Completed',
          message: 'Commercial Office completed review of APP-2024-001228 - Approved.',
          timestamp: new Date(now - 5400000).toISOString(),
          isRead: false,
          actionUrl: '/communication/messages',
        }
      );
      break;

    case 'LANGUAGE_OFFICER':
      notifications.push(
        {
          id: '1',
          type: 'info',
          title: 'New Review Assignment',
          message: 'APP-2024-001235 has been assigned to you for language compliance review.',
          timestamp: new Date(now - 2400000).toISOString(),
          isRead: false,
          actionUrl: '/turizm/reviews',
        }
      );
      break;

    case 'SENIOR_OFFICER':
      notifications.push(
        {
          id: '1',
          type: 'info',
          title: 'New Permit Review',
          message: '2 new business permits awaiting commercial compliance review.',
          timestamp: new Date(now - 3000000).toISOString(),
          isRead: false,
          actionUrl: '/commercial/reviews',
        }
      );
      break;

    case 'ADMIN':
      notifications.push(
        {
          id: '1',
          type: 'warning',
          title: 'System Alert',
          message: 'Database backup completed successfully. Next backup scheduled for tomorrow.',
          timestamp: new Date(now - 1800000).toISOString(),
          isRead: false,
        },
        {
          id: '2',
          type: 'info',
          title: 'User Activity',
          message: '5 new business owner accounts registered today.',
          timestamp: new Date(now - 7200000).toISOString(),
          isRead: false,
          actionUrl: '/admin/users',
        }
      );
      break;
  }

  return notifications;
}

function generateNewNotification(role) {
  const now = new Date();
  const random = Math.random();

  // 30% chance of generating a new notification
  if (random > 0.3) return null;

  const notificationId = `notif-${Date.now()}`;

  switch (role) {
    case 'BUSINESS_OWNER':
      return {
        id: notificationId,
        type: 'info',
        title: 'Application Update',
        message: 'Your application status has been updated.',
        timestamp: now.toISOString(),
        isRead: false,
        actionUrl: '/owner/applications',
      };

    case 'FINANCIAL_OFFICER':
      return {
        id: notificationId,
        type: 'info',
        title: 'New Application',
        message: 'A new application has been submitted and requires routing.',
        timestamp: now.toISOString(),
        isRead: false,
        actionUrl: '/communication/applications',
      };

    case 'LANGUAGE_OFFICER':
      return {
        id: notificationId,
        type: 'info',
        title: 'Review Pending',
        message: 'New language review assignment available.',
        timestamp: now.toISOString(),
        isRead: false,
        actionUrl: '/turizm/reviews',
      };

    case 'SENIOR_OFFICER':
      return {
        id: notificationId,
        type: 'info',
        title: 'New Permit',
        message: 'New business permit requires commercial review.',
        timestamp: now.toISOString(),
        isRead: false,
        actionUrl: '/commercial/reviews',
      };

    case 'ADMIN':
      return {
        id: notificationId,
        type: 'info',
        title: 'System Activity',
        message: 'New system transaction recorded.',
        timestamp: now.toISOString(),
        isRead: false,
        actionUrl: '/admin/audit-logs',
      };

    default:
      return null;
  }
}

export default NotificationContext;
