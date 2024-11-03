import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createOperation } from "../../services/api"; //

const AddOperation = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [nameOfOperation, setNameOfOperation] = useState('');
    const [operationType, setOperationType] = useState('at_bay');
    const [dateOfOperation, setDateOfOperation] = useState('');
    const [idShip, setIdShip] = useState('');
    const [idPort, setIdPort] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newOperation = await createOperation({
                name_of_operation: nameOfOperation,
                operation_type: operationType,
                date_of_operation: dateOfOperation || new Date().toISOString(),
                id_ship: parseInt(idShip),
                id_port: parseInt(idPort)
            });
            onAdd(newOperation);
            setShow(false);
        } catch (err) {
            setError('Failed to create an operation');
        }
    };

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>Add Operation</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Operation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Operation Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={nameOfOperation}
                                onChange={(e) => setNameOfOperation(e.target.value)}
                                placeholder="Enter operation name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Operation Type</Form.Label>
                            <Form.Select
                                value={operationType}
                                onChange={(e) => setOperationType(e.target.value)}
                            >
                                <option value="at_bay">At Bay</option>
                                <option value="transport">Transport</option>
                                <option value="transfer">Transfer</option>
                                <option value="departure">Departure</option>
                                <option value="arrival">Arrival</option>
                                <option value="loading">Cargo Loading</option>
                                <option value="discharge">Cargo Discharge</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Date of Operation</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={dateOfOperation}
                                onChange={(e) => setDateOfOperation(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>ID SHIP</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                value={idShip}
                                onChange={(e) => setIdShip(e.target.value)}
                                placeholder="Enter ship ID"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>ID PORT</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                value={idPort}
                                onChange={(e) => setIdPort(e.target.value)}
                                placeholder="Enter port ID"
                            />
                        </Form.Group>

                        <Button variant="success" type="submit">Add Operation</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddOperation;