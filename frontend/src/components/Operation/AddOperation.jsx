import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createOperation } from "../../services/api"; //
import { fetchShips } from '../../services/api';
import { fetchPorts } from '../../services/api';
import { fetchOrders } from "../../services/api";

const AddOperation = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [nameOfOperation, setNameOfOperation] = useState('');
    const [operationType, setOperationType] = useState('AT_BAY');
    const [dateOfOperation, setDateOfOperation] = useState('');
    const [idShip, setIdShip] = useState('');
    const [idPort, setIdPort] = useState('');
    const [idOrder, setIdOrder] = useState('');
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const validateInputs = () => {
        const errors = {};

        if (!nameOfOperation.trim()) errors.nameOfOperation = "Operation name is required";
        if (!idShip) errors.idShip = "You must select a ship.";
        if (!idPort) errors.idPort = "You must select a port.";
        if (!idOrder) errors.idOrder = "You must select an order.";
        if (!dateOfOperation) errors.dateOfOperation = "Date of operation is required.";

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent double Submit
        if (error) return;

        const errors = validateInputs();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

    try {
        setError(null); // Clear previous errors
        console.log("Sending payload to create operation");
        const newOperation = await createOperation({
            name_of_operation: nameOfOperation,
            operation_type: operationType,
            // date_of_operation: dateOfOperation || new Date().toISOString(),
            date_of_operation: dateOfOperation,
            id_ship: parseInt(idShip),
            id_port: parseInt(idPort),
            id_order: parseInt(idOrder),
        });
        console.log("Operation created:", newOperation);
        onAdd(newOperation);
        setShow(false);
        setValidationErrors({});
    } catch (err) {
        console.error("Error creating operation:", err.message);
        setError("Failed to create operation. Please try again.");
    }
};

    const resetForm = () => {
        setNameOfOperation('');
        setOperationType('AT_BAY');
        setDateOfOperation('');
        setIdShip('');
        setIdPort('');
    };

    // For ships/ports dropdown list
    const [ships, setShips] = useState([]);
    const [ports, setPorts] = useState([]);
    const [orders, setOrders] = useState([]);

    const loadShips = async () => {
        try {
            const data = await fetchShips();
            setShips(data);
        } catch (err) {
            setError('Failed to load ships');
        }
    };
    const loadPorts = async () => {
        try {
            const data = await fetchPorts();
            setPorts(data);
        } catch (err) {
            setError('Failed to load ports');
        }
    };
    const loadOrders = async() => {
        try {
            const data = await fetchOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to load orders');
        }
    };

    useEffect(() => {
        loadShips();
        loadPorts();
        loadOrders();
    }, []);

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>Add Operation</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Operation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p className="err-field">{"Err: "+error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Operation Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={nameOfOperation}
                                onChange={(e) => setNameOfOperation(e.target.value)}
                                placeholder="Enter operation name"
                                isInvalid={!!validationErrors.nameOfOperation}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.nameOfOperation}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Operation Type</Form.Label>
                            <Form.Select
                                value={operationType}
                                onChange={(e) => setOperationType(e.target.value)}
                            >
                                <option value="AT_BAY">At Bay</option>
                                <option value="TRANSPORT">Transport</option>
                                <option value="TRANSFER">Transfer</option>
                                <option value="DEPARTURE">Departure</option>
                                <option value="ARRIVAL">Arrival</option>
                                <option value="CARGO_LOADING">Cargo Loading</option>
                                <option value="CARGO_DISCHARGE">Cargo Discharge</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Date of Operation</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={dateOfOperation}
                                onChange={(e) => setDateOfOperation(e.target.value)}
                                isInvalid={!!validationErrors.dateOfOperation}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.dateOfOperation}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ship</Form.Label>
                            <Form.Select
                                value={idShip}
                                onChange={(e) => setIdShip(e.target.value)}
                                isInvalid={!!validationErrors.idShip}
                            >
                                <option value="">Select Ship</option>
                                {ships.map((ship) => (
                                    <option key={ship.id_ship} value={ship.id_ship}>{ship.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.idShip}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Port</Form.Label>
                            <Form.Select
                                value={idPort}
                                onChange={(e) => setIdPort(e.target.value)}
                                isInvalid={!!validationErrors.idPort}
                            >
                                <option value="">Select Port</option>
                                {ports.map((port) => (
                                    <option key={port.id_port} value={port.id_port}>{port.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.idPort}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Order</Form.Label>
                            <Form.Select
                                value={idOrder}
                                onChange={(e) => setIdOrder(e.target.value)}
                                isInvalid={!!validationErrors.idOrder}
                            >
                                <option value="">Select Order</option>
                                {orders.map((order) => (
                                    <option key={order.id_order} value={order.id_order}>Order #{order.id_order}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.idOrder}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="success" type="submit">Add Operation</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddOperation;
