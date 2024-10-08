// src/components/Layout.tsx

import React, { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import BranchSelector from "./BranchSelector";
import { Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const Layout: React.FC = () => {
  const { role, logout } = useContext(AuthContext);

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px' }}> {/* Added marginTop */}
      
      <BranchSelector />
      <Outlet />
    </Container>
  );
};

export default Layout;