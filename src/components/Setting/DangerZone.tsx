import React from "react";
import { Paper, Box, Typography, Button } from "@mui/material";
import { Delete as Trash } from "@mui/icons-material";


const DangerZone = () => {
  return (
    <Box>
      <Typography variant={"h4"} sx={{ paddingBottom: 2 }}>
      
      </Typography>
      <Paper sx={{ padding: "1rem 2rem" }}>
        <Box display="flex" alignItems="center" gap={2} sx={{ marginBottom: "1rem" }}>
          <Trash />
          <Typography variant="h5" sx={{ color: "#dc2626" }}>
            Delete Account
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ marginBottom: "1rem", color: "#1d5db" }}>
          Permanently delete your account and all of your content.
        </Typography>
        <Button variant="contained" color="error">
          Delete Account
        </Button>
      </Paper>
    </Box>
  );
};

export default DangerZone;
