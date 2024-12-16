import React, { useEffect, useState } from 'react';
import OrderItem from './OrderItem';
import OrderAdd from './OrderAdd';
import { fetchOrders, fetchPorts, fetchClients } from '../../services/api';
import { Container } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';
import OrdersButton from './OrdersButton';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [ports, setPorts] = useState([]);
    const [clients, setClients] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);

    // Fetch orders, ports, and clients
    const loadOrders = async () => {
        try {
            const [ordersData, portsData, clientsData] = await Promise.all([
                fetchOrders(),
                fetchPorts(),
                fetchClients(),
            ]);

            // Enrich the orders with port and client names
            const enrichedOrders = ordersData.map(order => {
                // Find the port and client names using the order's respective ids
                const port = portsData.find(port => port.id_port === order.id_port);
                const client = clientsData.find(client => client.id_client === order.id_client);

                return {
                    ...order,
                    portname: port ? port.name : 'Unknown Port', // Default to 'Unknown Port' if not found
                    clientname: client ? client.name : 'Unknown Client', // Default to 'Unknown Client' if not found
                };
            });

            setOrders(enrichedOrders);
            setFilteredOrders(enrichedOrders);
            setPorts(portsData);
            setClients(clientsData);
            setError(null);
        } catch (err) {
            setError('Failed to load orders');
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

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
        setFilteredOrders((prevOrders) => [...prevOrders, newOrder]);
        setError(null);
    };

    const handleDeleteOrder = (id) => {
        setOrders((prevOrders) => prevOrders.filter(order => order.id_order !== id));
        setFilteredOrders((prevOrders) => prevOrders.filter(order => order.id_order !== id));
    };

    const handleUpdateOrder = (updatedOrder) => {
        setOrders((prevOrders) => prevOrders.map(order =>
            order.id_order === updatedOrder.id_order ? updatedOrder : order
        ));
        setFilteredOrders((prevOrders) => prevOrders.map(order =>
            order.id_order === updatedOrder.id_order ? updatedOrder : order
        ));
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
                    <div key={order.id_order} className="mb-3">
                        {/* Render OrderItem */}
                        <OrderItem
                            order={order}
                            onDelete={handleDeleteOrder}
                            onUpdate={handleUpdateOrder}
                        />
                    </div>
                ))
            ) : (
                <p>No orders available.</p>
            )}
        </Container>
    );
};

export default OrderList;
