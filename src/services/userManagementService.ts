import { API_CONFIG } from '../config/apiConfig';
import { springAxios } from '../config/axiosConfig';

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  // Other profile fields
}

export interface UserRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface DeviceRegistrationDto {
    deviceName: string;
    deviceType: string;
    deviceId: string;
    manufacturer?: string;
    osVersion?: string;
  }

export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
}       

export interface LocalDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface OAuth2UserInfo {
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  provider: string;
  providerId: string;
}

export const registerUser = async (data: UserRegistrationRequest) => {
  try {
    const response = await springAxios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.REGISTER}`, data);
    return response.data;
  } catch (error) {
    console.error("Registration failed", error);
    throw error;
  }
};

export const getUserById = async (userId: number) => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.GET_USER_BY_ID(userId)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID", error);
    throw error;
  }
};

export const updateUser = async (userId: number, userData: UserProfile) => {
  try {
    const response = await springAxios.put(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.UPDATE_USER(userId)}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.FIND_USER_BY_EMAIL}`, { params: { email } });
    return response.data;
  } catch (error) {
    console.error("Error finding user by email", error);
    throw error;
  }
};

export const checkSubscriptionValidity = async (userId: number) => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.CHECK_SUBSCRIPTION(userId)}`);
    return response.data;
  } catch (error) {
    console.error("Error checking subscription", error);
    throw error;
  }
};

export const check2FAEnabled = async (userId: number) => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.CHECK_2FA(userId)}`);
    return response.data;
  } catch (error) {
    console.error("Error checking 2FA status", error);
    throw error;
  }
};

export const registerDevice = async (userId: number, deviceData: DeviceRegistrationDto) => {
  try {
    const response = await springAxios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.REGISTER_DEVICE(userId)}`, deviceData);
    return response.data;
  } catch (error) {
    console.error("Error registering device", error);
    throw error;
  }
};

export const handleSuspiciousActivity = async (userId: number, activityType: string) => {
  try {
    const response = await springAxios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.HANDLE_SUSPICIOUS_ACTIVITY(userId)}`, { activityType });
    return response.data;
  } catch (error) {
    console.error("Error handling suspicious activity", error);
    throw error;
  }
};

export const getUserProfile = async (userId: number) => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.GET_USER_PROFILE(userId)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile", error);
    throw error;
  }
};

export const updateProfile = async (userId: number, profileData: ProfileUpdateRequest) => {
  try {
    const response = await springAxios.put(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.UPDATE_PROFILE(userId)}`, profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
};

export const enableTwoFactorAuth = async (userId: number) => {
  try {
    const response = await springAxios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.ENABLE_2FA(userId)}`);
    return response.data;
  } catch (error) {
    console.error("Error enabling 2FA", error);
    throw error;
  }
};

export const deleteUserAccount = async (userId: number) => {
  try {
    const response = await springAxios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.DELETE_ACCOUNT(userId)}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user account", error);
    throw error;
  }
};

export const getAuditLogs = async (userId: number, startDate?: LocalDateTime, endDate?: LocalDateTime) => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.GET_AUDIT_LOGS(userId)}`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching audit logs", error);
    throw error;
  }
};

export const getRecentLogs = async (userId: number, limit: number = 10) => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.GET_RECENT_LOGS(userId)}`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent logs", error);
    throw error;
  }
};

// OAuth2 Integration
export const registerOAuth2User = async (userInfo: OAuth2UserInfo) => {
  try {
    const response = await springAxios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.OAUTH2_REGISTER}`,
      userInfo
    );
    return response.data;
  } catch (error) {
    console.error("Error registering OAuth2 user", error);
    throw error;
  }
};

export const processOAuth2Login = async (userInfo: OAuth2UserInfo) => {
  try {
    const response = await springAxios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.OAUTH2_LOGIN}`,
      userInfo
    );
    return response.data;
  } catch (error) {
    console.error("Error processing OAuth2 login", error);
    throw error;
  }
};

const userService = {
  getUserById: async (userId: number) => {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.GET_USER_BY_ID(userId)}`);
    return response.data;
  },
  
  getUserAuthStatus: async (userId: any) => {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}/api/v1/auth/status/${userId}`);
    return response.data;
  },
  
  updateUserSecurityStatus: async (userId: any) => {
    const response = await springAxios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_MANAGEMENT.UPDATE_SECURITY_STATUS(userId)}`);
    return response.data;
  }
};