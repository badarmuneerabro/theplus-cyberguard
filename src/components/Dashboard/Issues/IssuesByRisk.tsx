/* import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const apiGatewayUrl = '';  // API Gateway URL


const IssuesByRisk = () => {
  const mockData = {
    critical: 15,
    high: 30,
    medium: 25,
    low: 30,
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6">Issues by Risk</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
        <Box sx={{ backgroundColor: '#e57373', width: `${mockData.critical}%`, height: 10 }} />
        <Box sx={{ backgroundColor: '#ffb74d', width: `${mockData.high}%`, height: 10 }} />
        <Box sx={{ backgroundColor: '#fff176', width: `${mockData.medium}%`, height: 10 }} />
        <Box sx={{ backgroundColor: '#81c784', width: `${mockData.low}%`, height: 10 }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
        <Typography variant="body2">Critical</Typography>
        <Typography variant="body2">High</Typography>
        <Typography variant="body2">Medium</Typography>
        <Typography variant="body2">Low</Typography>
      </Box>
    </Paper>
  );
};

export default IssuesByRisk;
 */



import React from "react";
import { Paper, Typography, Box, Tooltip } from "@mui/material";

const IssuesByRisk = () => {
  const issueData = {
    critical: { count: 12, percentage: 15 },
    high: { count: 24, percentage: 30 },
    medium: { count: 20, percentage: 25 },
    low: { count: 24, percentage: 30 },
  };

  return (
    <Box
      sx={{
        backgroundColor: '#1a2035',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 0 15px rgba(95, 255, 180, 0.2)',
        color: '#fff',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Cyber-style background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 5px, #5cffb4 5px, #5cffb4 6px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#5cffb4', 
          fontWeight: 'bold',
          mb: 3,
          position: 'relative',
          zIndex: 1 
        }}
      >
        Security Issues by Risk Level
      </Typography>
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginTop: 2,
          borderRadius: '5px',
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          mb: 2,
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <Tooltip title={`Critical: ${issueData.critical.count} issues`}>
            <Box 
              sx={{ 
                backgroundColor: '#ff5252', 
                width: `${issueData.critical.percentage}%`, 
                height: 16,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  filter: 'brightness(1.2)',
                  height: 20
                }
              }} 
            />
          </Tooltip>
          <Tooltip title={`High: ${issueData.high.count} issues`}>
            <Box 
              sx={{ 
                backgroundColor: '#ff9100', 
                width: `${issueData.high.percentage}%`, 
                height: 16,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  filter: 'brightness(1.2)',
                  height: 20
                }
              }} 
            />
          </Tooltip>
          <Tooltip title={`Medium: ${issueData.medium.count} issues`}>
            <Box 
              sx={{ 
                backgroundColor: '#ffea00', 
                width: `${issueData.medium.percentage}%`, 
                height: 16,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  filter: 'brightness(1.2)',
                  height: 20
                }
              }} 
            />
          </Tooltip>
          <Tooltip title={`Low: ${issueData.low.count} issues`}>
            <Box 
              sx={{ 
                backgroundColor: '#00e676', 
                width: `${issueData.low.percentage}%`, 
                height: 16,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  filter: 'brightness(1.2)',
                  height: 20
                }
              }} 
            />
          </Tooltip>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          px: 1 
        }}>
          {Object.entries(issueData).map(([level, data]) => (
            <Box key={level} sx={{ textAlign: 'center' }}>
              <Typography 
                sx={{ 
                  fontSize: '0.75rem', 
                  color: level === 'critical' ? '#ff5252' : 
                         level === 'high' ? '#ff9100' : 
                         level === 'medium' ? '#ffea00' : 
                         '#00e676',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}
              >
                {level}
              </Typography>
              <Typography sx={{ fontSize: '1rem', color: '#fff' }}>
                {data.count}
              </Typography>
            </Box>
          ))}
        </Box>
        
        <Box sx={{ mt: 2, px: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Total security issues: {Object.values(issueData).reduce((sum, item) => sum + item.count, 0)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem', mt: 1 }}>
            Last updated: {new Date().toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default IssuesByRisk;