import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShipPage from './pages/ShipPage';
import OperationPage from './pages/OperationPage';
import PortPage from './pages/PortPage';
import ProductPage from './pages/ProductPage';
import ClientPage from './pages/ClientPage';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import Order_productPage from './pages/Order_productPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

import ProtectedRoute from './components/ProtectedRoute';
// Login Register + Navbar if we need that to be injected just as partial (in future*)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar/Navbar';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                {/* Guest Tables */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductPage />} />
                {/* New Unprotected Tables */}
                {/*Login & Register*/}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route
                    path="/ships"
                    element={
                        <ProtectedRoute>
                            <ShipPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/order_products"
                    element={
                        <ProtectedRoute>
                            <Order_productPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/order_histories"
                    element={
                        <ProtectedRoute>
                            <OrderHistoryPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/operations"
                    element={
                        <ProtectedRoute>
                            <OperationPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ports"
                    element={
                        <ProtectedRoute>
                            <PortPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <OrderPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/clients"
                    element={
                        <ProtectedRoute>
                            <ClientPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
