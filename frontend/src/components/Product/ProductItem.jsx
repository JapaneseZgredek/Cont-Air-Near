import React, { useState, useEffect, useContext } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchPorts, fetchProductImage } from '../../services/api';
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const ProductItem = ({ product, onAddToCart }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loadingImage, setLoadingImage] = useState(true);
    const [portName, setPortName] = useState('');
    const [error, setError] = useState('');
    const { role } = useContext(RoleContext);
    const navigate = useNavigate();

    // Fetch port names based on the product's id_port
    useEffect(() => {
        const fetchPortName = async () => {
            try {
                const portsResponse = await fetchPorts();
                const foundPort = portsResponse.find(port => port.id_port === product.id_port);
                setPortName(foundPort ? foundPort.name : 'Unknown Port');
            } catch (error) {
                setError('Error fetching port name');
                console.error('Error fetching port name:', error);
            }
        };

        fetchPortName();
    }, [product.id_port]);

    const handleAddToCart = () => {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = existingCart.find(item => item.id_product === product.id_product);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            existingCart.push({
                ...product,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(existingCart));

        if (onAddToCart) {
            onAddToCart(product.id_product);
        }

        alert('Product added to cart!');
    };

    const loadImage = async () => {
        try {
            setLoadingImage(true);
            const url = await fetchProductImage(product.id_product);
            setImageUrl(url);
        } catch (error) {
            console.error("Failed to load product image", error);
            setImageUrl(null);
        } finally {
            setLoadingImage(false);
        }
    };

    useEffect(() => {
        loadImage();
    }, [product.id_product]);

    return (
        <>
            <Card className="grid-item-card">
                <Card.Title
                    className="clickable"
                    onClick={() => navigate(`/products/${product.id_product}`)} // Navigate to product details view
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {product.name}
                </Card.Title>
                {/* Container for texts */}
                <div className="item-texts">
                    <a>Price: {product.price}</a>
                    <a>Weight: {product.weight}</a>
                    <a>Port: {portName || 'Loading...'}</a>
                </div>

                {/* Image */}
                <div>
                    {loadingImage ? (
                        <div className="loading-message">Loading image...</div>
                    ) : imageUrl ? (
                        <img
                            className="item-image"
                            src={imageUrl}
                            alt={`Product_${product.id_product}`}
                        />
                    ) : (
                        <div className="missing-image">Missing image</div>
                    )}
                </div>

                {/* Buttons */}
                <div className="item-buttons">
                    {(['CLIENT', 'EMPLOYEE', 'ADMIN'].includes(role)) && (
                        <button
                            className="btn btn-outline-success"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </Card>
        </>
    );
};

export default ProductItem;
