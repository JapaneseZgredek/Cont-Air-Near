import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import AddProduct from './AddProduct';
import { fetchProducts } from '../../services/api';
import { Container, Pagination, Dropdown } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';
import '../../styles/List.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (err) {
            setError('Failed to load products');
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleAddProduct = (newProduct) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setFilteredProducts((prevProducts) => [...prevProducts, newProduct]);
    };

    const handleUpdateProduct = (updatedProduct) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id_product === updatedProduct.id_product ? updatedProduct : product
            )
        );
        setFilteredProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id_product === updatedProduct.id_product ? updatedProduct : product
            )
        );
    };

    const handleDeleteProduct = (id) => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id_product !== id));
        setFilteredProducts((prevProducts) => prevProducts.filter((product) => product.id_product !== id));
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredProducts(products);
        } else if (searchInColumn) {
            const filtered = products.filter(product =>
                product[searchInColumn] && product[searchInColumn].toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            const filtered = products.filter(product =>
                Object.values(product).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredProducts(filtered);
        }
    };

    const handleSearchInChange = (column) => {
        setSearchInColumn(column);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Products</h2>
                <AddProduct onAdd={handleAddProduct} />
            </div>
            <hr className="divider" /> {/*linia podzialu*/}


            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={() => {}}
                filterOptions={['name', 'price', 'weight', 'id_port']}
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
                currentItems.map((product) => (
                    <ProductItem
                        key={product.id_product}
                        product={product}
                        onDelete={handleDeleteProduct}
                        onUpdate={handleUpdateProduct}
                    />
                ))
            ) : (
                <p>No products available.</p>
            )}
            </div>
        </Container>
    );
};

export default ProductList;
