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
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { useNavigate } from "react-router-dom";
const Navbar: React.FC = () => {
  const { token, role, logout } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await logout(); 
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <AppBar position="static" color="default" elevation={1}   sx={{
      boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.2)",  // Stronger shadow
    }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
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
              fontSize: { xs: "0.82rem", sm: "1rem" }, // Smaller font on extra-small screens
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
          <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap", // Prevent buttons from wrapping to the next line
            overflow: "hidden", // Hide any overflowing content
          }}
        >
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              textTransform: "none",
              fontSize: { xs: "0.75rem", sm: "1rem" }, // Smaller font on extra-small screens
              mr: { xs: 1, sm: 2 }, // Reduced margin on extra-small screens
              flexShrink: 1, // Allow button to shrink if necessary
              whiteSpace: "nowrap", // Prevent text from wrapping within the button
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
                fontSize: { xs: "0.75rem", sm: "1rem" }, // Smaller font on extra-small screens
                mr: { xs: 1, sm: 2 }, // Reduced margin on extra-small screens
                flexShrink: 1, // Allow button to shrink if necessary
                whiteSpace: "nowrap", // Prevent text from wrapping within the button
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              צור סניף
            </Button>
          )}
          {role === "admin" && (
            <Button
              color="inherit"
              component={Link}
              to="/reportspage"
              sx={{
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "1rem" }, // Smaller font on extra-small screens
                mr: { xs: 1, sm: 2 }, // Reduced margin on extra-small screens
                flexShrink: 1, // Allow button to shrink if necessary
                whiteSpace: "nowrap", // Prevent text from wrapping within the button
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              דוחות
            </Button>
          )}
        
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              fontSize: { xs: "0.75rem", sm: "1rem" }, // Smaller font on extra-small screens
              flexShrink: 1, // Allow button to shrink if necessary
              whiteSpace: "nowrap", // Prevent text from wrapping within the button
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
