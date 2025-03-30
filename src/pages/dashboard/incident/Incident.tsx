// src/pages/dashboard/incident.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, Grid } from "@mui/material";
import IncidentTableComponent from '@/components/IncidentTableComponent'; 
import ChartComponent from '@/components/ChartComponent';
import IncidentTimelineComponent from '@/components/IncidentTimelineComponent';

interface IncidentLog {
  id: number;
  type: string;
  severity: string;
  status: string;
  detectedAt: string;
  resolvedAt: string;
}

interface IncidentSeverity {
  severity: string;
  count: number;
}

interface IncidentResponseMetric {
  metric: string;
  value: number;
}

const Incident: React.FC = () => {
  const [incidentLogs, setIncidentLogs] = useState<IncidentLog[]>([]);
  const [severityDistribution, setSeverityDistribution] = useState<IncidentSeverity[]>([]);
  const [responseMetrics, setResponseMetrics] = useState<IncidentResponseMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIncidentData();
  }, []);

  const fetchIncidentData = async () => {
    setLoading(true);
    try {
      //const logsResponse = await axios.get<IncidentLog[]>('/api/incidents/logs');
      //const severityResponse = await axios.get<IncidentSeverity[]>('/api/incidents/severity');
      //const metricsResponse = await axios.get<IncidentResponseMetric[]>('/api/incidents/metrics');

      //setIncidentLogs(logsResponse.data);
      //setSeverityDistribution(severityResponse.data);
      //setResponseMetrics(metricsResponse.data);
    } catch (err) {
      console.error('Failed to fetch incident data:', err);
      setError('Failed to fetch incident data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: .1 }}>
      <Grid container spacing={2}>
        {/* Incident Log Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6">Incident Log</Typography>
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <IncidentTableComponent title="Incident Log" data={incidentLogs} />
            )}
          </Paper>
        </Grid>

        {/* Incident Severity Distribution Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', padding: 2 }}>
            <Typography variant="h6">Incident Severity Distribution</Typography>
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <ChartComponent 
                title="Incident Severity" 
                data={severityDistribution.map(item => ({
                  count: item.count,
                  indicator: item.severity
                }))} 
                type="pie" 
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Incident Response Metrics Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', padding: 2 }}>
            <Typography variant="h6">Incident Response Metrics</Typography>
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <ChartComponent 
                title="MTTD and MTTR" 
                data={responseMetrics.map(metric => ({
                  count: metric.value,
                  indicator: metric.metric
                }))} 
                type="bar" 
              />
            )}
          </Paper>
        </Grid>

        {/* Incident Timeline Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', padding: 2 }}>
            <Typography variant="h6">Incident Timeline</Typography>
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <IncidentTimelineComponent data={incidentLogs} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Incident;
 

/* 
import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
//import { Badge } from "@/components/ui/badge";
import { Badge, Loader, Table } from 'lucide-react';
import { TableRow, TableHead, TableBody, TableCell } from '@mui/material';


const SEVERITY_COLORS = {
  HIGH: '#ef4444',
  MEDIUM: '#f97316',
  LOW: '#22c55e'
};

const STATUS_COLORS = {
  OPEN: '#dc2626',
  IN_PROGRESS: '#f97316',
  RESOLVED: '#22c55e',
  CLOSED: '#6b7280'
};

const Incident = () => {
  const [incidentData, setIncidentData] = useState({
    recentIncidents: [],
    severityDistribution: [],
    responseTimesTrend: [],
    openIncidentsByType: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const [
          recentRes,
          severityRes,
          responseTimesRes,
          typeDistRes
        ] = await Promise.all([
          fetch('/api/incidents/recent'),
          fetch('/api/incidents/severity-distribution'),
          fetch('/api/incidents/response-times'),
          fetch('/api/incidents/type-distribution')
        ]);

        const data = {
          //recentIncidents: await recentRes.json(),
          //severityDistribution: await severityRes.json(),
          //responseTimesTrend: await responseTimesRes.json(),
          //openIncidentsByType: await typeDistRes.json()
        };

        //setIncidentData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching incident data:', error);
        setLoading(false);
      }
    };

    fetchIncidentData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Recent Incidents Table *
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Assigned To</TableHead>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidentData.recentIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell>{incident.id}</TableCell>
                  <TableCell>{incident.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      style={{ backgroundColor: SEVERITY_COLORS[incident.severity] }}
                      className="text-white"
                    >
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      style={{ backgroundColor: STATUS_COLORS[incident.status] }}
                      className="text-white"
                    >
                      {incident.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(incident.reportedTimestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{incident.assignedTo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Severity Distribution *
        <Card>
          <CardHeader>
            <CardTitle>Incident Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentData.severityDistribution}
                    dataKey="value"
                    nameKey="severity"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    label
                  >
                    {incidentData.severityDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={SEVERITY_COLORS[entry.severity]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Response Times Trend *
        <Card>
          <CardHeader>
            <CardTitle>Average Response Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incidentData.responseTimesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="responseTime" 
                    stroke="#8884d8" 
                    name="Response Time (minutes)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Incident; */