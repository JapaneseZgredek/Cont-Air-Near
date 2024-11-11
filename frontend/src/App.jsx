import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShipPage from './pages/ShipPage';
import OperationPage from './pages/OperationPage';
import PortPage from './pages/PortPage';
import ProductPage from './pages/ProductPage';
import OrderPage from './pages/OrderPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/ships" element={<ShipPage />} />
                <Route path="/operations" element={<OperationPage />} />
                <Route path="/ports" element={<PortPage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/orders" element={<OrderPage />} />
                <Route path="/" element={<ShipPage />} />
            </Routes>
        </Router>
    );
};

export default App;
