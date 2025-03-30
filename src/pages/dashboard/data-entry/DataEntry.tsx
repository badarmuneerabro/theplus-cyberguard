import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import Layout from '@/components/Layout';

const DataEntry: React.FC = () => {
  // Incident data state
  const [incidentData, setIncidentData] = useState({
    caseId: '',
    type: '',
    severity: '',
    description: '',
    reportedBy: '',
    assignedTo: '',
    status: '',
    impact: '',
    affectedAssets: '',
    rootCause: '',
    resolutionSummary: '',
  });

  // Network traffic data state
  const [networkTrafficData, setNetworkTrafficData] = useState({
    sourceIp: '',
    sourcePort: '',
    destinationIp: '',
    destinationPort: '',
    protocol: '',
    label: '',
    packetCount: 0,
    bytesTransferred: 0,
    flags: '',
    capturedTimestamp: '',
    sourceGeolocation: '',
    destinationGeolocation: '',
  });

  // Threat data state
  const [threatData, setThreatData] = useState({
    type: '',
    description: '',
    severity: '',
    source: '',
    indicatorsOfCompromise: '',
    status: '',
    detectedTimestamp: '',
    affectedAssets: '',
    remediationSteps: '',
  });

  // Handle input changes for forms
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setData: Function
  ) => {
    const { name, value } = event.target;
    setData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle select change for dropdowns
  const handleSelectChange = (
    event: SelectChangeEvent<string>,
    setData: Function
  ) => {
    const { name, value } = event.target;
    setData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submissions
  const handleSubmit = async (event: React.FormEvent, data: any, endpoint: string) => {
    event.preventDefault();
    try {
      const response = await axios.post(endpoint, data);
      console.log('Data submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Entry</h1>

      {/* Incident Data Entry Form */}
      <form onSubmit={(event) => handleSubmit(event, incidentData, '/api/incidents')}>
        <h2 className="text-xl font-semibold mb-2">Incident Data Entry</h2>
        <Grid container spacing={3}>
          {/* Form fields for Incident data entry */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Case ID"
              name="caseId"
              value={incidentData.caseId}
              onChange={(e) => handleInputChange(e, setIncidentData)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={incidentData.type}
                onChange={(e) => handleSelectChange(e, setIncidentData)}
              >
                <MenuItem value="Network Attack">Network Attack</MenuItem>
                <MenuItem value="Malware">Malware</MenuItem>
                <MenuItem value="Data Breach">Data Breach</MenuItem>
                {/* Add more types as needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Severity</InputLabel>
              <Select
                name="severity"
                value={incidentData.severity}
                onChange={(e) => handleSelectChange(e, setIncidentData)}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={incidentData.description}
              onChange={(e) => handleInputChange(e, setIncidentData)}
              fullWidth
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Reported By"
              name="reportedBy"
              value={incidentData.reportedBy}
              onChange={(e) => handleInputChange(e, setIncidentData)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Assigned To"
              name="assignedTo"
              value={incidentData.assignedTo}
              onChange={(e) => handleInputChange(e, setIncidentData)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Impact"
              name="impact"
              value={incidentData.impact}
              onChange={(e) => handleInputChange(e, setIncidentData)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Affected Assets"
              name="affectedAssets"
              value={incidentData.affectedAssets}
              onChange={(e) => handleInputChange(e, setIncidentData)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Root Cause"
              name="rootCause"
              value={incidentData.rootCause}
              onChange={(e) => handleInputChange(e, setIncidentData)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Resolution Summary"
              name="resolutionSummary"
              value={incidentData.resolutionSummary}
              onChange={(e) => handleInputChange(e, setIncidentData)}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" className="mt-4">
              Submit Incident Data
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Network Traffic Data Entry Form */}
      <form onSubmit={(event) => handleSubmit(event, networkTrafficData, '/api/network/traffic')}>
        <h2 className="text-xl font-semibold mt-6 mb-2">Network Traffic Data Entry</h2>
        <Grid container spacing={3}>
          {/* Form fields for Network Traffic data entry */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Source IP"
              name="sourceIp"
              value={networkTrafficData.sourceIp}
              onChange={(e) => handleInputChange(e, setNetworkTrafficData)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
              <TextField
                label="Destination IP"
                name="destinationIp"
                value={networkTrafficData.destinationIp}
                onChange={(e) => handleInputChange(e, setNetworkTrafficData)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Destination Port"
                name="destinationPort"
                value={networkTrafficData.destinationPort}
                onChange={(e) => handleInputChange(e, setNetworkTrafficData)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Protocol"
                name="protocol"
                value={networkTrafficData.protocol}
                onChange={(e) => handleInputChange(e, setNetworkTrafficData)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Label"
                name="label"
                value={networkTrafficData.label}
                onChange={(e) => handleInputChange(e, setNetworkTrafficData)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Packet Count"
                name="packetCount"
                type="number"
                value={networkTrafficData.packetCount}
                onChange={(e) => handleInputChange(e, setNetworkTrafficData)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Bytes Transferred"
                name="bytesTransferred"
                type="number"
                value={networkTrafficData.bytesTransferred}
                onChange={(e) => handleInputChange(e, setNetworkTrafficData)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Flags"
                name="flags"
                value={networkTrafficData.flags}
                onChange={(e) => handleInputChange(e, setNetworkTrafficData)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Captured Timestamp"
                name="capturedTimestamp"
                type="datetime-local"
                value={networkTrafficData.capturedTimestamp}
                onChange={(e) => handleInputChange(e, setNetworkTrafficData)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Source Geolocation"
                name="sourceGeolocation"
                value={networkTrafficData.sourceGeolocation}
                onChange={(e) => handleInputChange(e, setNetworkTrafficData)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Destination Geolocation"
                name="destinationGeolocation"
                value={networkTrafficData.destinationGeolocation}
                onChange={(e) => handleInputChange(e, setNetworkTrafficData)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Source IP"
                name="sourceIp"
                value={networkTrafficData.sourceIp}
                onChange={(e) => handleInputChange(e, setNetworkTrafficData)}
                fullWidth
                required
              />
            </Grid>
          {/* Continue adding fields... */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" className="mt-4">
              Submit Network Traffic Data
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Threat Data Entry Form */}
      <form onSubmit={(event) => handleSubmit(event, threatData, '/api/threats')}>
        <h2 className="text-xl font-semibold mt-6 mb-2">Threat Data Entry</h2>
        <Grid container spacing={3}>
          {/* Form fields for Threat data entry */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={incidentData.type}
                onChange={(e) => handleSelectChange(e, setIncidentData)}
              >
                <MenuItem value="Network Attack">Network Attack</MenuItem>
                <MenuItem value="Malware">Malware</MenuItem>
                <MenuItem value="Data Breach">Data Breach</MenuItem>
                {/* Add more types as needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Severity</InputLabel>
              <Select
                name="severity"
                value={incidentData.severity}
                onChange={(e) => handleSelectChange(e, setIncidentData)}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={threatData.description}
                onChange={(e) => handleInputChange(e, setThreatData)}
                fullWidth
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Source"
                name="source"
                value={threatData.source}
                onChange={(e) => handleInputChange(e, setThreatData)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Indicators of Compromise"
                name="indicatorsOfCompromise"
                value={threatData.indicatorsOfCompromise}
                onChange={(e) => handleInputChange(e, setThreatData)}
                fullWidth
                multiline
                rows={2}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Status"
                name="status"
                value={threatData.status}
                onChange={(e) => handleInputChange(e, setThreatData)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Detected Timestamp"
                name="detectedTimestamp"
                type="datetime-local"
                value={threatData.detectedTimestamp}
                onChange={(e) => handleInputChange(e, setThreatData)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Affected Assets"
                name="affectedAssets"
                value={threatData.affectedAssets}
                onChange={(e) => handleInputChange(e, setThreatData)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Remediation Steps"
                name="remediationSteps"
                value={threatData.remediationSteps}
                onChange={(e) => handleInputChange(e, setThreatData)}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          {/* Continue adding fields... */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" className="mt-4">
              Submit Threat Data
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default DataEntry;
