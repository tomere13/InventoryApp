import React, { useEffect, useState, useMemo } from "react";
import axios from "../utils/axiosInstance";
import { IReport, IBranch } from "../types";
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
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";

const ReportList: React.FC = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States for search and filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const reportsPerPage = 13; // Number of reports per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsResponse, branchesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/reports`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/branches`),
        ]);
        console.log("Reports API Response:", reportsResponse.data);
        console.log("Branches API Response:", branchesResponse.data);

        setReports(reportsResponse.data.reports || []);
        setBranches(branchesResponse.data || []); // Adjusted here
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBranch, startDate, endDate]);

  // Filtered reports based on search and filter criteria
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Filter by selected branch using branch _id
      const branchMatch = selectedBranch
        ? report.branchId && report.branchId._id === selectedBranch
        : true;

      // Filter by search query (searching in branch name and notes)
      const searchMatch =
        (report.branchId &&
          report.branchId.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (report.notes &&
          report.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by date range
      const reportDate = new Date(report.dateSent);
      const startDateMatch = startDate
        ? reportDate >= new Date(startDate)
        : true;
      const endDateMatch = endDate ? reportDate <= new Date(endDate) : true;

      return branchMatch && searchMatch && startDateMatch && endDateMatch;
    });
  }, [reports, searchQuery, selectedBranch, startDate, endDate]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  // Get current page reports
  const currentReports = useMemo(() => {
    const startIndex = (currentPage - 1) * reportsPerPage;
    const endIndex = startIndex + reportsPerPage;
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, currentPage]);

  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  // Reset filters and pagination
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedBranch("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Function to handle CSV export
  const handleExportCSV = () => {
    // Prepare CSV data
    const csvRows = [];

    // Define headers
    const headers = ["שם הסניף", "תאריך דוח", "מוצרים שהוזמנו"];
    csvRows.push(headers.join(","));

    // Loop over filtered reports
    filteredReports.forEach((report) => {
      const branchName = report.branchId ? report.branchId.name : "N/A";
      const dateSent = new Date(report.dateSent).toLocaleString("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Aggregate products into a single string
      let products = "";
      if (report.stockReport && report.stockReport.length > 0) {
        products = report.stockReport
          .map((it) => {
            const itemName = it.itemId ? it.itemId.name : "N/A";
            const currentStock = it.currentStock;

            return (
              `שם המוצר: ${itemName}\n` + `${currentStock} :כמות להזמנה\n\n`
            );
          })
          .join(" "); // Separator between products
      } else {
        products = "No products";
      }

      const row = [branchName, dateSent, products];

      // Escape any commas or double quotes in data
      const escapedRow = row.map(
        (value) =>
          `"${(value + "").replace(/"/g, '""').replace(/\n/g, "\r\n")}"`
      );
      csvRows.push(escapedRow.join(","));
    });

    // Create CSV string
    const csvString = csvRows.join("\n");

    // Create a blob
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

    // Create a link to download it
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "reports.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        דוחות מלאי
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Input */}
          <Grid item xs={12} sm={6} md={3}>
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

          {/* Branch Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="branch-select-label">סניף</InputLabel>
              <Select
                labelId="branch-select-label"
                id="branch-select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                label="סניף"
              >
                <MenuItem value="">
                  <em>כל הסניפים</em>
                </MenuItem>
                {branches.map((branch) => (
                  <MenuItem key={branch._id} value={branch._id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Reset Filters Button */}
          <Grid item xs={12} sm={6} md={1.5}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={resetFilters}
            >
              איפוס מסננים
            </Button>
          </Grid>

          {/* Export CSV Button */}
          <Grid item xs={12} sm={6} md={1.5}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleExportCSV}
            >
              ייצוא ל-CSV
            </Button>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredReports.length === 0 ? (
        <Alert severity="info">אין דוחות זמינים להצגה.</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="reports table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>סניף</strong>
                  </TableCell>
                  <TableCell>
                    <strong>תאריך נשלח</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>פירוט</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentReports.map((report) => (
                  <TableRow key={report._id} hover>
                    <TableCell>
                      {report.branchId ? report.branchId.name : "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(report.dateSent).toLocaleDateString("he-IL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
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

          {/* Pagination Component */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ReportList;
