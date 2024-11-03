import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShipPage from './pages/ShipPage';
import OperationPage from './pages/OperationPage';
import PortPage from './pages/PortPage';

const App = () => {
  return (
    // <div className="App">
    //   <ShipPage />
    // </div>
    <Router>
      <Routes>
        <Route path="/ships" element={<ShipPage />} />
        <Route path="/operations" element={<OperationPage />} />
        <Route path="/ports" element={<PortPage />} />
        <Route path="/" element={<ShipPage />} />       {/*    Change to The Home button to empty element*/}
      </Routes>
    </Router>
  );
};

export default App;
