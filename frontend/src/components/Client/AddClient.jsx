import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createClient } from "../../services/api";

const AddClient = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [telephone_number, setTelephone_number] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const newClient = await createClient({
            name,
            address,
            telephone_number: telephone_number ? parseInt(telephone_number) : null,
            email
        });
        onAdd(newClient);
        setShow(false);
        setName('');
        setAddress('');
        setTelephone_number('');
        setEmail('');
    } catch (err) {
        setError('Failed to create client');
    }
};

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>Add Client</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Client Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter address"
                            />
                        </Form.Group>
			<Form.Group className="mb-3">
                            <Form.Label>Telephone_number</Form.Label>
                            <Form.Control
                                type="number"
                                value={telephone_number}
                                onChange={(e) => setTelephone_number(e.target.value)}
                                placeholder="Enter telephone_number"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                            />
                        </Form.Group>
                        <Button variant="success" type="submit">Add Client</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddClient;