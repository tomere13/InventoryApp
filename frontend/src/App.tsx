// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Navbar from './components/Navbar';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import ItemList from './pages/ItemList';
import Login from './pages/Login'; // New login page
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<ItemList />} />
            <Route path="/add" element={<ProtectedRoute requiredRole="admin"><AddItem /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute requiredRole="admin"><EditItem /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;