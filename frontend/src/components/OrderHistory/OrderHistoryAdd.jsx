import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createOrderHistory, fetchOrders } from '../../services/api';

const OrderHistoryAdd = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [orderId, setOrderId] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const historyData = { description, date, Order_id_order: parseInt(orderId) };

        try {
            const newHistory = await createOrderHistory(historyData);
            onAdd(newHistory);
            setShow(false);
            setDescription('');
            setDate('');
            setOrderId('');
        } catch (err) {
            setError('Failed to create order history');
        }
    };

    const [orders, setOrderss] = useState([]);
    const loadOrders = async () => {
        try {
            const data = await fetchOrders();
            setOrderss(data);
        } catch (err) {
            setError('Failed to load orders');
        }
    };
    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>
                Add Order History
            </Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Order History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
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
                        <Form.Group className="mb-3">
                            <Form.Label>Order</Form.Label>
                            <Form.Control
                            as="select"
                            required
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="Select Order">
                                <option value="">Select Order</option>
                			    {
                			    	orders.map((order) => (
                			    		<option key={order.id_order} value={order.id_order}>{order.id_order}</option>
                			    	))
                			    }
                            </Form.Control>
                        </Form.Group>
                        <Button variant="success" type="submit">
                            Add History
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default OrderHistoryAdd;
