// src/pages/ItemList.tsx

import React, { useState, useEffect, useContext } from "react";
import axios from "../utils/axiosInstance";
import { IItem } from "../types";
import { Link } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import { useParams } from "react-router-dom";

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
} from "@mui/material";

// Import AuthContext
import { AuthContext } from "../context/AuthContext";

const ItemList: React.FC = () => {
  const { role } = useContext(AuthContext); // Access the role from context
  const [items, setItems] = useState<IItem[]>([]);
  const { branchId } = useParams<{ branchId: string }>(); // Get branchId from the URL

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!branchId) {
      console.error("No branchId provided in URL parameters.");
      return;
    }

    console.log(`Fetching items for branchId: ${branchId}`);

    axios
      .get<IItem[]>(`${process.env.REACT_APP_API_URL}/api/${branchId}/items`)
      .then((response) => {
        const filteredItems = response.data.filter(
          (item) => item.branch === branchId
        );
        setItems(filteredItems);
        console.log("Fetched Items:", filteredItems);
      })
      .catch((error) => console.error("Error fetching items:", error));
  }, [branchId]); // Added branchId to dependency array

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant={isSmallScreen ? "h5" : "h4"}
        align="center"
        gutterBottom
      >
        מוצרי מלאי
      </Typography>

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
                color: "#000000FF", // White text color
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
                color: "#000000FF", // White text color
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
            {items.length === 0 ? (
              <TableRow>
                {/* Adjust colSpan based on the number of visible columns */}
                <TableCell
                  colSpan={
                    role === "admin"
                      ? isSmallScreen
                        ? 3 // Name, Description, Actions
                        : 6 // All columns including admin actions
                      : isSmallScreen
                      ? 2 // Name, Description
                      : 5 // All columns excluding admin actions
                  }
                  align="center"
                >
                  אין מוצרים זמינים.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell align="center">{item.name}</TableCell>
                  <TableCell align="center">{item.description || "N/A"}</TableCell>

                  {/* Conditionally render the data cells based on screen size */}
                  {!isSmallScreen && (
                    <>
                      <TableCell align="center">
                        {item.price ? item.price.toFixed(2) : "N/A"}
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="center">
                        {item.dateAdded
                          ? new Date(item.dateAdded).toLocaleDateString()
                          : "N/A"}
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
                          to={`/branch/${branchId}/edit/${item._id}`}
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
    </Container>
  );
};

export default ItemList;
