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
    const [validationErrors, setValidationErrors] = useState({});


    const validateInputs = () => {
        const errors = {};

        if (!name.trim()) errors.name = "Name is required.";
        if (!address.trim()) errors.address = "Address is required";
        if (!telephone_number.trim()) {
            errors.telephone_number = "Telephone number is required."
        } else if (!/^\d{7,15}$/.test(telephone_number)) {
            errors.telephone_number = "Telephone number must be at least 7 digits"
        }
        if (!email.trim()) {
            errors.email = "Email is required.";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            errors.email = "Invalid email format."
        }

        return errors;
    }

    const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
    }
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
        setValidationErrors({});
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
                                isInvalid={!!validationErrors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter address"
                                isInvalid={!!validationErrors.address}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.address}
                            </Form.Control.Feedback>
                        </Form.Group>
			            <Form.Group className="mb-3">
                            <Form.Label>Telephone_number</Form.Label>
                            <Form.Control
                                type="number"
                                value={telephone_number}
                                onChange={(e) => setTelephone_number(e.target.value)}
                                placeholder="Enter telephone_number"
                                isInvalid={!!validationErrors.telephone_number}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.telephone_number}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                // type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                isInvalid={!!validationErrors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="success" type="submit">Add Client</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddClient;