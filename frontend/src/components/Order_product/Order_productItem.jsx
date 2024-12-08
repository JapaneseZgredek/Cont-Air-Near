import React, { useEffect, useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteOrder_product } from '../../services/api';
import { fetchProducts } from '../../services/api';
import Order_productUpdate from './Order_productUpdate';


const Order_productItem = ({ order_product, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        try {
            await deleteOrder_product(order_product.id_order, order_product.id_product);
            onDelete(order_product.id_order, order_product.id_product);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to delete order_product:', error);
        }
    };

    const openUpdateModal = () => {
        setShowUpdateModal(true);
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
    };

    const [products, setProducts] = useState([]);
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

    return (
        <>
            <Card className="mb-3">
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Title>Order ID: {order_product.id_order} Product: {
                            products.find((product) => product.id_product === order_product.id_product)?.name || 'Unknown Product'
                        }
                        </Card.Title>
                        <Card.Text>Quantity {order_product.quantity}</Card.Text>

                    </div>
                    <div>
                        <Button variant="warning" className="me-2" onClick={openUpdateModal}>Update</Button>
                        <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this order_product?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            <Order_productUpdate
                order_product={order_product}
                show={showUpdateModal}
                onHide={closeUpdateModal}
                onUpdate={onUpdate}
            />
        </>
    );
};

export default Order_productItem;
