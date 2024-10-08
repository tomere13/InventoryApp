// src/pages/CreateBranch.tsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createBranch } from "../services/branchService";

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

const CreateBranch: React.FC = () => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [branch, setBranch] = useState({
    name: "",
    address: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  if (role !== "admin") {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Access Denied. Only admins can create branches.</Alert>
        </Box>
      </Container>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBranch((prevBranch) => ({
      ...prevBranch,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!branch.name.trim() || !branch.address.trim()) {
      setError("Name and Address are required.");
      return;
    }

    setLoading(true);
    try {
      const newBranch = await createBranch({
        name: branch.name.trim(),
        address: branch.address.trim(),
      });
      setSuccess(true);
      setBranch({ name: "", address: "" });
      navigate(`/branch/${newBranch._id}/items`); // Redirect to the new branch's item list
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create branch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create New Branch
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Branch created successfully!
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Branch Name"
            name="name"
            value={branch.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={branch.address}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={3}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Branch"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateBranch;