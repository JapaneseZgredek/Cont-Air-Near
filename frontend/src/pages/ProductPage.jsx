import React from 'react';
import NavbarComponent from '../components/Navbar/Navbar';
import ProductList from '../components/Product/ProductList';

const ProductPage = () => {
  return (
    <div className='listing-page'>
      {/*<NavbarComponent />*/}
      <ProductList />
    </div>
  );
};

export default ProductPage;
