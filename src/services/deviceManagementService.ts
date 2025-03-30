import { API_CONFIG } from '../config/apiConfig';
import { springAxios } from '../config/axiosConfig';
//import axios from 'axios';

export interface Device {
  deviceId: number;
  deviceName: string;
  deviceType: string;
  userId: number;
}

export const registerDevice = async (userId: number, deviceName: string, deviceType: string) => {
  try {
    const response = await springAxios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DEVICE_MANAGEMENT.REGISTER}`, {
      userId,
      deviceName,
      deviceType
    });
    return response.data; // Assuming response is of type Device
  } catch (error) {
    console.error('Error registering device', error);
    throw error;
  }
};

export const updateDeviceStatus = async (deviceId: number, status: string) => {
  try {
    const response = await springAxios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DEVICE_MANAGEMENT.UPDATE_STATUS(deviceId)}`, { status });
    return response.data; // Assuming response is the updated Device object
  } catch (error) {
    console.error('Error updating device status', error);
    throw error;
  }
};


