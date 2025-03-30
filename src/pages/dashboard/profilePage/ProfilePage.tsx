import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ProfilePictureUpload from "@/components/Profile/ProfilePictureUpload";
import TwoFactorToggle from "@/components/Profile/TwoFactorToggle";
import DeviceManagement from "@/components/Profile/DeviceManagement";

// Create a centralized configuration
const APP_CONFIG = {
  API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000',
}; 

// Define LoginLog type
type LoginLog = {
  ipAddress: string;
  deviceDetails: string;
  apiAccessed: string;
  loginTime: string;
};

const ProfilePage = () => {
  const [showDevices, setShowDevices] = useState(false);
  const [user, setUser] = useState({
    id: null, 
    name: "",
    email: "",
    image: "/default-avatar.png",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    receiveEmails: false,
  });

  const [loading, setLoading] = useState({
    profile: false,
    loginLogs: false,
    update: false,
    delete: false
  });

  //const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);

  // Comprehensive error handling function
  const handleAxiosError = (error: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response;
      console.error("Detailed Axios Error:", {
        status: errorResponse?.status,
        data: errorResponse?.data,
        headers: errorResponse?.headers
      });

      const errorMessage = errorResponse?.data?.message 
        || errorResponse?.data 
        || defaultMessage;

      setError(typeof errorMessage === 'string' 
        ? errorMessage 
        : JSON.stringify(errorMessage));
    } else {
      console.error("Unexpected error:", error);
      setError(defaultMessage);
    }
  };

  // Fetch the current user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(prev => ({...prev, profile: true}));
      setError(null);

      try {
        // TODO: Replace hardcoded ID with actual user ID from authentication
        const response = await axios.get(
          `${APP_CONFIG.API_GATEWAY_URL}/api/v1/users/profile/1`, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            withCredentials: true
          }
        );

        const userData = response.data;

        setUser({
          id: userData.id,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          image: userData.profileImage || "/default-avatar.png",
        });

        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: "",
          confirmPassword: "",
          receiveEmails: userData.emailPreferences?.receiveAnalytics || false,
        });
      } catch (error) {
        handleAxiosError(error, "Failed to load user profile.");
      } finally {
        setLoading(prev => ({...prev, profile: false}));
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch login logs
  useEffect(() => {
    const fetchLoginLogs = async () => {
      if (!user.id) return;

      setLoading(prev => ({...prev, loginLogs: true}));
      setError(null);

      try {
        const response = await axios.get(
          `${APP_CONFIG.API_GATEWAY_URL}/api/v1/users/profile/${user.id}/audit-logs`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            withCredentials: true
          }
        );
        setLoginLogs(response.data);
      } catch (error) {
        handleAxiosError(error, "Failed to load login logs.");
      } finally {
        setLoading(prev => ({...prev, loginLogs: false}));
      }
    };

    fetchLoginLogs();
  }, [user.id]);

  // Handle form changes
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "receiveEmails" ? checked : value,
    }));
  };

  // Validate form
  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError(null);
    return true;
  };

  // Update the other methods to use handleAxiosError and loading states
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(prev => ({...prev, update: true}));
    setSuccessMessage(null);
    setError(null);

    try {
      const updatedProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password.length > 0 ? formData.password : undefined,
        emailPreferences: { receiveAnalytics: formData.receiveEmails },
      };

      await axios.put(
        `${APP_CONFIG.API_GATEWAY_URL}/api/v1/users/profile/${user.id}`, 
        updatedProfile,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      handleAxiosError(error, "Failed to update profile. Please try again.");
    } finally {
      setLoading(prev => ({...prev, update: false}));
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(prev => ({...prev, delete: true}));
    try {
      await axios.delete(
        `${APP_CONFIG.API_GATEWAY_URL}/api/v1/users/profile/${user.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );
      alert("Account deleted successfully!");
      window.location.href = "/login";
    } catch (error) {
      handleAxiosError(error, "Failed to delete account.");
    } finally {
      setLoading(prev => ({...prev, delete: false}));
    }
  };


  return (
    <>
      <h1>Profile</h1>
      <Box>
        <Typography variant="h4" sx={{ paddingBottom: 4 }}>
          Hey {user.name}, welcome to your profile 👋
        </Typography>
        <Paper sx={{ padding: "1rem 2rem" }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={6}>
              {/* Profile Picture */}
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar sx={{ height: 100, width: 100, marginBottom: 2 }} src={user.image} alt={user.name} />
              </Box>
              <ProfilePictureUpload email={formData.email} />

              {error && <Alert severity="error">{error}</Alert>}
              {successMessage && <Alert severity="success">{successMessage}</Alert>}

              {/* User Profile Form */}
              <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField required fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleFormChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField required fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleFormChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField required fullWidth type="email" label="Email" name="email" value={formData.email} onChange={handleFormChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth type="password" label="Password" name="password" value={formData.password} onChange={handleFormChange} helperText="Leave blank to keep current password" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth type="password" label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleFormChange} helperText="Leave blank to keep current password" />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox name="receiveEmails" checked={formData.receiveEmails} onChange={handleFormChange} color="primary" />} label="Receive detection & Response analytics emails" />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading.update} startIcon={loading.update ? <CircularProgress size={20} /> : null}>
                      {loading.update ? "Saving..." : "Save Changes"}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              {/* 2FA Toggle */}
              <Box sx={{ marginTop: 4 }}>
                <TwoFactorToggle email={formData.email} />
              </Box>

              {/* Login Logs */}
              <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6">Login Logs</Typography>
                {loginLogs.length > 0 ? (
                  <ul>
                    {loginLogs.map((log, index) => (
                      <li key={index}>
                        <strong>IP Address:</strong> {log.ipAddress}, <strong>Device:</strong> {log.deviceDetails}, <strong>API Accessed:</strong> {log.apiAccessed}, <strong>Time:</strong> {new Date(log.loginTime).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body2">No login logs available</Typography>
                )}
              </Box>

              {/* Device Management */}
              <Box sx={{ marginTop: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowDevices(true)}
                >
                  Manage Devices
                </Button>
              </Box>

              {/* Account Deletion */}
              <Box sx={{ marginTop: 4 }}>
                <Button variant="contained" color="error" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </Box>

              {/* Device Management Modal */}
              <Dialog
                open={showDevices}
                onClose={() => setShowDevices(false)}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>Device Management</DialogTitle>
                <DialogContent>
                  <DeviceManagement userId={user.id ?? 0} />
                </DialogContent>
              </Dialog>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default (ProfilePage);
