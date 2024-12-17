import React from 'react';
import NavbarComponent from '../components/Navbar/Navbar';
import Order_productList from '../components/Order_product/Order_productList';

const Order_productPage = () => {
  return (
    <div className='listing-page'>
      {/*<NavbarComponent />*/}
      <Order_productList />
    </div>
  );
};

export default Order_productPage;
