import React, { useEffect, useState, useContext } from 'react';
import OrderItem from './OrderItem';
import OrderAdd from './OrderAdd';
import { fetchOrders, fetchCurrentClient, fetchOrdersForOwner } from '../../services/api';
import { Container, Pagination, Dropdown } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState('straight');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { role } = useContext(RoleContext);

    // Fetch orders based on the role
    const loadOrders = async () => {
        try {
            const client = await fetchCurrentClient();
            let data;
            if (client.role == "CLIENT"){
                data = await fetchOrdersForOwner(client.id_client);
            }
            else{
                data = await fetchOrders();
            }
            setOrders(data);
            setFilteredOrders(data);
        } catch (err) {
            setError('Failed to load orders');
            console.error('Error fetching orders:', err);
        }
    };

    useEffect(() => {
        loadOrders(); // Load orders on component mount
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

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

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Orders</h2>
                {(['ADMIN'].includes(role)) && (
                <OrderAdd onAdd={(newOrder) => setOrders(prev => [...prev, newOrder])} />
                )}

                {/*<h2>Order List</h2>*/}
                {/*<OrderAdd onAdd={handleAddOrder} />*/}

            </div>
            <hr className="divider" />

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={() => {}}
                filterOptions={['id_order', 'status', 'id_port']}
            />

            <div className="pagination-container">
                {totalPages > 1 && (
                    <Pagination>
                        <Pagination.First
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        <Pagination.Item active>{currentPage}</Pagination.Item>
                        <Pagination.Next
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                )}

                <Dropdown onSelect={handleItemsPerPageChange}>
                    <Dropdown.Toggle variant="success" id="dropdown-items-per-page">
                        Items per page: {itemsPerPage}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {[1, 5, 10, 25, 50].map((number) => (
                            <Dropdown.Item key={number} eventKey={number}>
                                {number}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {error && <p className="err-field">{"Err: " + error}</p>}
            <div className={`${displayType}-list`}>
                {currentItems.length > 0 ? (
                    currentItems.map((order) => (
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
            </div>
        </Container>
    );
};

export default OrderList;
