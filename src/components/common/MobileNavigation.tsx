// components/common/MobileNavigation.tsx
import React from 'react';
import { 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import ReportIcon from '@mui/icons-material/Report';
import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/router';

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onToggle }) => {
  const router = useRouter();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Data Entry', icon: <BarChartIcon />, path: '/data-entry' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Incidents', icon: <SecurityIcon />, path: '/incidents' },
    { text: 'Network Traffic', icon: <NetworkCheckIcon />, path: '/network-traffic' },
    { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
    { text: 'Threats', icon: <BugReportIcon />, path: '/threats' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Sign Out', icon: <ExitToAppIcon />, path: '/auth/logout' }
  ];

  const navigateTo = (path: string) => {
    router.push(path);
    onToggle(false);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <IconButton
        color="inherit"
        aria-label="open menu"
        onClick={() => onToggle(true)}
        sx={{
          position: 'fixed',
          top: '70px',
          left: '10px',
          zIndex: 1200,
          backgroundColor: 'rgba(26, 32, 53, 0.7)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(26, 32, 53, 0.9)',
          }
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => onToggle(false)}
        variant="temporary"
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1a2035',
          },
        }}
      >
        <Box
          sx={{
            width: 240,
            backgroundColor: '#1a2035',
            height: '100%',
            color: 'white'
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => navigateTo(item.path)}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileNavigation;