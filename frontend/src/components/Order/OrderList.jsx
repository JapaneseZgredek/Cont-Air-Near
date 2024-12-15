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

    // Load orders initially
    const loadOrders = async () => {
        try {
            const data = await fetchOrders();
            setOrders(data);
            setFilteredOrders(data);
            setError(null); // Clear error once orders are successfully loaded
        } catch (err) {
            setError('Failed to load orders');
        }
    };

    // Call loadOrders on component mount
    useEffect(() => {
        loadOrders();
    }, []);

    // Handle search functionality
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

    // Handle change in search column
    const handleSearchInChange = (column) => {
        setSearchInColumn(column);
    };

    // Handle adding a new order
    const handleAddOrder = (newOrder) => {
        setOrders((prevOrders) => [...prevOrders, newOrder]);  // Add the new order to the list
        setFilteredOrders((prevOrders) => [...prevOrders, newOrder]);  // Update filtered orders as well
        setError(null);  // Clear error if any new order is successfully added
    };

    // Handle deleting an order
    const handleDeleteOrder = (id) => {
        setOrders((prevOrders) => prevOrders.filter(order => order.id_order !== id));  // Delete order from the list
        setFilteredOrders((prevOrders) => prevOrders.filter(order => order.id_order !== id));  // Update filtered orders
    };

    // Handle updating an order
    const handleUpdateOrder = (updatedOrder) => {
        setOrders((prevOrders) => prevOrders.map(order =>
            order.id_order === updatedOrder.id_order ? updatedOrder : order
        ));  // Update the order in the list
        setFilteredOrders((prevOrders) => prevOrders.map(order =>
            order.id_order === updatedOrder.id_order ? updatedOrder : order
        ));  // Update filtered orders
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
