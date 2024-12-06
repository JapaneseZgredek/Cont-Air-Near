import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteOrderHistory } from '../../services/api';
import OrderHistoryUpdate from './OrderHistoryUpdate';

const OrderHistoryItem = ({ history, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteOrderHistory(history.id_history);
            onDelete(history.id_history);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to delete order history:', error);
        }
    };

    return (
        <>
            <Card className="mb-3">
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Title>History ID: {history.id_history}</Card.Title>
                        <Card.Text>Description: {history.description}</Card.Text>
                        <Card.Text>Date: {new Date(history.date).toLocaleString()}</Card.Text>
                        <Card.Text>Order ID: {history.Order_id_order}</Card.Text>
                    </div>
                    <div>
                        <Button
                            variant="warning"
                            className="me-2"
                            onClick={() => setShowUpdateModal(true)}
                        >
                            Update
                        </Button>
                        <Button variant="danger" onClick={() => setShowConfirm(true)}>
                            Delete
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Confirm Delete Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this order history?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Yes, delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Modal */}
            <OrderHistoryUpdate
                history={history}
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                onUpdate={onUpdate}
            />
        </>
    );
};

export default OrderHistoryItem;
