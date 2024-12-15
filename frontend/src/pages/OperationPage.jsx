import React from 'react';
import NavbarComponent from '../components/Navbar/Navbar';
import OperationList from '../components/Operation/OperationList';

const OperationPage = () => {
  return (
    <div className='listing-page'>
      <NavbarComponent />
      <OperationList />
    </div>
  );
};

export default OperationPage;