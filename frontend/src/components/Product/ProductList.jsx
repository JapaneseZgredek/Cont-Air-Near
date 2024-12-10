import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import AddProduct from './AddProduct';
import { fetchProducts } from '../../services/api';
import { Container } from 'react-bootstrap';
import '../../styles/List.css';

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
            <hr className="product-list-divider" /> {/*linia podzialu*/}
            {error && <p className="err-field">{"Err: "+error}</p>}
            <div className="list">
            {products.length > 0 ? (
                products.map((product) => (
                    <ProductItem key={product.id_product} product={product} onDelete={handleDeleteProduct} onUpdate={handleUpdateProduct}/>))
            ) : (
                <p>No products available.</p>
            )}
            </div>
        </Container>
    );
};

export default ProductList;