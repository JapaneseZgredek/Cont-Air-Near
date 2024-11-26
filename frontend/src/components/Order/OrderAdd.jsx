import React, {useEffect, useState} from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createOrder, fetchClients, fetchPorts } from '../../services/api';

const OrderAdd = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState('pending'); // Domyślna wartość, która jest zgodna z backendem
    const [idPort, setIdPort] = useState('');
    const [idClient, setIdClient] = useState('');
    const [ports, setPorts] = useState([]);
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const orderData = { status, id_port: parseInt(idPort), id_client: parseInt(idClient) };
        console.log("Sending data:", orderData); // Debugging

        try {
            const newOrder = await createOrder(orderData);
            onAdd(newOrder);
            setShow(false);
            setStatus('pending');
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
                            <Form.Label>Port ID</Form.Label>
                            <Form.Select
                                value={idPort}
                                onChange={(e) => setIdPort(e.target.value)}
                                required
                            >
                                <option value="">Select Port</option>
                                {ports.map((port) => (
                                    <option key={port.id_port} value={port.id_port}>{port.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Client</Form.Label>
                            <Form.Select
                                value={idClient}
                                onChange={(e) => setIdClient(e.target.value)}
                                required
                            >
                                <option value="">Select Client</option>
                                {clients.map((client) => (
                                    <option key={client.id_client} value={client.id_client}>{client.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="success" type="submit">Add Order</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default OrderAdd;
