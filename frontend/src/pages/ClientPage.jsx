import React from 'react';
import NavbarComponent from '../components/Navbar/Navbar';
import ClientList from '../components/Client/ClientList';

const ClientPage = () => {
  return (
    <div className='listing-page'>
      {/* <NavbarComponent /> */}
      <ClientList />
    </div>
  );
};

export default ClientPage;