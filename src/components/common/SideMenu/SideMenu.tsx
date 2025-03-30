import React, { useState } from "react";
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  IconButton, 
  useTheme,
  Tooltip
} from "@mui/material";
import { 
  ChevronLeft, 
  ChevronRight,
  Home,
  Person,
  Security,
  ExitToApp,
  Equalizer,
  Report,
  WarningAmber,
  Settings,
  Traffic
} from "@mui/icons-material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { logout } from '@/services/authService';

// Define interface for menu items
interface MenuItem {
  route: string;
  label: string;
  icon: React.ReactNode;
  isSignOut?: boolean;
}

// Props interface
interface SideMenuProps {
  onToggle: (open: boolean) => void;
  drawerWidthOpen: number;
  drawerWidthClosed: number;
  isMobile?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ 
  drawerWidthOpen, 
  drawerWidthClosed,
  onToggle,
  isMobile = false 
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(!isMobile);

  // Define menu items
  const menuItems: MenuItem[] = [
    { route: "", label: "Home", icon: <Home fontSize="large" /> },
    { route: "data-entry", label: "Data Entry", icon: <Equalizer fontSize="small" /> },
    { route: "profilePage", label: "Profile", icon: <Person fontSize="large" /> },
    { route: "incident", label: "Incidents", icon: <Security fontSize="large" /> },
    { route: "network-traffic", label: "Network Traffic", icon: <Traffic fontSize="large" /> },
    { route: "reports", label: "Reports", icon: <Report fontSize="large" /> },
    { route: "threats", label: "Threats", icon: <WarningAmber fontSize="large" /> },
    { route: "settings", label: "Settings", icon: <Settings fontSize="large" /> },
    { route: "", label: "Sign Out", icon: <ExitToApp fontSize="large" />, isSignOut: true }
  ];

  // Toggle drawer open/closed
  const handleDrawerToggle = () => {
    const newOpenState = !open;
    setOpen(newOpenState);
    onToggle(newOpenState);
  };

  // Check if current route is active
  const isActiveRoute = (route: string) => 
    router.pathname === `/dashboard${route ? `/${route}` : ''}`;

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      // Get token - try both possible names
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('authToken') || '';
      
      // Call logout service
      const success = await logout(authToken);
      
      // Always redirect to login page, even if server logout failed
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout handler failed:', error);
      
      // Fallback - force clear storage and redirect anyway
      localStorage.clear(); // Clear everything just to be safe
      router.push('/auth/login');
    }
  };
  
  const forceClientLogout = () => {
    console.log("Forcing client-side logout");
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    router.push('/auth/login');
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={isMobile ? handleDrawerToggle : undefined}
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          boxSizing: 'border-box',
          position: isMobile ? 'fixed' : 'fixed',
          top: 56,
          bottom: 0,
          // Remove the default border when closed
          borderRight: open ? undefined : 'none',
          // On mobile, hide the drawer when closed
          transform: isMobile && !open ? 'translateX(-100%)' : 'none',
          [theme.breakpoints.down('sm')]: {
            top: 56,
          },
          transition: theme.transitions.create(['width', 'transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <List sx={{ py: 0 }}>
        {/* Drawer Toggle Button - Only show on desktop */}
        {!isMobile && (
          <ListItem disablePadding sx={{ justifyContent: 'flex-end' }}>
            <ListItemButton
              onClick={handleDrawerToggle}
              sx={{ 
                minHeight: 48,
                px: 1.5,
                justifyContent: 'flex-end',
                '&:hover': { backgroundColor: 'transparent' }
              }}
            >
              <IconButton 
                disableRipple 
                sx={{ 
                  p: 0,
                  transform: open ? 'translateX(8px)' : 'none',
                  transition: 'transform 0.3s ease'
                }}
              >
                {open ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            </ListItemButton>
          </ListItem>
        )}
        
        <Divider sx={{ my: 0.5 }} />

        {/* Menu Items */}
        {menuItems.map((item) => (
          <React.Fragment key={item.label}>
            {item.isSignOut ? (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleSignOut}  // Add this click handler
                  onDoubleClick={forceClientLogout}  // Add the backup method too
                  sx={{
                    justifyContent: open ? 'flex-start' : 'center',
                    px: 1.5,
                    minHeight: 48,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.action.selected + '!important',
                      borderRight: open ? `2px solid ${theme.palette.primary.main}` : 'none'
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.error.light + '!important', // Use error color for signout
                    }
                  }}
                >
                  <Tooltip title={open ? '' : item.label} placement="right">
                    <ListItemIcon sx={{ 
                      minWidth: 0, 
                      mr: open ? 2 : 'auto',
                      color: 'error.main'
                    }}>
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                  {open && (
                    <ListItemText
                      primary={item.label}
                      sx={{ 
                        color: 'error.main',
                        '& .MuiTypography-root': {
                          fontWeight: 300,
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ) : (
              <NextLink
                href={`/dashboard/${item.route}`}
                passHref
                legacyBehavior
                key={item.label}
              >
                <ListItemButton
                  component="a"
                  selected={isActiveRoute(item.route)}
                  sx={{
                    justifyContent: open ? 'flex-start' : 'center',
                    px: 1.5,
                    minHeight: 48,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.action.selected + '!important',
                      borderRight: `2px solid ${theme.palette.primary.main}`
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover + '!important'
                    }
                  }}
                >
                  <Tooltip title={open ? '' : item.label} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        color: isActiveRoute(item.route) 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                  {open && (
                    <ListItemText
                      primary={item.label}
                      sx={{
                        '& .MuiTypography-root': {
                          fontWeight: isActiveRoute(item.route) ? 600 : 400,
                          fontSize: '0.875rem',
                          color: isActiveRoute(item.route)
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary
                        }
                      }}
                    />
                  )}
                </ListItemButton>
              </NextLink>
            )}
            <Divider sx={{ my: 0.5 }} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default SideMenu;