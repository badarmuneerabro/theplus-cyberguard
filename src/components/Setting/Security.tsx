import React, { useState } from "react";
import { Paper, Box, Typography, Button } from "@mui/material";
import ToggleSwitch from "./ToggleSwitch";
import { Lock } from "@mui/icons-material";

const Security = () => {
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <Box>
      <Typography variant={"h4"} sx={{ paddingBottom: 2 }}>
      </Typography>
      <Paper sx={{ padding: "1rem 2rem" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Lock />
          <Typography variant="h6">Two-Factor Authentication</Typography>
        </Box>
        <ToggleSwitch
          label="Enable Two-Factor Authentication"
          isOn={twoFactor}
          onToggle={() => setTwoFactor(!twoFactor)}
        />
        <Box sx={{ marginTop: "1rem" }}>
          <Button variant="contained" color="primary">
            Change Password
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Security;
