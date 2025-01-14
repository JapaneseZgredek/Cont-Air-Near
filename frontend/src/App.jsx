import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarComponent from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { fetchCurrentClient } from './services/api';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import ShipPage from './pages/ShipPage';
import OperationPage from './pages/OperationPage';
import PortPage from './pages/PortPage';
import ClientPage from './pages/ClientPage';
import OrderPage from './pages/OrderPage';
import Order_productPage from './pages/Order_productPage';
import UserPanelPage from './pages/UserPanelPage';

import { RoleProvider } from "./contexts/RoleContext";
import Cart from "./components/Cart/Cart";
import OrderDetails from "./components/Order/OrderDetails";
import PortDetails from "./components/Port/PortDetails";
import ProductDetails from "./components/Product/ProductDetails";
import ClientDetails from "./components/Client/ClientDetails";
import ShipDetails from "./components/Ship/ShipDetails";
import OperationDetails from "./components/Operation/OperationDetails";

const App = () => {
  const [role, setRole] = useState(null);

  const fetchRole = async () => {
    try {
      const client = await fetchCurrentClient();
      setRole(client.role);
    } catch (error) {
      console.error('Failed to fetch role:', error.message);
      setRole(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null); // Reset role on logout
    window.location.reload(); // Refresh page after logout
  };

  useEffect(() => {
    fetchRole();

    const token = localStorage.getItem('token');
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
      const timeUntilExpiration = expirationTime - Date.now();

      if (timeUntilExpiration > 0) {
        const timeout = setTimeout(() => {
          handleLogout();
          alert('Session expired, you have been logged out.');
        }, timeUntilExpiration);

        return () => clearTimeout(timeout); // Cleanup timeout
      } else {
        handleLogout();
      }
    }
  }, []);

  return (
    <RoleProvider value={{ role, handleLogout }}>
      <Router>
        <NavbarComponent />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route
              path="/products"
              element={
              <ProtectedRoute requiredRoles={['CLIENT','EMPLOYEE', 'ADMIN']}>
              <ProductPage />
              </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage onLoginSuccess={fetchRole} />} />
          <Route path="/register" element={<RegisterPage onRegisterSuccess={fetchRole} />} />

          {/* Protected Routes */}
          <Route
            path="/ships"
            element={
              <ProtectedRoute requiredRoles={['EMPLOYEE', 'ADMIN']}>
                <ShipPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operations"
            element={
              <ProtectedRoute requiredRoles={['EMPLOYEE', 'ADMIN']}>
                <OperationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ports"
            element={
              <ProtectedRoute requiredRoles={['CLIENT', 'EMPLOYEE', 'ADMIN']}>
                <PortPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRoles={['CLIENT', 'EMPLOYEE', 'ADMIN']}>
                <OrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order_products"
            element={
              <ProtectedRoute requiredRoles={['EMPLOYEE', 'ADMIN']}>
                <Order_productPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients"
            element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <ClientPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user_panel"
            element={
              <ProtectedRoute requiredRoles={['CLIENT', 'EMPLOYEE', 'ADMIN']}>
                <UserPanelPage />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/ports/:id" element={<PortDetails />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/ships/:id" element={<ShipDetails />} />
          <Route path="/operations/:id_operation" element={<OperationDetails />} />
        </Routes>
      </Router>
    </RoleProvider>
  );
};

export default App;
