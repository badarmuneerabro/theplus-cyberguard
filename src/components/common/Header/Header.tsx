import * as React from "react";
import NotificationService from "@/services/notificationService";
import {
  AppBar,
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Badge, 
  Container, 
  Avatar, 
  Tooltip, 
  Menu, 
  MenuItem, 
  Popover, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Button
} from "@mui/material";
import springAxios from 'axios';
import AdbIcon from "@mui/icons-material/Adb";
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import NextLink from "next/link";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { API_CONFIG } from "@/config/apiConfig";

// Mock threat data (use real API later)
const mockThreatData = {
  threatLevel: 'HIGH',
  activeThreatCount: 5,
  threats: [
    { id: 1, type: 'Malware', severity: 'HIGH', target: 'Database Server' },
    { id: 2, type: 'Suspicious Traffic', severity: 'MEDIUM', target: 'Web Application' }
  ]
};

export type HeaderProps = {
  ColorModeContext: React.Context<{ toggleColorMode: () => void }>;
};

const Header = (props: HeaderProps) => {
  const { ColorModeContext } = props;
  const theme = useTheme();
  const router = useRouter();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [anchorElNotification, setAnchorElNotification] = React.useState<null | HTMLElement>(null);
  const openNotifications = Boolean(anchorElNotification);
  
  // Notification state
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNotificationClose = () => {
    setAnchorElNotification(null);
  };

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotification(event.currentTarget);
  };

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST}`);
      const data = response.data;
      setNotifications(data);
      setUnreadCount(data.filter((n: { read: any; }) => !n.read).length);  // Calculate unread notifications
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  // Replace the WebSocket useEffect with this updated version
React.useEffect(() => {
  const authToken = localStorage.getItem('authToken');
  let ws: WebSocket | null = null;
  let reconnectTimeout: NodeJS.Timeout;
  let attemptCount = 0;
  const MAX_ATTEMPTS = 3; // Limit reconnection attempts

  const connectWebSocket = () => {
    if (!authToken) return;

    try {
      // Only try to connect in production or if explicitly enabled
      const enableWebsocket = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true';
      if (process.env.NODE_ENV !== 'production' && !enableWebsocket) {
        console.log('WebSocket disabled in development mode');
        return;
      }

      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = process.env.NEXT_PUBLIC_WS_HOST || window.location.host;
      const wsUrl = `${wsProtocol}//${wsHost}/api/notification-service/ws?token=${encodeURIComponent(authToken)}`;
      
      console.log('Attempting WebSocket connection to:', wsUrl);
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection established');
        attemptCount = 0; // Reset counter on successful connection
      };

      ws.onmessage = (event) => {
        try {
          const newNotification = JSON.parse(event.data);
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (attemptCount < MAX_ATTEMPTS) {
          attemptCount++;
          console.log(`WebSocket reconnect attempt ${attemptCount}/${MAX_ATTEMPTS}`);
          reconnectTimeout = setTimeout(connectWebSocket, 5000);
        } else {
          console.log('Maximum WebSocket reconnection attempts reached');
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.reason || 'Connection closed');
        if (!event.wasClean && attemptCount < MAX_ATTEMPTS) {
          attemptCount++;
          console.log(`WebSocket reconnect attempt ${attemptCount}/${MAX_ATTEMPTS}`);
          reconnectTimeout = setTimeout(connectWebSocket, 5000);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  };

  // Small delay before attempting connection
  const initTimeout = setTimeout(connectWebSocket, 2000);

  return () => {
    clearTimeout(initTimeout);
    clearTimeout(reconnectTimeout);
    if (ws) {
      ws.close(1000, 'Component unmounted');
    }
  };
}, []);

  if (!isClient) {
    return null;
  }

  const NotificationPopover = () => (
    <Popover
      open={openNotifications}
      anchorEl={anchorElNotification}
      onClose={handleNotificationClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 1, '& .MuiPopover-paper': { borderRadius: 2, boxShadow: theme.shadows[8] }}}
    >
      <Box sx={{ width: 400 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          <Box>
            <Button size="small" onClick={() => fetchNotifications()} sx={{ mr: 1 }}>
              Refresh
            </Button>
            <IconButton onClick={handleNotificationClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {notifications.map(notification => (
            <React.Fragment key={notification.id}>
              <ListItem
                button
                sx={{
                  bgcolor: notification.read ? undefined : theme.palette.action.selected,
                  '&:hover': { bgcolor: theme.palette.action.hover }
                }}
                onClick={() => markAsRead(notification.id)}
              >
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">{notification.message}</Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.timestamp).toLocaleString()}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{
                    fontWeight: notification.read ? 'normal' : 'bold'
                  }}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Popover>
  );

  return (
    <AppBar position="sticky" sx={{ top: 0, zIndex: 1201 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              CyberGuard
            </Typography>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Action Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            
            {/* Theme Toggle */}
            <ThemeToggleButton ColorModeContext={ColorModeContext} />

            {/* User Profile */}
            <Tooltip title="Open profile settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ width: 32, height: 32 }} />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton onClick={handleOpenNotifications}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <NextLink href="/dashboard/profilePage" style={{ color: theme.palette.text.primary, textDecoration: "none" }}>
                  <Typography textAlign="center">Profile</Typography>
                </NextLink>
              </MenuItem>
            </Menu>
          </Box>

          {/* Notification Popover */}
          <NotificationPopover />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
