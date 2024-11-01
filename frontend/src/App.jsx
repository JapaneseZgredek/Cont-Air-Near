import React from 'react';
import NavbarComponent from './components/Navbar/Navbar';
import ShipList from "./components/Ship/ShipList";

const App = () => {
  return (
    <div className="App">
      <NavbarComponent />
        <ShipList />
    </div>
  );
};

export default App;
