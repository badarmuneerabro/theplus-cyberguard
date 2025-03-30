import { API_CONFIG } from '../config/apiConfig';
import { springAxios } from '../config/axiosConfig';

// Interfaces for the report data
export interface ThreatSummaryReport {
  totalThreats: number;
  averageResponseTime: number;
  mitigationRate: number;
  threatsByDay: { date: string; count: number }[];
  threatsByType: { type: string; count: number }[];
}

export interface DetailedThreatReport {
  threatId: number;
  description: string;
  resolutionStatus: string;
  mitigatedAt: string;
}

export const getSummaryReport = async (startDate: string, endDate: string) => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REPORTS.SUMMARY}`, {
      params: { startDate, endDate }
    });
    return response.data; // Assuming response is of type ThreatSummaryReport
  } catch (error) {
    console.error('Error fetching summary report', error);
    throw error;
  }
};

export const getDetailedReport = async (threatId: number) => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REPORTS.DETAILED(threatId)}`);
    return response.data; // Assuming response is of type DetailedThreatReport
  } catch (error) {
    console.error('Error fetching detailed report', error);
    throw error;
  }
};

export const exportPdfReport = async (threatId: number) => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REPORTS.EXPORT_PDF(threatId)}`, {
      responseType: 'blob'
    });
    return response.data; // Assuming this is a Blob object representing the PDF
  } catch (error) {
    console.error('Error exporting PDF report', error);
    throw error;
  }
};

export const exportCsvReport = async (threatId: number) => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REPORTS.EXPORT_CSV(threatId)}`, {
      responseType: 'blob'
    });
    return response.data; // Assuming this is a Blob object representing the CSV
  } catch (error) {
    console.error('Error exporting CSV report', error);
    throw error;
  }
};
