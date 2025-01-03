import React, { useEffect, useState, useContext } from 'react';
import ProductItem from './ProductItem';
import AddProduct from './AddProduct';
import { fetchExcludedProducts } from '../../services/api'; // Import the new method
import { Container, Pagination, Dropdown } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { role } = useContext(RoleContext);

    const loadProducts = async () => {
        try {
            const data = await fetchExcludedProducts(); // Call the new API method
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartProductIds = cart.map(item => item.id_product);

            // Filter products that are not in the cart
            const availableProducts = data.filter(product => !cartProductIds.includes(product.id_product));

            setProducts(availableProducts);
            setFilteredProducts(availableProducts);
        } catch (err) {
            console.error('Failed to load products:', err);
            setError('Failed to load products');
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Add a new product
    const handleAddProduct = (newProduct) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setFilteredProducts((prevProducts) => [...prevProducts, newProduct]);
    };

    // Update a product in the list
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

    // Delete a product from the list
    const handleDeleteProduct = (id) => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id_product !== id));
        setFilteredProducts((prevProducts) => prevProducts.filter((product) => product.id_product !== id));
    };

    // Remove a product from ProductList after adding it to the cart
    const handleProductAddedToCart = (productId) => {
        setProducts((prevProducts) => prevProducts.filter(product => product.id_product !== productId));
        setFilteredProducts((prevProducts) => filteredProducts.filter(product => product.id_product !== productId));
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
                {(['EMPLOYEE','ADMIN'].includes(role)) && (
                <AddProduct onAdd={handleAddProduct} />
                )}
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
                        onAddToCart={handleProductAddedToCart} // Pass the function to ProductItem
                    />
                ))
            ) : (
                <p>No available products.</p>
            )}
            </div>
        </Container>
    );
};

export default ProductList;
