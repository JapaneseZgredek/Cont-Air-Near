import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteOrder } from '../../services/api';
import OrderUpdate from './OrderUpdate';
import Order_productButton from "../Order_product/Order_productButton";
import GenericDetailModal from "../GenericDetailModal";

const OrderItem = ({ order, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Handle delete action
    const handleDelete = async () => {
        try {
            await deleteOrder(order.id_order);  // Delete the order from the database
            onDelete(order.id_order);  // Notify the parent to remove the order from the state
            setShowConfirm(false);  // Close the confirmation modal
        } catch (error) {
            console.error('Failed to delete order:', error);
        }
    };

    // Open the update modal
    const openUpdateModal = () => {
        setShowUpdateModal(true);
    };

    // Close the update modal
    const closeUpdateModal = () => {
        setShowUpdateModal(false);
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
                            Order ID: {order.id_order}
                        </Card.Title>
                        <Card.Text>Status: {order.status}</Card.Text>
                        <Card.Text>Description: {order.description}</Card.Text>
                        <Card.Text>Port ID: {order.id_port}</Card.Text>
                        <Card.Text>Client ID: {order.id_client}</Card.Text>
                    </div>
                    <div>
                        <Button variant="warning" className="me-2" onClick={openUpdateModal}>Update</Button>
                        <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>
                        <Order_productButton orderId={order.id_order} />
                    </div>
                </Card.Body>
            </Card>

            {/* Confirm Deletion Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Order Detail Modal */}
            <GenericDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                title={`Order: ${order.id_order}`}
                details={order}
            />

            {/* Order Update Modal */}
            <OrderUpdate
                order={order}
                show={showUpdateModal}
                onHide={closeUpdateModal}
                onUpdate={onUpdate}  // Pass onUpdate to handle the update in the parent component
            />
        </>
    );
};

export default OrderItem;
