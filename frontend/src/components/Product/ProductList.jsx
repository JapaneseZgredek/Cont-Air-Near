import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import AddProduct from './AddProduct';
import { fetchProducts } from '../../services/api';
import { Container } from 'react-bootstrap';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products');
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleAddProduct = (newProduct) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
    };

    const handleUpdateProduct = (updatedProduct) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id_product === updatedProduct.id_product ? updatedProduct : product
            )
        );
    };

    const handleDeleteProduct = (id) => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id_product !== id));
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Product List</h2>
                <AddProduct onAdd={handleAddProduct} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {products.length > 0 ? (
                products.map((product) => (
                    <ProductItem key={product.id_product} product={product} onDelete={handleDeleteProduct} onUpdate={handleUpdateProduct}/>))
            ) : (
                <p>No products available.</p>
            )}
        </Container>
    );
};

export default ProductList;