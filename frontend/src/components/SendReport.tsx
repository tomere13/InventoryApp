// src/components/SendReport.tsx

import React, { useState, useEffect, useContext, ChangeEvent } from "react";
import axios from "../utils/axiosInstance";
import { IItem, IStockReport } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Import MUI components
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Card,
  CircularProgress, // Import CircularProgress
  Snackbar,
  Alert,
} from "@mui/material";

const SendReport: React.FC = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const { role } = useContext(AuthContext); // Access user role from context
  const navigate = useNavigate();

  // State to hold the raw input values as strings
  const [presentStockNumber, setPresentStockNumber] = useState<{ [key: string]: string }>({});

  const [items, setItems] = useState<IItem[]>([]);

  // State to hold the parsed numeric values
  const [stockData, setStockData] = useState<Record<string, number>>({});

  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    if (!branchId) {
      setError("No branch ID provided.");
      return;
    }

    setLoading(true); // Set loading to true when fetching starts

    axios
      .get<IItem[]>(`${process.env.REACT_APP_API_URL}/api/${branchId}/items`)
      .then((response) => {
        const filteredItems = response.data.filter(
          (item) => item.branch === branchId
        );
        setItems(filteredItems);

        // Initialize stockData with current stock
        const initialStock: Record<string, number> = {};
        filteredItems.forEach((item) => {
          initialStock[item._id] = item.quantity;
        });
        setStockData(initialStock);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch items. Please try again later.");
      })
      .finally(() => {
        setLoading(false); // Set loading to false when fetching completes
      });
  }, [branchId]);

  const handleStockChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    itemId: string
  ) => {
    const value = e.target.value;
    const parsedValue = parseInt(value, 10);

    // Update the raw input value
    setPresentStockNumber((prevStock) => ({
      ...prevStock,
      [itemId]: value,
    }));

    // Validate the input and update stockData and inputErrors accordingly
    if (value === "") {
      // Empty input
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        [itemId]: "אנא הזן ערך",
      }));
      setStockData((prevStockData) => {
        const newStockData = { ...prevStockData };
        delete newStockData[itemId];
        return newStockData;
      });
    } else if (isNaN(parsedValue) || parsedValue < 0) {
      // Invalid number
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        [itemId]: "אנא הזן מספר חוקי",
      }));
    } else {
      // Valid number
      const item = items.find((item) => item._id === itemId);
      if (item && parsedValue > item.quantity) {
        // Input greater than current stock
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          [itemId]: "הכמות המוזנת גדולה מהכמות הקיימת במלאי",
        }));
      } else {
        // Input is valid, remove any existing error
        setInputErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[itemId];
          return newErrors;
        });
      }
      // Update stockData with the valid parsed value
      setStockData((prevStockData) => ({
        ...prevStockData,
        [itemId]: parsedValue,
      }));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    // Prepare the stock report data
    const reportData: IStockReport[] = items.map((item) => ({
      itemId: item._id,
      currentStock: stockData[item._id],
    }));

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/${branchId}/sendreport`,
        { stockReport: reportData },
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess("דוח נשלח בהצלחה. נשלח אימייל עם פרטי ההזמנה.");
      // Optionally, navigate to another page
      navigate(`/branch/${branchId}/items`);
    } catch (err: any) {
      console.error(err);
      const errorMessage = "אירעה שגיאה בשליחת הדוח. אנא נסה שוב.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle closing of Snackbar
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setError("");
    setSuccess("");
  };

  // Ensure that only employees can access this page
  useEffect(() => {
    if (role !== "employee") {
      setError("אין לך הרשאה לגשת לעמוד זה.");
      // Optionally, navigate away
      // navigate("/");
    }
  }, [role]);

  // Validation function
  const isFormValid = () => {
    return (
      Object.keys(inputErrors).length === 0 &&
      items.every((item) => {
        const value = presentStockNumber[item._id];
        return value !== undefined && value !== "";
      })
    );
  };

  if (loading) {
    // Display loading indicator while fetching data
    return (
      <Container
        maxWidth="md"
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        דו"ח הזנה למלאי
      </Typography>

      <Card
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: 4,
          boxShadow: 6,
          padding: { xs: 2, md: 4 },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>שם המוצר</strong>
              </TableCell>
              <TableCell>
                <strong>תיאור</strong>
              </TableCell>
              <TableCell>
                <strong>כמות נוכחית</strong>
              </TableCell>
              <TableCell>
                <strong>כמות להזנה</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id} hover>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description || "N/A"}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <TextField
                    id={item._id}
                    value={presentStockNumber[item._id] || ""}
                    type="number"
                    required
                    onChange={(e) => handleStockChange(e, item._id)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    error={!!inputErrors[item._id]}
                    helperText={inputErrors[item._id] || ""}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            mt: 3,
            backgroundColor: "#63CBC1FF", // Dark background color
            color: "#000000FF", // Black text color
            "&:hover": {
              backgroundColor: "#BFF9F3FF", // Slightly lighter on hover
            },
          }}
          disabled={submitting || !isFormValid()}
        >
          {submitting ? <CircularProgress size={24} /> : "שלח דו\"ח"}
        </Button>
      </Card>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SendReport;