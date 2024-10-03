// src/pages/ReportList.tsx

import React, { useEffect, useState, useMemo } from 'react';
import axios from '../utils/axiosInstance';
import { IReport } from '../types';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  TextField,
  Grid,
  Button,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ReportList: React.FC = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States for search and filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>(''); // For branch filter
  const [startDate, setStartDate] = useState<string>(''); // Using string to simplify
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsResponse, branchesResponse] = await Promise.all([
          axios.get('/api/reports'),
          axios.get('/api/branches'),
        ]);
        console.log('Reports API Response:', reportsResponse.data);
        console.log('Branches API Response:', branchesResponse.data);
        
        setReports(reportsResponse.data.reports || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debugging: Log the reports to verify the structure
  useEffect(() => {
    console.log('Fetched Reports:', reports);
  }, [reports]);

  // Filtered reports based on search and filter criteria
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Filter by selected branch
      const branchMatch = selectedBranch
        ? report.branchId?.name === selectedBranch
        : true;

      // Filter by search query (searching in branch name and notes)
      const searchMatch =
      (report.branchId && report.branchId.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (report.notes && report.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by date range
      const reportDate = new Date(report.dateSent);
      const startDateMatch = startDate ? reportDate >= new Date(startDate) : true;
      const endDateMatch = endDate ? reportDate <= new Date(endDate) : true;

      return branchMatch && searchMatch && startDateMatch && endDateMatch;
    });
  }, [reports, searchQuery, selectedBranch, startDate, endDate]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        דוחות מלאי
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Input */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="חיפוש"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש לפי שם סניף או הערות"
            />
          </Grid>

  

          {/* Start Date Input */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="מתאריך"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>

          {/* End Date Input */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="עד תאריך"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>

          {/* Reset Filters Button */}
          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => {
                setSearchQuery('');
                setSelectedBranch('');
                setStartDate('');
                setEndDate('');
              }}
            >
              איפוס מסננים
            </Button>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredReports.length === 0 ? (
        <Alert severity="info">אין דוחות זמינים להצגה.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="reports table">
            <TableHead>
              <TableRow>
                <TableCell><strong>סניף</strong></TableCell>
                <TableCell><strong>תאריך נשלח</strong></TableCell>
                <TableCell><strong>הערות</strong></TableCell>
                <TableCell align="center"><strong>פעולות</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report._id} hover>
                  <TableCell>{report.branchId?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(report.dateSent).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{report.notes || 'אין הערות'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="צפה בדוח">
                      <IconButton
                        component={Link}
                        to={`/reports/${report._id}`}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ReportList;