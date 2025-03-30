import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Button, 
  List, ListItem, ListItemText, ListItemIcon, Divider,
  Card, CardContent, CardHeader, Chip, Alert, CircularProgress
} from '@mui/material';
import { 
  Security, DevicesOther, Notifications, Warning,
  Check, Error, Info, Shield, PhoneAndroid, Computer
} from '@mui/icons-material';
import { userManagementService, deviceService, securityService } from '../services/userManagementService'; // Using relative path instead of alias

interface ThreatData {
  id: string;
  severity: string;
  type: string;
  detectedAt: string;
}

interface DeviceData {
  id: string;
  deviceName: string;
  lastUsed: string;
  trusted: boolean;
  type: string;
}

interface SecurityStatusData {
  loginAttempts?: number;
  twoFactorEnabled?: boolean;
  status?: string;
}

interface UserData {
  firstName?: string;
  lastName?: string;
  id?: string;
  // Add other properties as needed
}

const SecurityDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatusData>({});
  const [recentThreats, setRecentThreats] = useState<ThreatData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        
        // Fetch user data
        const userData = await userManagementService.getUserById(userId);
        setUserData(userData);
        
        // Fetch devices
        const devices = await deviceService.getUserDevices(userId);
        setDevices(devices);
        
        // Fetch security status
        const authStatus = await userManagementService.getUserAuthStatus(userId);
        setSecurityStatus(authStatus);
        
        // Fetch recent threats
        const threats = await securityService.getUserThreats(userId);
        setRecentThreats(threats);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load security dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRegisterDevice = () => {
    // Implementation for device registration
  };

  const handleSecurityScan = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await userManagementService.updateUserSecurityStatus(userId);
      // Refresh data after scan
      const authStatus = await userManagementService.getUserAuthStatus(userId);
      setSecurityStatus(authStatus);
    } catch (error) {
      setError('Failed to perform security scan.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  const renderSecurityStatus = () => {
    const loginAttempts = securityStatus?.loginAttempts || 0;
    const twoFactorEnabled = securityStatus?.twoFactorEnabled || false;
    const accountStatus = securityStatus?.status || 'UNKNOWN';
    
    return (
      <Card elevation={3}>
        <CardHeader 
          title="Security Status" 
          avatar={<Shield color="primary" />}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">Account Status:</Typography>
                <Chip 
                  label={accountStatus} 
                  color={accountStatus === 'ACTIVE' ? 'success' : 'error'} 
                  size="small" 
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">Two-Factor Authentication:</Typography>
                <Chip 
                  label={twoFactorEnabled ? 'Enabled' : 'Disabled'} 
                  color={twoFactorEnabled ? 'success' : 'warning'} 
                  size="small" 
                  icon={twoFactorEnabled ? <Check /> : <Warning />}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">Recent Login Attempts:</Typography>
                <Chip 
                  label={loginAttempts} 
                  color={loginAttempts > 3 ? 'warning' : 'default'} 
                  size="small" 
                />
              </Box>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth
                startIcon={<Security />}
                onClick={handleSecurityScan}
              >
                Run Security Check
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderDevices = () => {
    return (
      <Card elevation={3}>
        <CardHeader 
          title="Registered Devices" 
          avatar={<DevicesOther color="primary" />}
        />
        <CardContent>
          {devices.length === 0 ? (
            <Typography color="textSecondary">No devices registered</Typography>
          ) : (
            <List dense>
              {devices.map((device, index) => (
                <React.Fragment key={device.id || index}>
                  <ListItem>
                    <ListItemIcon>
                      {device.type === 'MOBILE' ? <PhoneAndroid /> : <Computer />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={device.deviceName} 
                      secondary={`Last active: ${new Date(device.lastUsed).toLocaleString()}`} 
                    />
                    <Chip 
                      label={device.trusted ? 'Trusted' : 'Unverified'} 
                      size="small" 
                      color={device.trusted ? 'success' : 'default'} 
                    />
                  </ListItem>
                  {index < devices.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
          <Box mt={2}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              startIcon={<DevicesOther />}
              onClick={handleRegisterDevice}
            >
              Register New Device
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderThreats = () => {
    return (
      <Card elevation={3}>
        <CardHeader 
          title="Recent Security Alerts" 
          avatar={<Warning color="error" />}
        />
        <CardContent>
          {recentThreats.length === 0 ? (
            <Alert severity="success">No recent security threats detected</Alert>
          ) : (
            <List dense>
              {recentThreats.map((threat, index) => (
                <React.Fragment key={threat.id || index}>
                  <ListItem>
                    <ListItemIcon>
                      {threat.severity === 'HIGH' ? (
                        <Error color="error" />
                      ) : threat.severity === 'MEDIUM' ? (
                        <Warning color="warning" />
                      ) : (
                        <Info color="info" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={threat.type} 
                      secondary={`Detected: ${new Date(threat.detectedAt).toLocaleString()}`}
                    />
                    <Chip 
                      label={threat.severity} 
                      color={
                        threat.severity === 'HIGH' ? 'error' : 
                        threat.severity === 'MEDIUM' ? 'warning' : 'info'
                      } 
                      size="small" 
                    />
                  </ListItem>
                  {index < recentThreats.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>
              Security Dashboard
            </Typography>
            <Typography variant="body1">
              Welcome back, {userData?.firstName || 'User'}! Monitor your account security and manage connected devices.
            </Typography>
          </Paper>
        </Grid>
        
        {/* Security Status */}
        <Grid item xs={12} md={4}>
          {renderSecurityStatus()}
        </Grid>
        
        {/* Registered Devices */}
        <Grid item xs={12} md={4}>
          {renderDevices()}
        </Grid>
        
        {/* Recent Threats */}
        <Grid item xs={12} md={4}>
          {renderThreats()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SecurityDashboard;