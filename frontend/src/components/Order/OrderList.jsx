import React, { useEffect, useState } from 'react';
import OrderItem from './OrderItem';
import OrderAdd from './OrderAdd';
import { fetchOrders } from '../../services/api';
import { Container } from 'react-bootstrap';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    const loadOrders = async () => {
        try {
            const data = await fetchOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to load orders');
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleAddOrder = (newOrder) => {
        setOrders((prevOrders) => [...prevOrders, newOrder]);
    };

    const handleUpdateOrder = (updatedOrder) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id_order === updatedOrder.id_order ? updatedOrder : order
            )
        );
    };

    const handleDeleteOrder = (id) => {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id_order !== id));
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Order List</h2>
                <OrderAdd onAdd={handleAddOrder} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {orders.length > 0 ? (
                orders.map((order) => (
                    <OrderItem
                        key={order.id_order}
                        order={order}
                        onDelete={handleDeleteOrder}
                        onUpdate={handleUpdateOrder}
                    />
                ))
            ) : (
                <p>No orders available.</p>
            )}
        </Container>
    );
};

export default OrderList;
