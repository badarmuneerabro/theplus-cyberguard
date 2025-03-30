import React, { useState } from "react";
import { Paper, Box, Typography } from "@mui/material";
import ToggleSwitch from "./ToggleSwitch";
import { Notifications as Bell } from "@mui/icons-material";
import NotificationService from "@/services/notificationService";

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
  });

  return (
    <Box sx={{ width: '100%' }}>  {/* Set width to 100% */}
      <Typography variant={"h4"} sx={{ paddingBottom: 2}}>
      </Typography>
      <Paper sx={{ padding: "1rem 2rem", width: '100%' }}> {/* Set Paper to full width */}
        <Box display="flex" alignItems="center" gap={2}>
          <Bell />
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <ToggleSwitch
          label="Push Notifications"
          isOn={notifications.push}
          onToggle={async () => {
            const newState = { ...notifications, push: !notifications.push };
            setNotifications(newState);
            try {
              await NotificationService.updatePreferences(newState);
            } catch (error) {
              console.error("Failed to update push notifications preference");
              setNotifications(notifications); // Revert on error
            }
          }}
        />
        <ToggleSwitch
          label="Email Notifications"
          isOn={notifications.email}
          onToggle={() => setNotifications({ ...notifications, email: !notifications.email })}
        />
        <ToggleSwitch
          label="SMS Notifications"
          isOn={notifications.sms}
          onToggle={async () => {
            const newState = { ...notifications, sms: !notifications.sms };
            setNotifications(newState);
            try {
              await NotificationService.updatePreferences(newState);
            } catch (error) {
              console.error("Failed to update SMS preference");
              setNotifications(notifications); // Revert on error
            }
          }}
        />
      </Paper>
    </Box>
  );
};

export default Notifications;
