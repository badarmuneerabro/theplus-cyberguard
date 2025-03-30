import { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import springAxios from 'axios';

const apiGatewayUrl = '';  // API Gateway URL


const TwoFactorToggle = ({ email }: { email: string }) => {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  useEffect(() => {
    // Fetch the current 2FA status from the backend
    springAxios.get(`/api/profile/${email}/2fa-status`).then(response => {
      setIsTwoFactorEnabled(response.data.isTwoFactorEnabled);
    });
  }, [email]);

  const handleToggle = async () => {
    try {
      const response = await springAxios.post(`/api/profile/${email}/toggle-2fa`);
      setIsTwoFactorEnabled(response.data.isTwoFactorEnabled);
    } catch (error) {
      console.error('Error toggling 2FA:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Two-Factor Authentication</Typography>
      <Button
        onClick={handleToggle}
        variant="contained"
        color={isTwoFactorEnabled ? 'success' : 'error'}
      >
        {isTwoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
      </Button>
    </div>
  );
};

export default TwoFactorToggle;
