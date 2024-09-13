// src/components/BranchSelector.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, SelectChangeEvent } from "@mui/material";
import { IBranch } from "../types";
import { getBranches } from '../services/branchService';

const BranchSelector: React.FC = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const navigate = useNavigate();
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getBranches();
        setBranches(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branches.');
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newBranchId = event.target.value;
    window.location.href = `/branch/${newBranchId}/items`;
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <FormControl variant="outlined" sx={{ minWidth: 200, mb: 2 }}>
      <InputLabel id="branch-select-label">Select Branch</InputLabel>
      <Select
        labelId="branch-select-label"
        value={branchId || ''}
        onChange={handleChange}
        label="Select Branch"
      >
        {branches.map(branch => (
          <MenuItem key={branch._id} value={branch._id}>
            {branch.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BranchSelector;