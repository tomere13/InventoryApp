// src/pages/Login.tsx

import React, { useState, useContext } from 'react';
import axios from '../utils/axiosInstance';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Link,
  Card,
  CardContent,
  Avatar,
  Grid,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NavigateToFirstBranch from '../components/NavigateToFirstBranch';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '', remember: false });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, checked, type } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        username: credentials.username,
        password: credentials.password,
      });
      const { token, role } = response.data;
      login(token, role);
      navigate('/'); // Replace '/first-branch' with the correct route

    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: '#fafafa', // Light gray background color
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Card
          sx={{
            padding: 4,
            boxShadow: 6,
            borderRadius: 2,
            backgroundColor: "#ffffff", // White background for the card
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, backgroundColor: '#333333', // Dark background color
    color: '#ffffff', // White text color
    '&:hover': {
      backgroundColor: '#555555', // Slightly lighter dark on hover
    },}}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              התחבר
            </Typography>
            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="שם משתמש"
                name="username"
                autoComplete="username"
                autoFocus
                value={credentials.username}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="סיסמא"
                type="password"
                id="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                variant="outlined"
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2, height: '56px',backgroundColor: '#333333', // Dark background color
                  color: '#ffffff', // White text color
                  '&:hover': {
                    backgroundColor: '#555555', // Slightly lighter dark on hover
                  }, }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'התחבר'}
              </Button>
              
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;