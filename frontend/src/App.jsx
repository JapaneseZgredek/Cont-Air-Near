import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShipPage from './pages/ShipPage';
import OperationPage from './pages/OperationPage';
import PortPage from './pages/PortPage';
import ProductPage from './pages/ProductPage';
import ClientPage from './pages/ClientPage';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    // <div className="App">
    //   <ShipPage />
    // </div>
    <Router>
      <Routes>
	<Route path="/" element={<HomePage />} />       {/*    Change to The Home button to empty element*/}
        <Route path="/ships" element={<ShipPage />} />
        <Route path="/operations" element={<OperationPage />} />
        <Route path="/ports" element={<PortPage />} />
        <Route path="/products" element={<ProductPage />} />
	<Route path="/clients" element={<ClientPage />} />
      </Routes>
    </Router>
  );
};

export default App;
