import React from "react";
import scss from "./Footer.module.scss";
import { Box, Paper, useTheme } from "@mui/material";
import Link from "next/link";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box 
      component="footer" 
      sx={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        width: '100%', // Full width
        marginTop: 'auto', // Push to bottom
        zIndex: 10, // Ensure it's above other content
      }}
    >
      <Paper 
        sx={{ 
          width: "100%", 
          color: "#262626",
          borderRadius: 0, // Remove border radius if you want it to stretch fully
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            padding: theme.spacing(2),
          }}
        >
          <ul 
            role="menu" 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: theme.spacing(2),
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            {[
              { href: '/', label: 'Home' },
              { href: '/dashboard/data-entry', label: 'Data Entry' },
              { href: '/dashboard/profilePage', label: 'Profile' },
              { href: '/dashboard/incident', label: 'Incidents' },
              { href: '/dashboard/network-traffic', label: 'Network Traffic' },
              { href: '/dashboard/reports', label: 'Reports' },
              { href: '/dashboard/threats', label: 'Threats' },
              { href: '/dashboard/settings', label: 'Settings' },
              { href: '/#termsandconditions', label: 'Terms & Conditions' },
              { href: '/#accessibilitystatement', label: 'Accessibility Statement' },
            ].map((item) => (
              <li key={item.href} style={{ margin: '0 10px' }}>
                <Link href={item.href} passHref>
                  <Box
                    component="span" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      textDecoration: 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {item.label}
                  </Box>
                </Link>
              </li>
            ))}
          </ul>
        </Box>
      </Paper>
    </Box>
  );
};

export default Footer;