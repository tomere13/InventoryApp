import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "../utils/axiosInstance";
import { IItem } from "../types";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";

// Import MUI components
import {
  Container,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Pagination,
  Box,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";

// Import AuthContext
import { AuthContext } from "../context/AuthContext";

const ItemList: React.FC = () => {
  const { role } = useContext(AuthContext); // Access the role from context
  const [items, setItems] = useState<IItem[]>([]);
  const { branchId } = useParams<{ branchId: string }>(); // Get branchId from the URL

  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Use search parameters for filters
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters from query parameters
  const searchQuery = searchParams.get("search") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const selectedSupplier = searchParams.get("supplier") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Unique suppliers for the supplier filter
  const [suppliers, setSuppliers] = useState<string[]>([]);

  useEffect(() => {
    if (!branchId) {
      console.error("No branchId provided in URL parameters.");
      return;
    }

    setLoading(true); // Set loading to true when fetch starts

    console.log(`Fetching items for branchId: ${branchId}`);

    axios
      .get<IItem[]>(`${process.env.REACT_APP_API_URL}/api/${branchId}/items`)
      .then((response) => {
        const filteredItems = response.data.filter(
          (item) => item.branch === branchId
        );
        setItems(filteredItems);
        console.log("Fetched Items:", filteredItems);

        // Extract unique suppliers from items
        const uniqueSuppliers = Array.from(
          new Set(filteredItems.map((item) => item.supplier).filter(Boolean))
        );
        setSuppliers(uniqueSuppliers);
      })
      .catch((error) => console.error("Error fetching items:", error))
      .finally(() => {
        setLoading(false); // Set loading to false when fetch completes
      });
  }, [branchId]);

  // Filtered items based on search and filter criteria
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filter by search query (searching in name and description)
      const searchMatch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by date range
      const itemDate = item.dateAdded ? new Date(item.dateAdded) : null;
      const startDateMatch = startDate
        ? itemDate && itemDate >= new Date(startDate)
        : true;
      const endDateMatch = endDate
        ? itemDate && itemDate <= new Date(endDate)
        : true;

      // Filter by selected supplier
      const supplierMatch = selectedSupplier
        ? item.supplier === selectedSupplier
        : true;

      return searchMatch && startDateMatch && endDateMatch && supplierMatch;
    });
  }, [items, searchQuery, startDate, endDate, selectedSupplier]);

  // Calculate total pages
  const itemsPerPage = 13;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage]);

  // Handle filter changes by updating query parameters
  const handleFilterChange = (key: string, value: string) => {
    const updatedParams = new URLSearchParams(searchParams);
    if (value) {
      updatedParams.set(key, value);
    } else {
      updatedParams.delete(key);
    }
    // Reset to page 1 when filters change
    if (key !== "page") {
      updatedParams.set("page", "1");
    }
    setSearchParams(updatedParams);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchParams({});
  };

  const deleteItem = (id: string) => {
    if (window.confirm(`האם אתה בטוח?`)) {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/api/${branchId}/items/${id}`)
        .then(() => {
          setItems(items.filter((item) => item._id !== id));
          console.log(`Deleted item with id: ${id}`);
        })
        .catch((error) => console.error("Error deleting item:", error));
    }
  };

  if (loading) {
    // Display loading indicator while fetching data
    return (
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh", // Adjust height as needed
        }}
      >
        <CircularProgress size={60} color="inherit" />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant={isSmallScreen ? "h5" : "h4"}
        align="center"
        gutterBottom
      >
        מוצרי מלאי
      </Typography>

      {/* Filter Section */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Input */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="חיפוש"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="חפש לפי שם או תיאור"
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
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
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
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </Grid>

          {/* Supplier Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="supplier-select-label">ספק</InputLabel>
              <Select
                labelId="supplier-select-label"
                id="supplier-select"
                value={selectedSupplier}
                onChange={(e) => handleFilterChange("supplier", e.target.value)}
                label="ספק"
              >
                <MenuItem value="">
                  <em>הכל</em>
                </MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier} value={supplier}>
                    {supplier}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Reset Filters Button */}
          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={resetFilters}
            >
              איפוס מסננים
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Buttons Section */}
      <Grid
        container
        spacing={2}
        justifyContent={isSmallScreen ? "center" : "flex-end"}
        sx={{ mb: 2 }}
      >
        {role === "admin" && branchId && (
          <Grid item xs={12} sm="auto">
            <Button
              variant="contained"
              component={Link}
              to={`/branch/${branchId}/add`} // Navigate to the correct branch-specific add item page
              fullWidth={isSmallScreen}
              sx={{
                backgroundColor: "#63CBC1FF", // Dark background color
                color: "#000000FF", // Black text color
                "&:hover": {
                  backgroundColor: "#BFF9F3FF", // Slightly lighter dark on hover
                },
              }}
            >
              + הוסף מוצר חדש
            </Button>
          </Grid>
        )}
        {role === "employee" && branchId && (
          <Grid item xs={12} sm="auto">
            <Button
              variant="contained"
              component={Link}
              sx={{
                backgroundColor: "#63CBC1FF", // Dark background color
                color: "#000000FF", // Black text color
                "&:hover": {
                  backgroundColor: "#BFF9F3FF", // Slightly lighter dark on hover
                },
              }}
              to={`/branch/${branchId}/sendreport`} // Navigate to the correct branch-specific send report page
              fullWidth={isSmallScreen}
            >
              שלח דוח מלאי
            </Button>
          </Grid>
        )}
      </Grid>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table
          aria-label="item table"
          sx={{
            minWidth: 360,
            "& th, & td": {
              padding: isSmallScreen ? theme.spacing(0.1) : theme.spacing(2),
              fontSize: isSmallScreen ? "0.875rem" : "1rem",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <strong>שם</strong>
              </TableCell>
              <TableCell align="center">
                <strong>תיאור</strong>
              </TableCell>

              {/* Conditionally render the columns based on screen size */}
              {!isSmallScreen && (
                <>
                  <TableCell align="center">
                    <strong>מחיר (₪)</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>כמות</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>תאריך הוספה</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>ספק</strong>
                  </TableCell>
                </>
              )}

              {role === "admin" && (
                <TableCell align="center">
                  <strong>פעולות</strong>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                {/* Adjust colSpan based on the number of visible columns */}
                <TableCell
                  colSpan={
                    role === "admin"
                      ? isSmallScreen
                        ? 4 // Name, Description, Supplier, Actions
                        : 7 // All columns including admin actions
                      : isSmallScreen
                      ? 3 // Name, Description, Supplier
                      : 6 // All columns excluding admin actions
                  }
                  align="center"
                >
                  אין מוצרים זמינים.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell align="center">{item.name}</TableCell>
                  <TableCell align="center">
                    {item.description || "אין"}
                  </TableCell>

                  {/* Conditionally render the data cells based on screen size */}
                  {!isSmallScreen && (
                    <>
                      <TableCell align="center">
                        {item.price !== undefined && item.price !== null
                          ? item.price.toFixed(2)
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="center">
                        {item.dateAdded
                          ? new Date(item.dateAdded).toLocaleDateString(
                              "he-IL",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {item.supplier ? item.supplier : "אין ספק"}
                      </TableCell>
                    </>
                  )}

                  {role === "admin" && (
                    <TableCell align="center">
                      {/* Conditionally render Edit and Delete buttons */}
                      <>
                        {/* Edit Button */}
                        <IconButton
                          component={Link}
                          to={`/branch/${branchId}/edit/${
                            item._id
                          }?${searchParams.toString()}`}
                          sx={{
                            backgroundColor: "#FFC107", // Amber color
                            color: "#ffffff",
                            mr: isSmallScreen ? 0.5 : 1, // Adjust margin on small screens
                            width: isSmallScreen ? 30 : 40, // Adjust width
                            height: isSmallScreen ? 30 : 40, // Adjust height
                            "& .MuiSvgIcon-root": {
                              fontSize: isSmallScreen ? 18 : 24, // Adjust icon size
                            },
                            "&:hover": {
                              backgroundColor: "#FFA000", // Darker amber on hover
                            },
                          }}
                          size={isSmallScreen ? "small" : "medium"}
                        >
                          <Edit />
                        </IconButton>

                        {/* Delete Button */}
                        <IconButton
                          onClick={() => deleteItem(item._id!)}
                          size={isSmallScreen ? "small" : "medium"}
                          sx={{
                            backgroundColor: "#F44336", // Red color
                            color: "#ffffff",
                            mr: isSmallScreen ? 0.5 : 1, // Adjust margin on small screens
                            width: isSmallScreen ? 30 : 40, // Adjust width
                            height: isSmallScreen ? 30 : 40, // Adjust height
                            "& .MuiSvgIcon-root": {
                              fontSize: isSmallScreen ? 18 : 24, // Adjust icon size
                            },
                            "&:hover": {
                              backgroundColor: "#D32F2F", // Darker red on hover
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) =>
              handleFilterChange("page", value.toString())
            }
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  );
};

export default ItemList;
