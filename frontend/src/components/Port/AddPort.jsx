import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createPort } from "../../services/api";

const AddPort = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Validation logic to ensure no field exceeds 32 characters
    const validateInputs = () => {
        const errors = {};

        if (!name.trim()) {
            errors.name = "Port Name is required.";
        } else if (name.length > 32) {
            errors.name = "Port Name cannot exceed 32 characters.";
        }

        if (!location.trim()) {
            errors.location = "Location is required.";
        } else if (location.length > 32) {
            errors.location = "Location cannot exceed 32 characters.";
        }

        if (!country.trim()) {
            errors.country = "Country is required.";
        } else if (country.length > 32) {
            errors.country = "Country cannot exceed 32 characters.";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Run validation checks
        const errors = validateInputs();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

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
            setValidationErrors({});
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
                                isInvalid={!!validationErrors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter location"
                                isInvalid={!!validationErrors.location}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.location}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="Enter country"
                                isInvalid={!!validationErrors.country}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.country}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="success" type="submit">Add Port</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddPort;
