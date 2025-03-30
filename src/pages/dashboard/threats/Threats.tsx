import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid } from "@mui/material";
import { springAxios } from '@/config/axiosConfig';
import ChartComponent from '@/components/ChartComponent';
import TableComponent from '@/components/TableComponent';

// Define types for each piece of data
interface TopThreatSource {
  source: string;
  count: number;
  [key: string]: string | number; // Add index signature to match ChartData requirements
}

interface HistoricalAttackData {
  date: string;
  count: number;
  [key: string]: string | number; // Add index signature to match ChartData requirements
}

interface MostFrequentIoCs {
  indicator: string;
  count: number;
  [key: string]: string | number; // Add index signature to match ChartData requirements
}

interface ThreatTypesOverTime {
  date: string;
  type: string;
  count: number;
  [key: string]: string | number; // Add index signature to match ChartData requirements
}

interface GeolocationOfThreats {
  location: string;
  count: number;
  [key: string]: string | number; // Add index signature to match ChartData requirements
}

interface ThreatData {
  topThreatSources: TopThreatSource[];
  historicalAttackData: HistoricalAttackData[];
  mostFrequentIoCs: MostFrequentIoCs[];
  threatTypesOverTime: ThreatTypesOverTime[];
  geolocationOfThreats: GeolocationOfThreats[];
}

interface IoC {
  id: number;
  type: string;
  description: string;
  severity: string;
  source: string;
  indicatorsOfCompromise: string;
  status: string;
  detectedTimestamp: string;
  affectedAssets: string;
  remediationSteps: string;
}

const Threats: React.FC = () => {
  const [threatData, setThreatData] = useState<ThreatData | null>(null);
  const [iocData, setIocData] = useState<IoC[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch threat data and IoCs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [threatResponse, iocResponse] = await Promise.all([
          springAxios.get('/threats'),
          springAxios.get('/iocs'),
        ]);

        setThreatData(threatResponse.data);
        setIocData(iocResponse.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Typography>Loading data...</Typography>;

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
      <Typography variant="h4" sx={{ paddingBottom: 2 }}>
        Threat Intelligence Dashboard
      </Typography>

      {threatData && (
        <>
          {/* Top Threat Sources & Historical Attack Data */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Top Threat Sources</Typography>
                <ChartComponent
                  title="Top Threat Sources"
                  data={threatData.topThreatSources}
                  type="pie"
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Historical Attack Data</Typography>
                <ChartComponent
                  title="Historical Attack Data"
                  data={threatData.historicalAttackData}
                  type="line"
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Most Frequent IoCs & Threat Types Over Time */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Most Frequent IoCs</Typography>
                <ChartComponent
                  title="Most Frequent IoCs"
                  data={threatData.mostFrequentIoCs}
                  type="bar"
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Threat Types Over Time</Typography>
                <ChartComponent
                  title="Threat Types Over Time"
                  data={threatData.threatTypesOverTime}
                  type="area"
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Indicators of Compromise Table */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Indicators of Compromise (IoCs)</Typography>
                <TableComponent title="IoC Details" data={iocData} onDelete={() => {}} />
              </Paper>
            </Grid>
          </Grid>

          {/* Threat Source Analysis */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Threat Source Analysis</Typography>
                <ChartComponent
                  title="Geolocation of Threats"
                  data={threatData.geolocationOfThreats}
                  type="geo"
                />
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Threats;
