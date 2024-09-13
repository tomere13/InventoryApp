// src/pages/ItemList.tsx

import React, { useState, useEffect, useContext } from "react";
import axios from '../utils/axiosInstance';
import { IItem } from "../types";
import { Link } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";

// Import MUI components
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
} from "@mui/material";

// Import AuthContext
import { AuthContext } from '../context/AuthContext';

const ItemList: React.FC = () => {
  const { role } = useContext(AuthContext); // Access the role from context
  const [items, setItems] = useState<IItem[]>([]);

  useEffect(() => {
    axios
      .get<IItem[]>("/api/items")
      .then((response) => {
        setItems(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const deleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios
        .delete(`/api/items/${id}`)
        .then(() => setItems(items.filter((item) => item._id !== id)))
        .catch((error) => console.error(error));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Inventory Items
      </Typography>
      
      {/* Conditionally render the Add New Item button */}
      {role === 'admin' && (
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/add"
          sx={{ mb: 2 }}
        >
          + Add New Item
        </Button>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Quantity</strong></TableCell>
            <TableCell><strong>Price ($)</strong></TableCell>
            <TableCell><strong>Date Added</strong></TableCell>
            <TableCell align="center"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id} hover>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description || "N/A"}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.price ? item.price.toFixed(2) : "N/A"}</TableCell>
              <TableCell>
                {item.dateAdded
                  ? new Date(item.dateAdded).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell align="center">
                {/* Conditionally render Edit and Delete buttons */}
                {role === 'admin' && (
                  <>
                    <IconButton
                      component={Link}
                      to={`/edit/${item._id}`}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteItem(item._id!)}
                      color="secondary"
                    >
                      <Delete />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default ItemList;