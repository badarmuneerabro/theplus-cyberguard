import React, { useEffect, useState, Suspense } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";


// Dynamically load components
const DataRibbon = dynamic(() => import("@/components/Dashboard/DataRibbon/DataRibbon"), { ssr: false });
const IssuesByRisk = dynamic(() => import("@/components/Dashboard/Issues/IssuesByRisk"), { ssr: false });
const Insights = dynamic(() => import("@/components/Dashboard/Insights/Insights"), { ssr: false });
const CoverageIssuesChart = dynamic(() => import("@/components/Dashboard/CoverageIssuesChart/CoverageIssuesChart"), { ssr: false });
const NetworkTrafficAnalysis = dynamic(() => import('@/components/NetworkTrafficAnalysis/NetworkTrafficAnalysis'), { ssr: false });
//const DataPreprocessingDashboard = dynamic(() => import('@/components/DataPreprocessingDashboard/DataPreprocessingDashboard'), { ssr: false });

const Dashboard = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 0.1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Suspense fallback={<div>Loading Data Ribbon...</div>}>
              <DataRibbon />
            </Suspense>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', padding: 2 }}>
            <Typography variant="h6">Customers</Typography>
            
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: 2, height: '100%' }}>
            <Typography variant="h6">Coverage & Issues by Security Control</Typography>
            <Suspense fallback={<div>Loading Coverage Issues...</div>}>
              <CoverageIssuesChart />
            </Suspense>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 2, height: '100%' }}>
            <Typography variant="h6">Issues by Risk</Typography>
            <Suspense fallback={<div>Loading Issues...</div>}>
              <IssuesByRisk />
            </Suspense>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Insights</Typography>
            <Suspense fallback={<div>Loading Insights...</div>}>
              <Insights />
            </Suspense>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Network Traffic Analysis</Typography>
            <Suspense fallback={<div>Loading Network Traffic...</div>}>
              <NetworkTrafficAnalysis />
            </Suspense>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Data Preprocessing Dashboard</Typography>
            <Suspense fallback={<div>Loading Data Preprocessing...</div>}>
              {/* { <DataPreprocessingDashboard /> } */}
            </Suspense>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
