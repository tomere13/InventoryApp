// src/pages/AddItem.tsx

import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { IItem } from '../types';
import { useNavigate, useParams } from 'react-router-dom';

// Import MUI components
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

const AddItem: React.FC = () => {
  const navigate = useNavigate();
  const { branchId } = useParams<{ branchId: string }>(); // Extract branchId from URL

  // State to manage the new item
  const [item, setItem] = useState<IItem>({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    branch: branchId || '', // Initialize with branchId if available
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Ensure that branchId is present
  useEffect(() => {
    if (!branchId) {
      setError('Branch ID is missing. Cannot add item.');
    } else {
      console.log('branchId:', branchId); // Log the branchId for debugging
      setItem((prevItem) => ({
        ...prevItem,
        branch: branchId,
      }));
    }
  }, [branchId]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setItem((prevItem) => ({
      ...prevItem,
      [name]:
        name === 'quantity' || name === 'price'
          ? Number(value)
          : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic form validation
    if (!item.name.trim()) {
      setError('Please provide a valid name.');
      return;
    }

    if (item.quantity <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }

    if (!item.branch) {
      setError('Branch ID is missing. Cannot add item.');
      return;
    }

    setLoading(true);

    try {
      // Post the new item to the specific branch
      const response = await axios.post<IItem>(`/api/${item.branch}/items`, item);
      console.log('Item added:', response.data);
      navigate(`/branch/${item.branch}/items`); // Redirect to the item's branch list
    } catch (err: any) {
      console.error('Error adding item:', err);
      setError(err.response?.data?.message || 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If there's an error with branchId, display an alert
  if (error && !loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Add New Item
          </Typography>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          {/* Optionally, provide a button to navigate back or to select a branch */}
          <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Add New Item
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            name="name"
            value={item.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={item.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="Quantity"
            name="quantity"
            value={item.quantity}
            onChange={handleChange}
            type="number"
            fullWidth
            required
            margin="normal"
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Price"
            name="price"
            value={item.price}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ min: 0, step: 0.01 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Item'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddItem;