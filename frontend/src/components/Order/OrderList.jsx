import React, { useEffect, useState } from 'react';
import OrderItem from './OrderItem';
import OrderAdd from './OrderAdd';
import { fetchOrders } from '../../services/api';
import { Container } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);

    const loadOrders = async () => {
        try {
            const data = await fetchOrders();
            setOrders(data);
            setFilteredOrders(data); // Initialize filteredOrders with fetched orders
        } catch (err) {
            //setError('Failed to load orders');
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // Synchronize filteredOrders with orders whenever orders change
    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders]);

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredOrders(orders);
        } else if (searchInColumn) {
            const filtered = orders.filter(order =>
                order[searchInColumn] && order[searchInColumn].toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOrders(filtered);
        } else {
            const filtered = orders.filter(order =>
                Object.values(order).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredOrders(filtered);
        }
    };

    const handleSearchInChange = (column) => {
        setSearchInColumn(column);
    };

    const handleAddOrder = (newOrder) => {
        setOrders((prevOrders) => [...prevOrders, newOrder]);
    };

    const handleDeleteOrder = (id) => {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id_order !== id));
    };

    const handleUpdateOrder = (updatedOrder) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id_order === updatedOrder.id_order ? updatedOrder : order))
        );
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Order List</h2>
                <OrderAdd onAdd={handleAddOrder} />
            </div>

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={() => {}}
                filterOptions={['id_order', 'status', 'id_port']}
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
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