import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { API_CONFIG } from '../../../config/apiConfig';
import ChartComponent from '../../ChartComponent';
import TableComponent from '../../TableComponent';

export interface ThreatTypesOverTime {
  date: string;
  type: string;
  count: number;
}

export interface FeatureDistributionDTO {
  feature: string;
  count: number;
}

export interface ThreatData {
  topThreatSources: Array<{ name: string; value: number }> | undefined;
  threatTypesOverTime: ThreatTypesOverTime[];
  featureDistribution: FeatureDistributionDTO[];
}

interface ChartData {
  name: string;
  value: number;
}

const ThreatDashboard: React.FC = () => {
  const [threatData, setThreatData] = useState<ThreatData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreatData = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THREATS.DATA}`
        );
        setThreatData(response.data);
      } catch (err) {
        console.error('Error fetching threat data:', err);
        setError('Failed to fetch threat data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchThreatData();
  }, []);

  if (loading) return <Typography>Loading threat data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Threat Intelligence Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Top Threat Sources</Typography>
            <ChartComponent
              title="Top Threat Sources"
              data={threatData?.topThreatSources || []}
              type="pie"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Threat Types Over Time</Typography>
            <ChartComponent
              title="Threat Types Over Time"
              data={threatData?.threatTypesOverTime?.map(item => ({
                name: `${item.type} - ${item.date}`,
                value: item.count
              })) || []}
              type="line"
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Feature Distribution</Typography>
            <ChartComponent
              title="Feature Distribution"
              data={threatData?.featureDistribution?.map(item => ({
                name: item.feature,
                value: item.count
              })) || []}
              type="bar"
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Threat Data Table</Typography>
            <TableComponent 
              title="Threat Data" 
              data={threatData?.threatTypesOverTime?.map((item, index) => ({
                id: index,
                description: `${item.type} alert on ${item.date}`,
                severity: 'medium',
                source: item.type,
                detectedDate: item.date,
                status: 'active',
                ipAddress: 'unknown',
                url: 'unknown',
                type: item.type,
                count: item.count,
                // Required IoC properties
                indicatorsOfCompromise: `${item.type} with count ${item.count}`,
                detectedTimestamp: new Date(item.date).getTime().toString(),
                affectedAssets: 'unknown',
                remediationSteps: 'To be determined'
              })) || []} 
              onDelete={(id) => console.log(`Delete item with ID: ${id}`)}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThreatDashboard;