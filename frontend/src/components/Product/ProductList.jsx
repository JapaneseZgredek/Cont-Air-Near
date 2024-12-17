import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import AddProduct from './AddProduct';
import { fetchExcludedProducts } from '../../services/api'; // Import the new method
import { Container } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);

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

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Product List</h2>
                <AddProduct onAdd={handleAddProduct} />
            </div>

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={() => {}}
                filterOptions={['name', 'price', 'weight', 'id_port']}
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
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
        </Container>
    );
};

export default ProductList;
