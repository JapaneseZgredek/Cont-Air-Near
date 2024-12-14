import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import AddProduct from './AddProduct';
import { fetchProducts } from '../../services/api';
import { Container } from 'react-bootstrap';
import '../../styles/List.css';
import SearchAndFilterBar from '../SearchAndFilterBar';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("grid");

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

            {error && <p className="err-field">{"Err: "+error}</p>}
            <div className={`${displayType}-list`}>
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
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
