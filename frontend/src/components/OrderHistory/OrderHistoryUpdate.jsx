import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateOrderHistory } from '../../services/api';

const OrderHistoryUpdate = ({ history, show, onHide, onUpdate }) => {
    const [description, setDescription] = useState(history.description);
    const [date, setDate] = useState(history.date);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedHistory = {
            id_history: history.id_history,
            description,
            date,
        };

        try {
            const result = await updateOrderHistory(updatedHistory);
            onUpdate(result);
            onHide();
        } catch (error) {
            console.error('Failed to update order history:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Order History</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default OrderHistoryUpdate;
