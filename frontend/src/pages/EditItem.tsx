import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { IItem } from "../types";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// Import MUI components
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

const EditItem: React.FC = () => {
  const [item, setItem] = useState<IItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { branchId, id } = useParams<{ branchId: string; id: string }>();
  const location = useLocation(); // Access the current location to get search params

  useEffect(() => {
    if (!branchId || !id) {
      setError("Invalid URL parameters.");
      return;
    }

    axios
      .get<IItem>(
        `${process.env.REACT_APP_API_URL}/api/${branchId}/items/${id}`
      )
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
        setError("Failed to fetch item data.");
      });
  }, [branchId, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (item) {
      const { name, value } = e.target;
      setItem((prevItem) => ({
        ...prevItem!,
        [name]: name === "quantity" || name === "price" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item && branchId) {
      axios
        .patch<IItem>(
          `${process.env.REACT_APP_API_URL}/api/${branchId}/items/${id}`,
          item
        )
        .then((response) => {
          // Navigate back with preserved query parameters
          navigate(`/branch/${branchId}/items${location.search}`);
        })
        .catch((error) => {
          console.error("Error updating item:", error);
          setError("Failed to update item. Please try again.");
        });
    }
  };

  // Show a loading message if the item data hasn't been fetched yet
  if (!item) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" align="center">
            ...אנא המתן, מוצר בטעינה
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          ערוך מוצר
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="שם המוצר"
            name="name"
            value={item.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="תיאור המוצר"
            name="description"
            value={item.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="כמות"
            name="quantity"
            value={item.quantity === 0 ? "" : item.quantity} // Display empty string if value is 0}
            onChange={handleChange}
            type="number"
            fullWidth
            required
            margin="normal"
            inputProps={{ min: 1, style: { textAlign: "left" } }} // Align text to the left
          />
          <TextField
            label="מחיר"
            name="price"
            value={item.price === 0 ? "" : item.price} // Display empty string if value is 0
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ min: 0, step: 0.01, style: { textAlign: "left" } }}
          />
          <TextField
            label="ספק"
            name="supplier"
            value={item.supplier || ""} // Default to an empty string if supplier is null/undefined
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#63CBC1FF", // Dark background color
              color: "#000000FF", // White text color
              "&:hover": {
                backgroundColor: "#BFF9F3FF", // Slightly lighter dark on hover
              },
            }}
          >
            עדכן מוצר
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditItem;
