// src/pages/ItemList.tsx

import React, { useState, useEffect, useContext } from "react";
import axios from '../utils/axiosInstance';
import { IItem } from "../types";
import { Link } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate, useParams } from 'react-router-dom';

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
  const {branchId} = useParams<{ branchId: string }>(); // Get branchId from the URL

  useEffect(() => {
    console.log(branchId);
    
    axios
      .get<IItem[]>(`/api/${branchId}/items`)
      .then((response) => {
        response.data = response.data.filter(item => item.branch == branchId);
        setItems(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const deleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios
        .delete(`/api/${branchId}/items/${id}`)
        .then(() => setItems(items.filter((item) => item._id !== id)))
        .catch((error) => console.error(error));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        מוצרי מלאי
      </Typography>
      
      {/* Conditionally render the Add New Item button */}
      {role === 'admin' && branchId && (
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/branch/${branchId}/add`} // Navigate to the correct branch-specific add item page
          sx={{ mb: 2 }}
        > 
          + הוסף מוצר חדש
        </Button>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>שם</strong></TableCell>
            <TableCell><strong>תיאור</strong></TableCell>
            <TableCell><strong>כמות</strong></TableCell>
            <TableCell><strong>מחיר ($)</strong></TableCell>
            <TableCell><strong>תאריך הוספה</strong></TableCell>
            <TableCell align="center"><strong>פעולות</strong></TableCell>
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
                      to={`/branch/${branchId}/edit/${item._id}`}
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