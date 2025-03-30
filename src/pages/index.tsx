import React from 'react';
import { Button, Container, Typography, Grid, Box, Paper, IconButton, Avatar, Card, CardContent, Divider, useTheme, useMediaQuery } from "@mui/material";
import Link from "next/link";
import { Security, Speed, Build, Devices, Lock, Visibility, Cloud, Assessment, Code } from '@mui/icons-material';
import { motion } from "framer-motion";

// Define prop types for FeatureCard
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <IconButton color="primary" sx={{ mb: 2 }}>
      {icon}
    </IconButton>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Paper>
);

// Main Landing Page Component
export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    { icon: <Security fontSize="large" />, title: "Real-Time Threat Detection", description: "Advanced packet analysis and behavioral monitoring" },
    { icon: <Lock fontSize="large" />, title: "Zero-Trust Authentication", description: "JWT/OAuth2 secured access control" },
    { icon: <Visibility fontSize="large" />, title: "Activity Monitoring", description: "Comprehensive audit logs and tracking" },
    { icon: <Cloud fontSize="large" />, title: "Cloud Security", description: "Protected deployments across all platforms" },
    { icon: <Devices fontSize="large" />, title: "Device Management", description: "IoT endpoint protection & monitoring" },
    { icon: <Assessment fontSize="large" />, title: "Smart Reporting", description: "Automated PDF/Excel incident reports" },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        py: 8,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
                  CyberGuard Security Suite
                </Typography>
                <Typography variant="h5" sx={{ mb: 4 }}>
                  Next-Gen Cybersecurity for Modern Enterprises
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <Link href="/auth/signup" passHref>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      size="large"
                      sx={{ borderRadius: 2 }}
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/demo" passHref>
                    <Button 
                      variant="outlined" 
                      color="inherit" 
                      size="large"
                      sx={{ borderRadius: 2 }}
                    >
                      Live Demo
                    </Button>
                  </Link>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  p: 3,
                  position: 'relative'
                }}>
                  <Code sx={{ fontSize: 120, opacity: 0.1, position: 'absolute', right: 20, top: 20 }} />
                  <Typography variant="h6" gutterBottom>Active Protections</Typography>
                  <Grid container spacing={2}>
                    {[1, 2, 3].map((item) => (
                      <Grid item xs={4} key={item}>
                        <Card sx={{ bgcolor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
                          <CardContent>
                            <Typography variant="body2">Threat Blocked</Typography>
                            <Typography variant="h4">24/{item}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700 }}>
          Enterprise-Grade Security Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{ 
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': { 
                    boxShadow: 6,
                    bgcolor: 'action.hover'
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main', 
                      width: 56, 
                      height: 56,
                      mb: 2,
                      mx: 'auto'
                    }}>
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h5" gutterBottom>{feature.title}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" gutterBottom>99.9%</Typography>
                <Typography variant="subtitle1">Threat Detection Rate</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" gutterBottom>24/7</Typography>
                <Typography variant="subtitle1">Real-Time Monitoring</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" gutterBottom>150ms</Typography>
                <Typography variant="subtitle1">Average Response Time</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Ready to Secure Your Infrastructure?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Start your 14-day free trial today
        </Typography>
        <Link href="/auth/signup" passHref>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ 
              borderRadius: 2,
              px: 6,
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            Get Started Now
          </Button>
        </Link>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>CyberGuard</Typography>
              <Typography variant="body2" color="text.secondary">
                Enterprise cybersecurity solution powered by AI and machine learning
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" gutterBottom>Product</Typography>
            </Grid>
            {/* Add more footer columns */}
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            © 2023 CyberGuard. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
