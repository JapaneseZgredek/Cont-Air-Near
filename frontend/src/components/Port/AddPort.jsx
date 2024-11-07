import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createPort } from "../../services/api";

const AddPort = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newPort = await createPort({
                name,
                location,
                country,
            });
            onAdd(newPort);
            setShow(false);
            setName('');
            setLocation('');
            setCountry('');
        } catch (err) {
            setError('Failed to create port');
        }
    };

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>Add Port</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Port</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Port Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter port name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter location"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="Enter country"
                            />
                        </Form.Group>
                        <Button variant="success" type="submit">Add Port</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddPort;
