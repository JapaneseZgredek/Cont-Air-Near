import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updatePort } from '../../services/api';


const UpdatePort = ({ port, show, onHide, onUpdate }) => {
  const [name, setName] = useState(port.name);
  const [location, setLocation] = useState(port.location);
  const [country, setCountry] = useState(port.country);
  const [validationErrors, setValidationErrors] = useState({});

  const validateInputs = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Port Name is required.";
    if (!location.trim()) errors.location = "Location is required.";
    if (!country.trim()) errors.country = "Country is required.";

    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const updatedPort = { ...port, name, location, country };
    try {
      const result = await updatePort(updatedPort);
      onUpdate(result);
      onHide();
      setValidationErrors({});
    } catch (error) {
      console.error('Failed to update port:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Port</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            <Form.Control.Feedback>
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
          <Button variant="success" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdatePort;
