import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteProduct, fetchPorts, fetchProductImage } from '../../services/api';
import UpdateProduct from "./UpdateProduct";
import GenericDetailModal from "../GenericDetailModal";
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';
import Order_productButton from "../Order_product/Order_productButton";

const ProductItem = ({ product, onUpdate, onDelete, onAddToCart }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [loadingImage, setLoadingImage] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [displayType, setDisplayType] = useState("grid");
    const { role } = useContext(RoleContext);
    const [portName, setPortName] = useState('');
    const [error, setError] = useState('');

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

    const handleDelete = async () => {
        try {
            await deleteProduct(product.id_product);
            onDelete(product.id_product);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to delete product: ', error);
        }
    };

    const openUpdateModal = () => {
        setShowUpdateModal(true);
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
        loadImage();
    };

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

        alert('Produkt dodany do koszyka!');
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
            <Card className={`${displayType}-item-card`}>
                    <Card.Title
                            className="clickable"
                            onClick={() => setShowDetailModal(true)}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {product.name}
                        </Card.Title>
                    {/* Kontener dla tekstów */}
                    <div className="item-texts">
                        <a>Price: {product.price}</a>
                        <a>Weight: {product.weight}</a>
                        <a>Port ID: {product.id_port}</a>
                    </div>

                    {/* Obrazek */}
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

                    {/* Kontener dla przycisków */}
                    <div className="item-buttons">
                        {(['EMPLOYEE','ADMIN'].includes(role)) && (<>
                        <Button variant="outline-success" onClick={handleAddToCart}>Add to Cart</Button>
                        <Button variant="warning" onClick={openUpdateModal}>Update</Button>
                        <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>
                        </>)}
                    </div>

            </Card>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this product? There is no going back
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            <GenericDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                title={`Product: ${product.name}`}
                details={product}
            />

            <UpdateProduct
                product={product}
                show={showUpdateModal}
                onHide={closeUpdateModal}
                onUpdate={onUpdate}
            />
        </>
    );
};

export default ProductItem;
