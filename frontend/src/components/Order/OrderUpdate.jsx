import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateOrder, fetchClients, fetchPorts } from '../../services/api';

const OrderUpdate = ({ order, show, onHide, onUpdate }) => {
    const [status, setStatus] = useState(order.status);
    const [idPort, setIdPort] = useState(order.id_port);
    const [idClient, setIdClient] = useState(order.id_client);
    const [ports, setPorts] = useState([]);
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [description, setDescription] = useState(order.description);

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

        const updatedOrder = {
            id_order: order.id_order,
            status,
            description,
            id_port: parseInt(idPort),
            id_client: parseInt(idClient),
        };

        try {
            const result = await updateOrder(updatedOrder);
            onUpdate(result);
            onHide();
        } catch (error) {
            console.error('Failed to update order:', error);
            setError('Failed to update order');
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
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className="err-field">{"Err: "+error}</p>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Update order description"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Port</Form.Label>
                        <Form.Control
                            as="select"
                            required
                            value={idPort}
                            onChange={(e) => setIdPort(e.target.value)}
                            placeholder="Select Port"
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
                            placeholder="Select Client"
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
                    <Button variant="success" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default OrderUpdate;
