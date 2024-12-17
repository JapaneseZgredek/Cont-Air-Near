import React, { createContext, useState, useEffect } from 'react';
import { fetchCurrentClient } from '../services/api';

export const RoleContext = createContext({
  role: null,
  setRole: () => {},
  handleLogout: () => {},
});

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  // Fetch role initially or when needed
  const fetchRole = async () => {
    try {
      const client = await fetchCurrentClient();
      setRole(client.role);
    } catch (error) {
      console.error('Failed to fetch role:', error.message);
      setRole(null);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null); // Clear role
  };

  useEffect(() => {
    fetchRole(); // Initial role fetch
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole, handleLogout }}>
      {children}
    </RoleContext.Provider>
  );
};