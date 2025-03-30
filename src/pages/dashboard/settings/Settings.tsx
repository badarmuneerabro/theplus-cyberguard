import React from 'react';
import { Container, Box } from '@mui/material'; // Import only the necessary components
import ConnectedAccounts from "@/components/Setting/ConnectedAccounts";
import DangerZone from "@/components/Setting/DangerZone";
import Notifications from "@/components/Setting/Notifications";
import UserProfile from "@/components/Setting/UserProfile";
import Security from "@/components/Setting/Security";


const Settings = () => {
  return (
    <Box className="flex-1 overflow-auto relative z-10 bg-gray-900"> {/* Use Box from MUI for flexibility */}
      <Container className='max-w-4xl mx-auto py-6 px-4 lg:px-8'> 
        <UserProfile />
        <Notifications />
        <Security />
        <ConnectedAccounts />
        <DangerZone />
      </Container>
    </Box>
  );
};

export default Settings;
