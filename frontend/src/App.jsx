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

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/ships" element={<ShipPage />} />
                <Route path="/operations" element={<OperationPage />} />
                <Route path="/ports" element={<PortPage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/orders" element={<OrderPage />} />
                <Route path="/order_products" element={<Order_productPage />} />
                <Route path="/order_histories" element={<OrderHistoryPage />} />
                <Route path="/clients" element={<ClientPage />} />
                <Route path="/" element={<HomePage />} />
            </Routes>
        </Router>
    );
};

export default App;
