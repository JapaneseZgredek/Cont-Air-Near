import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateOrder } from '../../services/api';

const OrderUpdate = ({ order, show, onHide, onUpdate }) => {
    const [status, setStatus] = useState(order.status);
    const [idPort, setIdPort] = useState(order.id_port);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedOrder = { id_order: order.id_order, status, id_port: idPort };
        try {
            const result = await updateOrder(updatedOrder);
            onUpdate(result);
            onHide();
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Canceled</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Port ID</Form.Label>
                        <Form.Control
                            type="number"
                            value={idPort}
                            onChange={(e) => setIdPort(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="success" type="submit">Save Changes</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default OrderUpdate;
