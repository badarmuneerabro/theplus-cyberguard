/* import React, { useState, useEffect, useCallback } from 'react';
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
  Switch,
  FormControlLabel
} from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import NetworkTrafficSearch from '@/components/Dashboard/Search';
import threatDetectionService from '@/services/threatDetectionService';

const NetworkTraffic: React.FC = () => {
  interface SearchCriteria {
    sourceIp: string;
    destinationIp: string;
    protocol: string;
    minPacketSize: string;
    maxPacketSize: string;
    securityFlag: string;
    startTime: Date | null;
    endTime: Date | null;
  }
  
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    sourceIp: '',
    destinationIp: '',
    protocol: '',
    minPacketSize: '',
    maxPacketSize: '',
    securityFlag: '',
    startTime: null,
    endTime: null
  });

  interface NetworkPacket {
    id: string;
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized search function
  const performSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...searchCriteria,
        page,
        size: rowsPerPage,
        startTime: searchCriteria.startTime?.toISOString(),
        endTime: searchCriteria.endTime?.toISOString()
      };

      // Send request to API Gateway, which forwards to threat-detection-service
      try {
        const response = await axios.get(`${apiGatewayUrl}/api/network-traffic/search`, {
          params,
          timeout: 10000, // 10 seconds timeout
          // Enable credentials and set content type
          withCredentials: false,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        setResults(response.data.content);
        setTotal(response.data.totalElements);
      } catch (apiError: any) {
        console.error('API request failed:', apiError.message, apiError.response?.data);
        
        // For development: fallback to mock data if API is unavailable
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock data for development');
          const mockData = Array(10).fill(0).map((_, i) => ({
            id: `mock-${i}`,
            capturedTimestamp: new Date().toISOString(),
            sourceIp: '192.168.1.1',
            sourcePort: 8080,
            destinationIp: '10.0.0.1',
            destinationPort: 443,
            protocol: 'TCP',
            packetSize: 1500,
            securityFlags: ['SYN', 'ACK']
          }));
          setResults(mockData);
          setTotal(mockData.length);
          setError('Using mock data - API server is unavailable');
          return;
        }
        
        throw apiError; // re-throw to be caught by the outer catch
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('An error occurred while searching. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [searchCriteria, page, rowsPerPage]);

  // Auto-refresh effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (autoRefresh) {
      intervalId = setInterval(() => {
        performSearch();
      }, 5000); // Auto refresh every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, performSearch]);

  // Initial search
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Form validation before search
  const validateSearch = () => {
    if (!searchCriteria.sourceIp || !searchCriteria.destinationIp) {
      setError("Please provide both Source IP and Destination IP.");
      return false;
    }
    return true;
  };

  const handleSearchClick = () => {
    if (validateSearch()) {
      performSearch();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Source IP"
                fullWidth
                value={searchCriteria.sourceIp}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  sourceIp: e.target.value
                })}
                aria-label="Source IP address"
                role="textbox"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Destination IP"
                fullWidth
                value={searchCriteria.destinationIp}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  destinationIp: e.target.value
                })}
                aria-label="Destination IP address"
                role="textbox"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Protocol"
                fullWidth
                value={searchCriteria.protocol}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  protocol: e.target.value
                })}
                aria-label="Protocol"
                role="textbox"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Min Packet Size"
                type="number"
                fullWidth
                value={searchCriteria.minPacketSize}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  minPacketSize: e.target.value
                })}
                aria-label="Minimum Packet Size"
                role="textbox"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Max Packet Size"
                type="number"
                fullWidth
                value={searchCriteria.maxPacketSize}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  maxPacketSize: e.target.value
                })}
                aria-label="Maximum Packet Size"
                role="textbox"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DateTimePicker
                label="Start Time"
                value={searchCriteria.startTime}
                onChange={(newValue) => setSearchCriteria({
                  ...searchCriteria, 
                  startTime: newValue
                })}
                slotProps={{ textField: { fullWidth: true } }}
                aria-label="Start Time"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DateTimePicker
                label="End Time"
                value={searchCriteria.endTime}
                onChange={(newValue) => setSearchCriteria({
                  ...searchCriteria, 
                  endTime: newValue
                })}
                slotProps={{ textField: { fullWidth: true } }}
                aria-label="End Time"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefresh}
                    onChange={() => setAutoRefresh(!autoRefresh)}
                  />
                }
                label="Auto Refresh"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button 
                variant="contained" 
                onClick={handleSearchClick}
                disabled={loading}
                fullWidth
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {error && <Typography color="error">{error}</Typography>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Source IP</TableCell>
                <TableCell>Destination IP</TableCell>
                <TableCell>Protocol</TableCell>
                <TableCell>Packet Size</TableCell>
                <TableCell>Security Flags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!results || results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                results.map((packet) => (
                  <TableRow key={packet.id}>
                    <TableCell>{new Date(packet.capturedTimestamp).toLocaleString()}</TableCell>
                    <TableCell>{packet.sourceIp}:{packet.sourcePort}</TableCell>
                    <TableCell>{packet.destinationIp}:{packet.destinationPort}</TableCell>
                    <TableCell>{packet.protocol}</TableCell>
                    <TableCell>{packet.packetSize} bytes</TableCell>
                    <TableCell>{packet.securityFlags?.join(', ') || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
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

export default NetworkTraffic;
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  Tooltip
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getThreatDetectionResultsByIpAddress, getThreatDetectionResultsByTimeRange, getThreatDetectionResultsBySeverity } from '@/services/threatDetectionService';


const NetworkTraffic: React.FC = () => {
  interface SearchCriteria {
    sourceIp: string;
    destinationIp: string;
    protocol: string;
    minPacketSize: string;
    maxPacketSize: string;
    securityFlag: string;
    startTime: Date | null;
    endTime: Date | null;
    filterExpression: string; // New field for custom filter expressions
  }
  
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    sourceIp: '',
    destinationIp: '',
    protocol: '',
    minPacketSize: '',
    maxPacketSize: '',
    securityFlag: '',
    startTime: null,
    endTime: null,
    filterExpression: ''
  });

  interface NetworkPacket {
    id: string;
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterHistory, setFilterHistory] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Memoized search function
  const performSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...searchCriteria,
        page,
        size: rowsPerPage,
        startTime: searchCriteria.startTime?.toISOString(),
        endTime: searchCriteria.endTime?.toISOString(),
        filterExpression: searchCriteria.filterExpression
      };

      // Send request to API Gateway, which forwards to threat-detection-service
      try {
        // Replace getThreatDetectionResultsByIpAddress with the correct function
        const response = await getThreatDetectionResultsByIpAddress(searchCriteria.sourceIp, params); 
        
        setResults(response.data.content);
        setTotal(response.data.totalElements);
        
        // Save filter to history if it's not empty and not already in history
        if (searchCriteria.filterExpression && !filterHistory.includes(searchCriteria.filterExpression)) {
          setFilterHistory(prev => [searchCriteria.filterExpression, ...prev.slice(0, 9)]);
        }
      } catch (apiError: any) {
        console.error('API request failed:', apiError.message, apiError.response?.data);
        
        // For development: fallback to mock data if API is unavailable
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock data for development');
          const mockData = Array(10).fill(0).map((_, i) => ({
            id: `mock-${i}`,
            capturedTimestamp: new Date().toISOString(),
            sourceIp: '192.168.1.1',
            sourcePort: 8080,
            destinationIp: '10.0.0.1',
            destinationPort: 443,
            protocol: 'TCP',
            packetSize: 1500,
            securityFlags: ['SYN', 'ACK']
          }));
          setResults(mockData);
          setTotal(mockData.length);
          setError('Using mock data - API server is unavailable');
          return;
        }
        
        throw apiError; // re-throw to be caught by the outer catch
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('An error occurred while searching. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [searchCriteria, page, rowsPerPage, filterHistory]);

  // Auto-refresh effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (autoRefresh) {
      intervalId = setInterval(() => {
        performSearch();
      }, 5000); // Auto refresh every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, performSearch]);

  // Initial search
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Form validation before search
  const validateSearch = () => {
    // If using advanced filter expression, skip basic validation
    if (searchCriteria.filterExpression) {
      return true;
    }
    
    if (!searchCriteria.sourceIp && !searchCriteria.destinationIp && !searchCriteria.protocol) {
      setError("Please provide at least one search criteria.");
      return false;
    }
    return true;
  };

  const handleSearchClick = () => {
    if (validateSearch()) {
      performSearch();
    }
  };

  // Handle applying a filter from history
  const applyHistoryFilter = (filter: string) => {
    setSearchCriteria(prev => ({
      ...prev,
      filterExpression: filter
    }));
    setShowAdvancedFilters(true);
  };

  // Generate filter expression based on basic criteria
  const generateFilterExpression = () => {
    const conditions = [];
    
    if (searchCriteria.sourceIp) {
      conditions.push(`ip.src == ${searchCriteria.sourceIp}`);
    }
    
    if (searchCriteria.destinationIp) {
      conditions.push(`ip.dst == ${searchCriteria.destinationIp}`);
    }
    
    if (searchCriteria.protocol) {
      conditions.push(`${searchCriteria.protocol.toLowerCase()}`);
    }
    
    if (searchCriteria.minPacketSize) {
      conditions.push(`frame.len >= ${searchCriteria.minPacketSize}`);
    }
    
    if (searchCriteria.maxPacketSize) {
      conditions.push(`frame.len <= ${searchCriteria.maxPacketSize}`);
    }
    
    const expression = conditions.join(' && ');
    setSearchCriteria(prev => ({
      ...prev,
      filterExpression: expression
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Network Traffic Analysis
              </Typography>
            </Grid>
            
            {/* Basic Search Criteria */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Source IP"
                fullWidth
                value={searchCriteria.sourceIp}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  sourceIp: e.target.value
                })}
                aria-label="Source IP address"
                role="textbox"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Destination IP"
                fullWidth
                value={searchCriteria.destinationIp}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  destinationIp: e.target.value
                })}
                aria-label="Destination IP address"
                role="textbox"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Protocol"
                fullWidth
                value={searchCriteria.protocol}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  protocol: e.target.value
                })}
                aria-label="Protocol"
                role="textbox"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Min Packet Size"
                type="number"
                fullWidth
                value={searchCriteria.minPacketSize}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  minPacketSize: e.target.value
                })}
                aria-label="Minimum Packet Size"
                role="textbox"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Max Packet Size"
                type="number"
                fullWidth
                value={searchCriteria.maxPacketSize}
                onChange={(e) => setSearchCriteria({
                  ...searchCriteria, 
                  maxPacketSize: e.target.value
                })}
                aria-label="Maximum Packet Size"
                role="textbox"
              />
            </Grid>

            {/* Time Range and Controls */}
            <Grid item xs={12} sm={6} md={3}>
              <DateTimePicker
                label="Start Time"
                value={searchCriteria.startTime}
                onChange={(newValue) => setSearchCriteria({
                  ...searchCriteria, 
                  startTime: newValue
                })}
                slotProps={{ textField: { fullWidth: true } }}
                aria-label="Start Time"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DateTimePicker
                label="End Time"
                value={searchCriteria.endTime}
                onChange={(newValue) => setSearchCriteria({
                  ...searchCriteria, 
                  endTime: newValue
                })}
                slotProps={{ textField: { fullWidth: true } }}
                aria-label="End Time"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefresh}
                    onChange={() => setAutoRefresh(!autoRefresh)}
                  />
                }
                label="Auto Refresh"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  onClick={handleSearchClick}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
                <Tooltip title="Generate filter from basic criteria">
                  <Button
                    variant="outlined"
                    onClick={generateFilterExpression}
                    color="secondary"
                  >
                    <FilterAltIcon />
                  </Button>
                </Tooltip>
              </Box>
            </Grid>
            
            {/* Advanced Filtering */}
            <Grid item xs={12}>
              <Accordion 
                expanded={showAdvancedFilters}
                onChange={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Advanced Packet Filtering</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Filter Expression (Wireshark Display Filter Syntax)"
                        fullWidth
                        multiline
                        rows={2}
                        value={searchCriteria.filterExpression}
                        onChange={(e) => setSearchCriteria({
                          ...searchCriteria,
                          filterExpression: e.target.value
                        })}
                        placeholder="Example: ip.src == 192.168.1.1 && tcp.port == 80"
                        helperText="Use Wireshark display filter syntax for advanced filtering"
                      />
                    </Grid>
                    {filterHistory.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                          Recent Filters:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {filterHistory.map((filter, index) => (
                            <Chip 
                              key={index} 
                              label={filter} 
                              onClick={() => applyHistoryFilter(filter)}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Example Filters:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip 
                          label="HTTP Traffic: http" 
                          onClick={() => applyHistoryFilter("http")}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                        <Chip 
                          label="Large Packets: frame.len > 1000" 
                          onClick={() => applyHistoryFilter("frame.len > 1000")}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                        <Chip 
                          label="DNS Traffic: dns" 
                          onClick={() => applyHistoryFilter("dns")}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Paper>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Source IP</TableCell>
                <TableCell>Destination IP</TableCell>
                <TableCell>Protocol</TableCell>
                <TableCell>Packet Size</TableCell>
                <TableCell>Security Flags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!results || results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                results.map((packet) => (
                  <TableRow key={packet.id}>
                    <TableCell>{new Date(packet.capturedTimestamp).toLocaleString()}</TableCell>
                    <TableCell>{packet.sourceIp}:{packet.sourcePort}</TableCell>
                    <TableCell>{packet.destinationIp}:{packet.destinationPort}</TableCell>
                    <TableCell>{packet.protocol}</TableCell>
                    <TableCell>{packet.packetSize} bytes</TableCell>
                    <TableCell>{packet.securityFlags?.join(', ') || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
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

export default NetworkTraffic;
