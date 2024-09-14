// src/pages/ReportList.tsx

import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ReportList: React.FC = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get('/api/reports') // Removed '/api' prefix
      .then((response) => {
        setReports(response.data.reports);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports.');
        setLoading(false);
      });
  }, []);

  // Debugging: Log the reports to verify the structure
  useEffect(() => {
    console.log('Fetched Reports:', reports);
  }, [reports]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        דוחות מלאי
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : reports.length === 0 ? (
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
            {reports.map((report) => (
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