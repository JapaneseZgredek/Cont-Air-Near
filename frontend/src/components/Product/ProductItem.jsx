import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteProduct } from '../../services/api';
import UpdateProduct from "./UpdateProduct";
import Order_productButton from "../Order_product/Order_productButton";
import GenericDetailModal from "../GenericDetailModal";

const ProductItem = ({ product, onUpdate, onDelete, onAddToCart }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

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

        // Usunięcie produktu z listy dostępnych produktów
        if (onAddToCart) {
            onAddToCart(product.id_product);
        }

        alert('Produkt dodany do koszyka!');
    };

    return (
        <>
            <Card className="mb-3">
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Title
                            className="clickable"
                            onClick={() => setShowDetailModal(true)}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {product.name}
                        </Card.Title>
                        <Card.Text>Price: {product.price}</Card.Text>
                        <Card.Text>Weight: {product.weight}</Card.Text>
                        <Card.Text>Port ID: {product.id_port}</Card.Text>
                    </div>
                    <div>
                        <Button variant="outline-success" className="me-2" onClick={handleAddToCart}>Add to Cart</Button>
                        <Button variant="warning" className="me-2" onClick={openUpdateModal}>Update</Button>
                        <Button variant="danger" className="me-2" onClick={() => setShowConfirm(true)}>Delete</Button>
                        <Order_productButton productId={product.id_product} productName={product.name} />
                    </div>
                </Card.Body>
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
