import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Users from './pages/Users';
import Mess from './pages/Mess';
import Shop from './pages/Shop';
import LeaveManagement from './pages/LeaveManagement';
import RMSInbox from './pages/RMSInbox';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <PrivateRoute>
                <Rooms />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/mess"
            element={
              <PrivateRoute>
                <Mess />
              </PrivateRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <PrivateRoute>
                <Shop />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaves"
            element={
              <PrivateRoute>
                <LeaveManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/rms"
            element={
              <PrivateRoute>
                <RMSInbox />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
