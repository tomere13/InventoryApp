// src/pages/HomePage.tsx

import React, { useContext } from "react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import NavigateToFirstBranch from "../components/NavigateToFirstBranch";

// import NavigateToFirstBranch from "../components/NavigateToFirstBranch";

const HomePage: React.FC = () => {
  const { role } = useContext(AuthContext); // Access user and role from context
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Redirect if user is logged in
  if (role) {
    return <NavigateToFirstBranch />;
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2e2e2e 0%, #fafafa 80%)", // Dark grey gradient
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.2)", // 20% opacity black overlay to darken
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Card
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderRadius: 4,
            boxShadow: 6,
            padding: { xs: 2, md: 4 },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* Content Section */}
            <Grid item xs={12} md={6}>
              <CardContent>
                <Typography variant="h3" component="div" gutterBottom>
                  עובד יקר, ברוך הבא
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                  .הכנס למשתמש על מנת להשתמש באתר
                </Typography>
                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/login"
                    sx={{
                      mr: 2,
                      mb: { xs: 2, sm: 0 },
                      transition: "transform 0.3s",
                      backgroundColor: "#333333", // Dark background color
                      color: "#ffffff", // White text color
                      "&:hover": {
                        backgroundColor: "#555555", // Slightly lighter dark on hover
                      },
                    }}
                  >
                    התחבר
                  </Button>
                </Box>
              </CardContent>
            </Grid>

            {/* Image Section */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://cdsassets.apple.com/live/7WUAS350/images/iphone/fall-2023-iphone-colors-iphone-15-pro-max.png" // Replace with a relevant product image
                alt="Phone Accessories"
                loading="lazy"
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  width: isSmallScreen ? "100%" : "80%",
                  margin: "0 auto",
                  objectFit: "cover",
                }}
              />
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
};

export default HomePage;
