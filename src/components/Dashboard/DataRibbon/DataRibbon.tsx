import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, CircularProgress, Alert } from "@mui/material";
import { 
  NotificationsActive, 
  Assessment, 
  Warning, 
  Security, 
  NetworkCheck, 
  BugReport, 
  Devices, 
  Email 
} from "@mui/icons-material";
import NotificationService from "../../../services/notificationService";
import { springAxios } from "../../../config/axiosConfig";
import { API_CONFIG } from "../../../config/apiConfig";

// Define interfaces for different data types
interface Notification {
  id: number;
  read: boolean;
  // Add other notification properties as needed
}

interface DashboardStats {
  activeLogCount: number;
  reportPercentage: number;
  incidentPercentage: number;
  newThreatsPercentage: number;
  networkTrafficPercentage: number;
  threatDetectionRate: number;
  deviceUsageRate: number;
  emailAlertRate: number;
}

// Mock data to use when API is unavailable
const mockStats: DashboardStats = {
  activeLogCount: 0,
  reportPercentage: 0,
  incidentPercentage: 0,
  newThreatsPercentage: 0,
  networkTrafficPercentage: 0,
  threatDetectionRate:0,
  deviceUsageRate: 0,
  emailAlertRate: 0
};

const DataRibbon = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch real data
        try {
          // Fetch notifications
          const notificationsData = await NotificationService.getNotifications();
          setNotifications(notificationsData);
          
          // Fetch other statistics from respective endpoints
          const incidentsResponse = await springAxios.get(API_CONFIG.ENDPOINTS.INCIDENTS.METRICS);
          const threatsResponse = await springAxios.get(API_CONFIG.ENDPOINTS.THREATS.CURRENT);
          const reportsResponse = await springAxios.get(API_CONFIG.ENDPOINTS.REPORTS.SUMMARY);
          const devicesResponse = await springAxios.get(API_CONFIG.ENDPOINTS.DEVICE_MANAGEMENT.LIST);
          
          // Combine all data
          setStats({
            activeLogCount: notificationsData.filter(n => !n.read).length,
            reportPercentage: reportsResponse.data?.percentageChange || 0,
            incidentPercentage: incidentsResponse.data?.percentageChange || 0,
            newThreatsPercentage: threatsResponse.data?.newThreatsPercentage || 0,
            networkTrafficPercentage: incidentsResponse.data?.networkTrafficChange || 0,
            threatDetectionRate: threatsResponse.data?.detectionRate || 0,
            deviceUsageRate: devicesResponse.data?.usageRate || 0,
            emailAlertRate: reportsResponse.data?.emailAlertRate || 0
          });
          
          setUsingMockData(false);
        } catch (apiError) {
          console.warn("API connection failed, using mock data", apiError);
          // If API connection fails, use mock data
          setStats(mockStats);
          setUsingMockData(true);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
        // Fallback to mock data even if everything fails
        setStats(mockStats);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Determine trend direction based on percentage change
  const getTrend = (value: number) => {
    if (typeof value !== 'number') return 'neutral';
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'neutral';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 2, color: 'error.main' }}>
        {error || "Failed to load dashboard data"}
      </Box>
    );
  }

  const ribbonData = [
    { 
      title: "Active Logs", 
      value: stats.activeLogCount, 
      description: "Unread notifications", 
      icon: <NotificationsActive />,
      color: "#5cffb4",
      trend: getTrend(stats.activeLogCount),
      progressValue: Math.min(stats.activeLogCount * 10, 100)
    },
    { 
      title: "Reports", 
      value: `${stats.reportPercentage}%`, 
      description: "Daily report from Analysis", 
      icon: <Assessment />,
      color: "#64b5f6",
      trend: getTrend(stats.reportPercentage),
      progressValue: stats.reportPercentage
    },
    { 
      title: "Incidents", 
      value: `${stats.incidentPercentage}%`, 
      description: "The daily incidents", 
      icon: <Warning />,
      color: "#ff9800",
      trend: getTrend(stats.incidentPercentage),
      progressValue: stats.incidentPercentage
    },
    { 
      title: "Threats Intelligence", 
      value: `${stats.newThreatsPercentage}%`, 
      description: "New threats", 
      icon: <Security />,
      color: "#f44336",
      trend: getTrend(stats.newThreatsPercentage),
      progressValue: stats.newThreatsPercentage
    },
    { 
      title: "Network Traffic", 
      value: `${stats.networkTrafficPercentage}%`, 
      description: "New network traffic", 
      icon: <NetworkCheck />,
      color: "#4caf50",
      trend: getTrend(stats.networkTrafficPercentage),
      progressValue: stats.networkTrafficPercentage
    },
    { 
      title: "Threat Detected", 
      value: `${stats.threatDetectionRate}%`, 
      description: "Threats detected", 
      icon: <BugReport />,
      color: "#e91e63",
      trend: getTrend(stats.threatDetectionRate),
      progressValue: stats.threatDetectionRate
    },
    { 
      title: "Devices", 
      value: `${stats.deviceUsageRate}%`, 
      description: "Device used", 
      icon: <Devices />,
      color: "#9c27b0",
      trend: getTrend(stats.deviceUsageRate),
      progressValue: stats.deviceUsageRate
    },
    { 
      title: "Emails", 
      value: `${stats.emailAlertRate}%`, 
      description: "Incident, threat, reports emails", 
      icon: <Email />,
      color: "#2196f3",
      trend: getTrend(stats.emailAlertRate),
      progressValue: stats.emailAlertRate
    },
  ];

  return (
    <>
      {usingMockData && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Unable to connect to the data services. Displaying mock data for demonstration purposes.
        </Alert>
      )}
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {ribbonData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box 
              sx={{ 
                position: 'relative',
                bgcolor: '#1a2035', 
                borderRadius: '10px',
                overflow: 'hidden',
                height: '180px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: item.color,
                }
              }}
            >
              {/* Rest of your component code remains the same */}
              
              {/* Icon Circle */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '60px',
                  height: '60px',
                  borderRadius: '0 0 0 60px',
                  bgcolor: item.color,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  padding: '5px 0 0 5px',
                  boxSizing: 'border-box',
                }}
              >
                {item.icon}
              </Box>

              {/* Content */}
              <Box sx={{ p: 2, pl: 3 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    fontWeight: 'medium',
                    fontSize: '1rem'
                  }}
                >
                  {item.title}
                </Typography>
                
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'white',
                    fontSize: '2rem',
                    mt: 1,
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {item.value}
                  {item.trend === "up" && (
                    <Typography 
                      component="span" 
                      sx={{ 
                        color: '#5cffb4', 
                        fontSize: '1rem',
                        ml: 1
                      }}
                    >
                      ↑
                    </Typography>
                  )}
                  {item.trend === "down" && (
                    <Typography 
                      component="span" 
                      sx={{ 
                        color: '#ff5252', 
                        fontSize: '1rem',
                        ml: 1
                      }}
                    >
                      ↓
                    </Typography>
                  )}
                </Typography>
                
                {/* Progress Bar */}
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: '6px', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: '3px',
                    mt: 1,
                  }}
                >
                  <Box 
                    sx={{ 
                      width: `${Math.min(Math.max(item.progressValue || 0, 0.5), 100)}%`, 
                      height: '100%', 
                      bgcolor: item.color,
                      borderRadius: '3px',
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.5)', 
                    mt: 1,
                    fontSize: '0.875rem'
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default DataRibbon;