import { API_CONFIG } from '../config/apiConfig';
import { springAxios } from '../config/axiosConfig';

export interface NotificationPreference {
  push: boolean;
  email: boolean;
  sms: boolean;
}

interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
}

class NotificationService {
  static connectSSE(userId: string) {
    return new EventSource(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS.WS}?userId=${userId}`,
      { withCredentials: true }
    );
  }

  static async getNotifications(): Promise<Notification[]> {
    try {
      const response = await springAxios.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  }

  static async sendNotification(notificationData: {
    message: string;
    userIds: string[];
    type: 'SYSTEM' | 'USER';
  }) {
    try {
      const response = await springAxios.post(
        API_CONFIG.ENDPOINTS.NOTIFICATIONS.SEND,
        notificationData
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to send notification');
    }
  }

  static async updatePreferences(preferences: NotificationPreference) {
    try {
      const response = await springAxios.post(
        API_CONFIG.ENDPOINTS.NOTIFICATIONS.PREFERENCES,
        preferences,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to update preferences');
    }
  }

  static async markAsRead(notificationId: number) {
    try {
      const response = await springAxios.put(
        API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to mark notification as read');
    }
  }
}

export default NotificationService;