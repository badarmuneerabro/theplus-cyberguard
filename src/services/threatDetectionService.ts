import { API_CONFIG } from '../config/apiConfig';
import { springAxios } from '../config/axiosConfig';

// Interfaces for the expected response data
export interface ThreatDetectionDTO {
  id: number;
  threatType: string;
  severity: string;
  description: string;
  detectedAt: string;
  deviceId: number;
  ipAddress: string;
}

export interface ThreatTypesOverTime {
  date: string;
  type: string;
  count: number;
}

export const getThreatData = async () => {
    try {
      const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THREATS.DATA}`);
      return response.data; 
    } catch (error) {
      console.error('Error fetching threat data', error);
      throw error;
    }
  };
  
  export const getFeatureDistribution = async () => {
    try {
      const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THREATS.FEATURES}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feature distribution', error);
      throw error;
    }
  };
  
  export const getThreatTypesOverTime = async () => {
    try {
      const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THREATS.TYPES}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching threat types over time', error);
      throw error;
    }
  };
  
  export const getCurrentThreats = async () => {
    try {
      const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THREATS.CURRENT}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current threats', error);
      throw error;
    }
  };
  
  export const analyzeTraffic = async (traffic: any) => {
    try {
      const response = await springAxios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THREATS.MANUAL_DETECTION}`, traffic);
      return response.data;
    } catch (error) {
      console.error('Error analyzing traffic', error);
      throw error;
    }
  };
  
  export const getThreatDetectionResultsByUser = async (userId: number) => {
    try {
      const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THREATS.USER(userId.toString())}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching threat detection results for user', error);
      throw error;
    }
  };
  
  export const getThreatDetectionResultsByDevice = async (deviceId: number) => {
    try {
      const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THREATS.DEVICE(deviceId)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching threat detection results for device', error);
      throw error;
    }
  };
  
  export const getThreatDetectionResultsByIpAddress = async (ipAddress: string, params?: { page: number; size: number; startTime: string | undefined; endTime: string | undefined; filterExpression: string; sourceIp: string; destinationIp: string; protocol: string; minPacketSize: string; maxPacketSize: string; securityFlag: string; }) => {
    try {
      const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THREATS.IP(ipAddress)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching threat detection results for IP address', error);
      throw error;
    }
  };
  
  export const getThreatDetectionResultsByTimeRange = async (startTime: string, endTime: string) => {
    try {
      const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THREATS.TIME_RANGE}`, {
        params: { startTime, endTime }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching threat detection results by time range', error);
      throw error;
    }
  };
  
  export const getThreatDetectionResultsBySeverity = async (severity: string) => {
    try {
      const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THREATS.SEVERITY(severity)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching threat detection results by severity', error);
      throw error;
    }
  };
  