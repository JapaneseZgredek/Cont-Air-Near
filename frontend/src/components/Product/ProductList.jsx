import React, { useEffect, useState, useContext } from 'react';
import ProductItem from './ProductItem';
import AddProduct from './AddProduct';
import { fetchExcludedProducts } from '../../services/api';
import { Container, Pagination, Dropdown } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInColumn, setSearchInColumn] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { role } = useContext(RoleContext);

    const loadProducts = async () => {
        try {
            const data = await fetchExcludedProducts();
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartProductIds = cart.map(item => item.id_product);

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

    useEffect(() => {
        let filtered = [...products];

        // Apply search filtering
        if (searchTerm) {
            filtered = filtered.filter(product => {
                const value = searchInColumn ? product[searchInColumn] : null;

                if (!searchInColumn) {
                    return Object.values(product).some(val =>
                        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        // Apply sorting
        if (sortValue) {
            filtered.sort((a, b) => {
                const valueA = a[sortValue];
                const valueB = b[sortValue];

                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    return valueA - valueB;
                }

                return valueA?.toString().localeCompare(valueB?.toString());
            });
        }

        setFilteredProducts(filtered);
    }, [products, searchTerm, searchInColumn, sortValue]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleSearchInChange = (column) => {
        setSearchInColumn(column);
    };

    const handleSortChange = (sortField) => {
        setSortValue(sortField);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const handleAddProduct = (newProduct) => {
        setProducts(prevProducts => [...prevProducts, newProduct]);
    };

    const handleDeleteProduct = (id) => {
        setProducts(prevProducts => prevProducts.filter(product => product.id_product !== id));
    };

    const handleUpdateProduct = (updatedProduct) => {
        setProducts(prevProducts =>
            prevProducts.map(product => (product.id_product === updatedProduct.id_product ? updatedProduct : product))
        );
    };

    const handleProductAddedToCart = (productId) => {
        setProducts(prevProducts => prevProducts.filter(product => product.id_product !== productId));
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Products</h2>
                {(['EMPLOYEE', 'ADMIN'].includes(role)) && (
                    <AddProduct onAdd={handleAddProduct} />
                )}
            </div>
            <hr className="divider" />

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={handleSortChange}
                filterOptions={['name', 'price', 'weight']}
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
                            onClick={() => handlePageChange(currentPage + 1)}
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
                        {[1, 5, 10, 25, 50].map(number => (
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
                    currentItems.map(product => (
                        <ProductItem
                            key={product.id_product}
                            product={product}
                            onDelete={handleDeleteProduct}
                            onUpdate={handleUpdateProduct}
                            onAddToCart={handleProductAddedToCart}
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
