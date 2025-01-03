import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createOrder, fetchClients, fetchPorts } from '../../services/api';

const OrderAdd = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState('pending');
    const [idPort, setIdPort] = useState('');
    const [idClient, setIdClient] = useState('');
    const [description, setDescription] = useState('');
    const [ports, setPorts] = useState([]);
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const validateInputs = () => {
        const errors = {};
        if (!idPort) errors.idPort = "Port must be selected.";
        if (!idClient) errors.idClient = "Client must be selected.";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateInputs();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const orderData = { status, description, id_port: parseInt(idPort), id_client: parseInt(idClient) };

        try {
            const newOrder = await createOrder(orderData);
            onAdd(newOrder);  // Pass the newly created order to parent component
            setShow(false);
            // Clear form fields
            setStatus('pending');
            setDescription('');
            setIdPort('');
            setIdClient('');
        } catch (err) {
            setError('Failed to create order');
        }
    };

    const loadPorts = async () => {
        try {
            const data = await fetchPorts();
            setPorts(data);
        } catch (err) {
            setError("Failed to load ports");
        }
    };

    const loadClients = async () => {
        try {
            const data = await fetchClients();
            setClients(data);
        } catch (err) {
            setError("Failed to load clients");
        }
    };

    useEffect(() => {
        loadPorts();
        loadClients();
    }, []);

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
                            <Form.Label>Port</Form.Label>
                            <Form.Control
                                as="select"
                                required
                                value={idPort}
                                onChange={(e) => setIdPort(e.target.value)}
                                isInvalid={!!validationErrors.idPort}
                            >
                                <option value="">Select Port</option>
                                {ports.map((port) => (
                                    <option key={port.id_port} value={port.id_port}>{port.name}</option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.idPort}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Client</Form.Label>
                            <Form.Control
                                as="select"
                                required
                                value={idClient}
                                onChange={(e) => setIdClient(e.target.value)}
                                isInvalid={!!validationErrors.idClient}
                            >
                                <option value="">Select Client</option>
                                {clients.map((client) => (
                                    <option key={client.id_client} value={client.id_client}>{client.name}</option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.idClient}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="success" type="submit">Add Order</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default OrderAdd;
