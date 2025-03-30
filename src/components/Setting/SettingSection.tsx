import React, { FC, ReactNode } from "react";
import { Paper, Box, Typography } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

type SettingSectionProps = {
  icon: SvgIconComponent;
  title: string;
  children: ReactNode;
};

const SettingSection: FC<SettingSectionProps> = ({ icon: Icon, title, children }) => {
  return (
    <Paper sx={{ padding: "1rem 2rem", marginBottom: "2rem" }}>
      <Box display="flex" alignItems="center" gap={2} sx={{ marginBottom: "1rem" }}>
        <Icon />
        <Typography variant="h6">{title}</Typography>
      </Box>
      {children}
    </Paper>
  );
};

export default SettingSection;
