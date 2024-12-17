import React, { useEffect, useState } from 'react';
import Order_productItem from './Order_productItem';
import Order_productAdd from './Order_productAdd';
import { fetchOrders_products } from '../../services/api';
import { Container, Pagination, Dropdown } from 'react-bootstrap';
import '../../styles/List.css';

const Order_productList = () => {
    const [order_products, setOrder_products] = useState([]);
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("straight");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const loadOrder_products = async () => {
        try {
            const data = await fetchOrders_products();
            setOrder_products(data);
        } catch (err) {
            setError('Failed to load order_products');
        }
    };

    useEffect(() => {
        loadOrder_products();
    }, []);

    const handleAddOrder_product = (newOrder_product) => {
        setOrder_products((prevOrder_products) => [...prevOrder_products, newOrder_product]);
    };

    const handleUpdateOrder_product = (updatedOrder_product) => {
        setOrder_products((prevOrder_products) =>
            prevOrder_products.map((order_product) =>
                order_product.id_order === updatedOrder_product.id_order &&
                order_product.id_product === updatedOrder_product.id_product
                    ? updatedOrder_product
                    : order_product
            )
        );
    };

    const handleDeleteOrder_product = (id_order, id_product) => {
        setOrder_products((prevOrder_products) =>
            prevOrder_products.filter(
                (order_product) =>
                    !(order_product.id_order === id_order && order_product.id_product === id_product)
            )
        );
    };
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(order_products.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = order_products.slice(indexOfFirstItem, indexOfLastItem);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Order_product List</h2>
            </div>
            <hr className="divider" /> {/*linia podzialu*/}

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
                currentItems.map((order_product) => (
                    <Order_productItem
                        key={`${order_product.id_order}-${order_product.id_product}`} // Ensure unique key
                        order_product={order_product}
                        onDelete={handleDeleteOrder_product}
                        onUpdate={handleUpdateOrder_product}
                    />
                ))
            ) : (
                <p>No order_products available.</p>
            )}
            </div>
        </Container>
    );
};

export default Order_productList;
