// src/pages/EditItem.tsx

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
} from '@mui/material';

const EditItem: React.FC = () => {
  const [item, setItem] = useState<IItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch the existing item data when the component mounts
  useEffect(() => {
    axios
      .get<IItem>(`/api/branch/items/${id}`)
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => {
        console.error('Error fetching item:', error);
        setError('Failed to fetch item data.');
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (item) {
      const { name, value } = e.target;
      setItem((prevItem) => ({
        ...prevItem!,
        [name]:
          name === 'quantity' || name === 'price'
            ? Number(value)
            : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      axios
        .patch<IItem>(`/api/branch/items/${id}`, item)
        .then((response) => {
          console.log('Item updated:', response.data);
          navigate('/');
        })
        .catch((error) => {
          console.error('Error updating item:', error);
          setError('Failed to update item. Please try again.');
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
            value={item.quantity}
            onChange={handleChange}
            type="number"
            fullWidth
            required
            margin="normal"
            inputProps={{ min: 1 }}
          />
          <TextField
            label="מחיר"
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
          >
            עדכן מוצר
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditItem;