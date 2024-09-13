// src/components/Navbar.tsx

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid"; // Example icon, replace with your logo if available
import { useNavigate } from "react-router-dom";
const Navbar: React.FC = () => {
  const { token, role, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogout = async () => {
    try {
      await logout(); // Perform the logout action
      navigate("/"); // Redirect to the homepage
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, handle the error (e.g., display a notification)
    }
  };
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Logo and Title */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          {/* Replace PhoneAndroidIcon with your logo if available */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            component={Link}
            to="/"
            sx={{ mr: 1 }}
          >
            <PhoneAndroidIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
            }}
          >
            ניהול מלאי
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Buttons */}
        {token ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                mr: 2,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              דף בית
            </Button>

            {role === "admin" && (
              <Button
                color="inherit"
                component={Link}
                to="/create-branch"
                sx={{
                  textTransform: "none",
                  fontSize: "1rem",
                  mr: 2,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                צור סניף חדש
              </Button>
            )}

            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              התנתק
            </Button>
          </Box>
        ) : (
          <Button
            color="inherit"
            component={Link}
            to="/login"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            התחבר
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
