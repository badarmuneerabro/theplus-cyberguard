import React from "react";
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider,
  Chip
} from "@mui/material";
import { 
  ErrorOutline, 
  WarningAmber, 
  InfoOutlined 
} from "@mui/icons-material";

type Severity = 'critical' | 'high' | 'medium' | 'low';

const Insights = () => {
  const insights = [
    { 
      title: "Excessive Quarantine", 
      description: "42 of quarantined emails are unusually high.", 
      severity: "high",
      timestamp: "2h ago"
    },
    { 
      title: "Email Security Vulnerability", 
      description: "DNS Records issue identified and email security not enabled.", 
      severity: "critical",
      timestamp: "4h ago"
    },
    { 
      title: "Cloud Directory Setup Required", 
      description: "Sync your Cloud Directory to activate user protection.", 
      severity: "medium",
      timestamp: "12h ago"
    },
  ];

  const getSeverityIcon = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return <ErrorOutline sx={{ color: "#f44336" }} />;
      case 'high':
        return <ErrorOutline sx={{ color: "#ff9800" }} />;
      case 'medium':
        return <ErrorOutline sx={{ color: "#ffeb3b" }} />;
      case 'low':
        return <ErrorOutline sx={{ color: "#4caf50" }} />;
      default:
        return <ErrorOutline />;
    }
  };

  const getSeverityChip = (severity: string) => {
    const chipProps = {
      size: "small" as "small",
      sx: { 
        height: 20, 
        fontSize: '0.7rem', 
        fontWeight: 'bold' 
      }
    };

    switch (severity) {
      case 'critical':
        return <Chip label="CRITICAL" color="error" {...chipProps} />;
      case 'high':
        return <Chip label="HIGH" color="warning" {...chipProps} />;
      case 'medium':
      default:
        return <Chip label="MEDIUM" color="info" {...chipProps} />;
    }
  };

  return (
    <Box 
      sx={{ 
        backgroundColor: '#1a2035',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
        height: '100%'
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          pb: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#5cffb4', 
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Security Insights
        </Typography>
        <Chip 
          label={`${insights.length} Issues`} 
          size="small" 
          sx={{ 
            backgroundColor: 'rgba(92, 255, 180, 0.2)', 
            color: '#5cffb4',
            height: 20,
            fontSize: '0.75rem'
          }} 
        />
      </Box>

      <List sx={{ py: 0 }}>
        {insights.map((insight, index) => (
          <React.Fragment key={index}>
            <ListItem 
              alignItems="flex-start" 
              sx={{ 
                py: 2,
                px: 2,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                {getSeverityIcon(insight.severity as Severity)}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 'medium',
                        fontSize: '0.95rem',
                        mr: 1
                      }}
                    >
                      {insight.title}
                    </Typography>
                    {getSeverityChip(insight.severity)}
                  </Box>
                } 
                secondary={
                  <Box>
                    <Typography 
                      sx={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        fontSize: '0.85rem',
                        display: 'block',
                        mb: 0.75
                      }}
                    >
                      {insight.description}
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: 'rgba(255,255,255,0.5)', 
                        fontSize: '0.75rem'
                      }}
                    >
                      {insight.timestamp}
                    </Typography>
                  </Box>
                }
                disableTypography
              />
            </ListItem>
            {index < insights.length - 1 && (
              <Divider 
                variant="inset" 
                component="li" 
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.08)'
                }} 
              />
            )}
          </React.Fragment>
        ))}
      </List>
      
      <Box 
        sx={{ 
          p: 1.5, 
          pt: 1,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}
      >
        <Typography 
          sx={{ 
            color: '#5cffb4', 
            fontSize: '0.8rem',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          View All Security Insights
        </Typography>
      </Box>
    </Box>
  );
};

export default Insights;