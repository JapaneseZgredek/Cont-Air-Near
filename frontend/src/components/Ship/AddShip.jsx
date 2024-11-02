import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createShip } from "../../services/api";

const AddShip = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [error, setError] = useState(null);

    const handleSubimt = async (e) => {
        e.preventDefault();
        try {
            const newShip = await createShip({ name, capacity: parseInt(capacity) });
            onAdd(newShip);
            setShow(false);
            setName('');
            setCapacity('');
        } catch (err) {
            setError('Failed to create ship')
        }
    };

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>Add Ship</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Ship</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p style={{ color: 'red'}}>{error}</p>}
                    <Form onSubmit={handleSubimt}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ship Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter ship name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder="Enter capacity"
                            />
                        </Form.Group>
                        <Button varian="success" type="submit">Add Ship</Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default AddShip;