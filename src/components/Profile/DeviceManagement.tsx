import React, { useState } from 'react';
import { Button, TextField, Grid, Typography } from '@mui/material';
import springAxios from 'axios';
import { API_CONFIG } from '@/config/apiConfig';

interface Device {
  id: number;
  userId: number;
  deviceName: string;
  deviceType: string;
  status: string;
}

interface DeviceManagementProps {
  userId: number;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ userId }) => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [device, setDevice] = useState<Device | null>(null);

  const registerDevice = async (deviceName: string, deviceType: string) => {
    try {
      const response = await springAxios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DEVICE_MANAGEMENT.REGISTER}`, null, {
        params: { userId, deviceName, deviceType }
      });
      return response.data;
    } catch (error) {
      console.error('Error registering device:', error);
      throw error;
    }
  };

  const updateDeviceStatus = async (deviceId: number, status: string) => {
    try {
      const response = await springAxios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DEVICE_MANAGEMENT.UPDATE_STATUS(deviceId)}`,
        null,
        { params: { status } }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating device status:', error);
      throw error;
    }
  };

  const handleRegisterDevice = async () => {
    try {
      const newDevice = await registerDevice(deviceName, deviceType);
      setDevice(newDevice);
      alert(`Device registered: ${newDevice.deviceName}`);
    } catch (error) {
      alert('Failed to register device');
    }
  };

  const handleUpdateDeviceStatus = async (deviceId: number, status: string) => {
    try {
      const updatedDevice = await updateDeviceStatus(deviceId, status);
      setDevice(updatedDevice);
      alert(`Device status updated to: ${updatedDevice.status}`);
    } catch (error) {
      alert('Failed to update device status');
    }
  };

  return (
    <div>
      <Typography variant="h4">Device Management</Typography>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <TextField
            label="Device Name"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label="Device Type"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleRegisterDevice}>
            Register Device
          </Button>
        </Grid>
        {device && (
          <Grid item>
            <Typography variant="h6">Registered Device</Typography>
            <Typography>Name: {device.deviceName}</Typography>
            <Typography>Type: {device.deviceType}</Typography>
            <Typography>Status: {device.status}</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleUpdateDeviceStatus(device.id, 'Active')}
            >
              Set Device as Active
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default DeviceManagement;
