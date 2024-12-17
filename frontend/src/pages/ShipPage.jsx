import React from 'react';
import NavbarComponent from '../components/Navbar/Navbar';
import ShipList from '../components/Ship/ShipList';

const ShipPage = () => {
  return (
    <div className='listing-page'>
      {/*<NavbarComponent />*/}
      <ShipList />
    </div>
  );
};

export default ShipPage;
