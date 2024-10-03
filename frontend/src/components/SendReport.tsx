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
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

const SendReport: React.FC = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const { role } = useContext(AuthContext); // Access user role from context
  const navigate = useNavigate();

  const [items, setItems] = useState<IItem[]>([]);
  const [stockData, setStockData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    if (!branchId) {
      setError("No branch ID provided.");
      return;
    }

    setLoading(true);
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
      .finally(() => setLoading(false));
  }, [branchId]);

  const handleStockChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    itemId: string
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setStockData({
        ...stockData,
        [itemId]: value,
      });
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
      const response = await axios.post(
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
  }, [role, navigate]);

  const isFormValid = () => {
    return items.every((item) => {
      const stock = stockData[item._id];
      return stock !== undefined && stock >= 0;
    });
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center", mt: 4 }}
      >
        <CircularProgress />
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
                    type="number"
                    inputProps={{ min: 0 }}
                    value={stockData[item._id] || ""}
                    onChange={(e) => handleStockChange(e, item._id)}
                    variant="outlined"
                    size="small"
                    fullWidth
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
            backgroundColor: "#333333", // Dark background color
            color: "#ffffff", // White text color
            "&:hover": {
              backgroundColor: "#555555", // Slightly lighter dark on hover
            },
          }}
          disabled={submitting || !isFormValid()}
        >
          {submitting ? <CircularProgress size={24} /> : 'שלח דו"ח'}
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
