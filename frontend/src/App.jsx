import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, loading } = useContext(AuthContext);

  // Show loading state while context data is loading ⏳
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-teal-400 font-medium">
        Loading... ⏳
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Redirect to Dashboard if already logged in */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

        {/* Protected Dashboard route */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;