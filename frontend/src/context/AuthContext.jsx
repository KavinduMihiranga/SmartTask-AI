import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check for token on app load 🔍
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      // Setting token to Axios headers 🛡️
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // 2. Login Function 🔑
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      if (response.data && response.data.token) {
        const userData = response.data.user;
        const token = response.data.token;

        setUser(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        localStorage.setItem('token', token);

        // Setting Axios Header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed.'
      };
    }
  };

  // 3. Register Function ✨
  const registerUser = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      
      if (response.data) {
        return { success: true, isSignup: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      };
    }
  };

  // 4. Logout Function 🚪
  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};