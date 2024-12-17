import React from 'react';
import NavbarComponent from '../components/Navbar/Navbar';
import OrderList from '../components/Order/OrderList';

const OrderPage = () => {
    return (
        <div className='listing-page'>
            {/*<NavbarComponent />*/}
            <OrderList />
        </div>
    );
};

export default OrderPage;
