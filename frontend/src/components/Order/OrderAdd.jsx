import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createOrder } from '../../services/api';

const OrderAdd = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState('pending'); // Domyślna wartość, która jest zgodna z backendem
    const [idPort, setIdPort] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const orderData = { status, id_port: parseInt(idPort) };
        console.log("Sending data:", orderData); // Debugging

        try {
            const newOrder = await createOrder(orderData);
            onAdd(newOrder);
            setShow(false);
            setStatus('pending');
            setIdPort('');
        } catch (err) {
            setError('Failed to create order');
        }
    };


    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>Add Order</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Port ID</Form.Label>
                            <Form.Control
                                type="number"
                                value={idPort}
                                onChange={(e) => setIdPort(e.target.value)}
                                placeholder="Enter port ID"
                                required
                            />
                        </Form.Group>
                        <Button variant="success" type="submit">Add Order</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default OrderAdd;
