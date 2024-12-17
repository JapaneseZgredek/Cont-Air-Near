import React, { useEffect, useState, useContext } from 'react';
import OrderItem from './OrderItem';
import OrderAdd from './OrderAdd';
import { fetchOrders } from '../../services/api';
import { Container, Pagination, Dropdown } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("straight");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { role } = useContext(RoleContext);

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
        )};

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
            <hr className="divider" /> {/*linia podzialu*/}


            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={() => {}}
                filterOptions={['id_order', 'status', 'id_port']}
            />

            <div className='pagination-container'>
                {/* Pagination controls */}
                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    className="pagination"
                  >
                    <Pagination.First
                        className="pagination-item"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    />      
                    <Pagination.Prev
                      className="pagination-item"
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />

                    {/* Input for page number */}
                    <Pagination.Item className="pagination-item-middle" key={currentPage}>
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => {
                                const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                                handlePageChange(page);
                            }}
                            onBlur={() => handlePageChange(currentPage)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handlePageChange(currentPage);
                                }
                            }}
                            style={{ width: '50px', textAlign: 'center' }}
                        />
                      {` / ${totalPages}`}
                    </Pagination.Item>

                    <Pagination.Next
                      className="pagination-item"
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />      
                    <Pagination.Last
                        className="pagination-item"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    />
                  </Pagination>
                )}

                {/* Items per page dropdown */}
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

            {error && <p className="err-field">{"Err: "+error}</p>}
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