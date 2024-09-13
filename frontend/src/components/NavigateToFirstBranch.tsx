// src/components/NavigateToFirstBranch.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBranches } from "../services/branchService";
import { IBranch } from "../types";
import { CircularProgress, Alert, Container } from "@mui/material";

const NavigateToFirstBranch: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFirstBranch = async () => {
      try {
        const branches: IBranch[] = await getBranches();
        if (branches.length > 0) {
          // Set loading to false before navigation
          setLoading(false);
          navigate(`/branch/${branches[0]._id}/items`, { replace: true });
        } else {
          // Set loading to false before navigating to create branch page
          setLoading(false);
          navigate(`/create-branch`, { replace: true });
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
        setError("Failed to load branches.");
        setLoading(false);
      }
    };

    fetchFirstBranch();
  }, [navigate]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", marginTop: "50px" }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return null;
};

export default NavigateToFirstBranch;