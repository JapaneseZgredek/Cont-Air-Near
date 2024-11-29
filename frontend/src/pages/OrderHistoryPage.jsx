import React from 'react';
import NavbarComponent from '../components/Navbar/Navbar';
import OrderHistoryList from '../components/OrderHistory/OrderHistoryList';

const OrderHistoryPage = () => {
    return (
        <div>
            <NavbarComponent />
            <OrderHistoryList />
        </div>
    );
};

export default OrderHistoryPage;
