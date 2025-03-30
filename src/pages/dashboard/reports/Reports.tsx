import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../../../config/apiConfig';
import {
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Button, 
  Select, 
  MenuItem, 
  TextField, 
  CircularProgress, 
  Typography, 
  Grid, 
  Paper 
} from '@mui/material';

// Typescript interfaces for type safety
interface DateRange {
  from: string;
  to: string;
}

interface SummaryReportData {
  totalThreats: number;
  averageResponseTime: number;
  mitigationRate: number;
  threatsByDay: { date: string; count: number }[];
  threatsByType: { type: string; count: number }[];
}

const Reports: React.FC = () => {
  // State management with more explicit typing
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'custom'>('summary');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function with comprehensive error handling
  const fetchSummaryReport = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Log the full URL and parameters for debugging
      console.log('API Gateway URL:', process.env.NEXT_PUBLIC_API_GATEWAY_URL);
      console.log('Date Range:', {
        startDate: `${dateRange.from}T00:00:00.000Z`,
        endDate: `${dateRange.to}T23:59:59.999Z`
      });

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/reports/summary`, {
        params: {
          startDate: `${dateRange.from}T00:00:00.000Z`,
          endDate: `${dateRange.to}T23:59:59.999Z`
        },
        // Add timeout and additional config
        timeout: 10000, // 10 seconds timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      setSummaryData(response.data);
    } catch (error) {
      // Comprehensive error handling
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(`Server Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
          console.error('Server responded with error:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          setError('No response received from server. Please check your network connection.');
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Error: ${error.message}`);
          console.error('Error setting up request:', error.message);
        }
      } else {
        // Handle non-axios errors
        setError('An unexpected error occurred');
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // Use effect with dependencies
  useEffect(() => {
    if (reportType === 'summary') {
      fetchSummaryReport();
    }
  }, [reportType, dateRange, fetchSummaryReport]);

  // Enhanced export function with error handling
  const handleExport = async (format: 'PDF' | 'CSV') => {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${format === 'PDF' ? API_CONFIG.ENDPOINTS.REPORTS.EXPORT_PDF : API_CONFIG.ENDPOINTS.REPORTS.EXPORT_CSV}`,
        {
          params: {
            threatId: 123  // TODO: Replace with actual threatId from state/data
          },
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `threat_report_${format.toLowerCase()}.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
      setError(`Failed to export ${format} report`);
    }
  };

  // Render method with MUI components and improved layout
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 'xl', margin: 'auto' }}>
      <Grid container spacing={3}>
        {/* Report Controls */}
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Select
                fullWidth
                value={reportType}
                onChange={(e) => setReportType(e.target.value as typeof reportType)}
                variant="outlined"
              >
                <MenuItem value="summary">Summary Report</MenuItem>
                <MenuItem value="detailed">Detailed Report</MenuItem>
                <MenuItem value="custom">Custom Report</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Export Buttons */}
        <Grid item xs={12}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleExport('PDF')}
              >
                Export PDF
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => handleExport('CSV')}
              >
                Export CSV
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Error Handling */}
        {error && (
          <Grid item xs={12}>
            <Typography color="error" variant="body1">
              {error}
            </Typography>
          </Grid>
        )}

        {/* Loading State */}
        {loading && (
          <Grid item xs={12} display="flex" justifyContent="center">
            <CircularProgress />
          </Grid>
        )}

        {/* Summary Report Content */}
        {!loading && reportType === 'summary' && summaryData && (
          <>
            {/* Existing summary data rendering with MUI components */}
          </>
        )}
      </Grid>
    </Paper>
  );
};

export default Reports;