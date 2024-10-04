import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Navbar from './components/Navbar';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import ItemList from './pages/ItemList';
import Login from './pages/Login';
import CreateBranch from './pages/CreateBranch';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SendReport from './components/SendReport';
import ReportList from './pages/ReportList';
import ReportDetail from './pages/ReportDetail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: "'Alef', sans-serif",  // Apply Hebrew font globally
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Redirect root to the first branch or to create a branch if none exist */}
            <Route path="/" element={<HomePage />} />
            <Route path="/reportspage" element={<ProtectedRoute><ReportList /></ProtectedRoute>} />
            <Route path="/reports/:reportId" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />

            {/* Layout route for branch-specific pages */}
            <Route path="/branch/:branchId/*" element={<Layout />}>
              <Route path="items" element={<ProtectedRoute><ItemList /></ProtectedRoute>} />
              <Route
            path="sendreport"
            element={
              <ProtectedRoute requiredRole="employee">
                <SendReport />
              </ProtectedRoute>
            }
          />
              {/* Use 'add' without ':id' for adding new items */}
              <Route
                path="add"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AddItem />
                  </ProtectedRoute>
                }
              />

              {/* Use 'edit/:id' for editing items */}
              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <EditItem />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Create Branch as a top-level route */}
            <Route
              path="/create-branch"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CreateBranch />
                </ProtectedRoute>
              }
            />

            {/* Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Fallback Route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Simple NotFound component
const NotFound: React.FC = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2>404 - Page Not Found</h2>
  </div>
);

export default App;