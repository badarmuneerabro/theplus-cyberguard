// src/components/NetworkTrafficSearch.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants
} from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const apiGatewayUrl = '';  // API Gateway URL


const NetworkTrafficSearch: React.FC = () => {
  interface SearchCriteriaType {
    sourceIp: string;
    destinationIp: string;
    protocol: string;
    minPacketSize: string;
    maxPacketSize: string;
    securityFlag: string;
    startTime: Date | null;
    endTime: Date | null;
  }

  interface NetworkPacket {
    id: string | number;
    capturedTimestamp: string;
    sourceIp: string;
    sourcePort: number;
    destinationIp: string;
    destinationPort: number;
    protocol: string;
    packetSize: number;
    securityFlags?: string[];
  }
  const [results, setResults] = useState<NetworkPacket[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteriaType>({
    sourceIp: '',
    destinationIp: '',
    protocol: '',
    minPacketSize: '',
    maxPacketSize: '',
    securityFlag: '',
    startTime: null,
    endTime: null
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);


  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {
        ...searchCriteria,
        page,
        size: rowsPerPage,
        startTime: searchCriteria.startTime?.toISOString(),
        endTime: searchCriteria.endTime?.toISOString()
      };
      
     // Send request to API Gateway, which forwards to threat-detection-service
     const response = await axios.get(`${apiGatewayUrl}/api/network-traffic/search`, {
      params,
      timeout: 10000 // 10 seconds timeout
      });

      setResults(response.data.content);
      setTotal(response.data.totalElements);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startLiveCapture = async () => {
    try {
      await axios.post('${apiGatewayUrl}/api/network-traffic/start-capture');
      setIsCapturing(true);
    } catch (error) {
      console.error('Capture start failed', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Live Packet Search
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Source IP"
                fullWidth
                value={searchCriteria.sourceIp}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  sourceIp: e.target.value
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Destination IP"
                fullWidth
                value={searchCriteria.destinationIp}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  destinationIp: e.target.value
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Protocol"
                fullWidth
                value={searchCriteria.protocol}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  protocol: e.target.value
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Min Packet Size"
                type="number"
                fullWidth
                value={searchCriteria.minPacketSize}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  minPacketSize: e.target.value
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Max Packet Size"
                type="number"
                fullWidth
                value={searchCriteria.maxPacketSize}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  maxPacketSize: e.target.value
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Security Flag"
                fullWidth
                value={searchCriteria.securityFlag}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  securityFlag: e.target.value
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DateTimePicker
                label="Start Time"
                value={searchCriteria.startTime}
                onChange={(newValue) => setSearchCriteria({
                  ...searchCriteria, 
                  startTime: newValue
                })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DateTimePicker
                label="End Time"
                value={searchCriteria.endTime}
                onChange={(newValue) => setSearchCriteria({
                  ...searchCriteria, 
                  endTime: newValue
                })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleSearch}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={startLiveCapture}
                  disabled={isCapturing}
                  fullWidth
                >
                  {isCapturing ? 'Capturing...' : 'Start Live Capture'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Source IP</TableCell>
                <TableCell>Destination IP</TableCell>
                <TableCell>Protocol</TableCell>
                <TableCell>Packet Size</TableCell>
                <TableCell>Flags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((packet) => (
                <TableRow key={packet.id}>
                  <TableCell>{new Date(packet.capturedTimestamp).toLocaleString()}</TableCell>
                  <TableCell>{packet.sourceIp}:{packet.sourcePort}</TableCell>
                  <TableCell>{packet.destinationIp}:{packet.destinationPort}</TableCell>
                  <TableCell>{packet.protocol}</TableCell>
                  <TableCell>{packet.packetSize} bytes</TableCell>
                  <TableCell>{packet.securityFlags?.join(', ') || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
};

export default NetworkTrafficSearch;