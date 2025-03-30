import { API_CONFIG } from '../config/apiConfig';
import { springAxios } from '../config/axiosConfig';

export interface UserActivityLogRequest {
  userId: number;
  activityType: string;
  description: string;
  ipAddress?: string;
  deviceId?: string;
  location?: string;
  metadata?: Record<string, unknown>;
}

export const updateUserAttribute = async (
  userId: number,
  attributeName: string,
  value: string,
  reason: string
) => {
  try {
    const response = await springAxios.put(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.UPDATE_ATTRIBUTE(userId, attributeName)}`,
      null,
      { params: { value, reason } }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user attribute", error);
    throw error;
  }
};

export const getUserAttribute = async (userId: number, attributeName: string) => {
  try {
    const response = await springAxios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.GET_ATTRIBUTE(userId, attributeName)}`
    );
    return response.data?.value || null;
  } catch (error) {
    console.error("Error fetching user attribute", error);
    throw error;
  }
};

export const removeUserAttribute = async (
  userId: number,
  attributeName: string,
  reason: string
) => {
  try {
    const response = await springAxios.delete(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.DELETE_ATTRIBUTE(userId, attributeName)}`,
      { params: { reason } }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing user attribute", error);
    throw error;
  }
};

export const logUserActivity = async (
  userId: number,
  type: string,
  description: string
) => {
  try {
    const response = await springAxios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.LOG_ACTIVITY(userId)}`,
      null,
      { params: { type, description } }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging user activity", error);
    throw error;
  }
};

export const logUserActivityDetails = async (request: UserActivityLogRequest) => {
  try {
    const response = await springAxios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.LOG_DETAILED_ACTIVITY}`,
      request
    );
    return response.data;
  } catch (error) {
    console.error("Error logging detailed activity", error);
    throw error;
  }
};