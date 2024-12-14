import React from 'react';
import NavbarComponent from '../components/Navbar/Navbar';
import PortList from '../components/Port/PortList';

const PortPage = () => {
  return (
    <div className='listing-page'>
      <NavbarComponent />
      <PortList />
    </div>
  );
};

export default PortPage;
