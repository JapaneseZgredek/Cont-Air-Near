import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateShip } from '../../services/api';

const UpdateShip = ({ ship, show, onHide, onUpdate }) => {
  const [name, setName] = useState(ship.name);
  const [capacity, setCapacity] = useState(ship.capacity);
  const [validationErrors, setValidationErrors] = useState({});

  const validateInputs = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Ship name is required";
    if (!capacity) {
      errors.capacity = "Capacity is required";
    } else if (!/^\d+$/.test(String(capacity)) || capacity <= 0) {
      errors.capacity = "Capacity must be a positive number.";
    }

    return errors
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const updatedShip = { ...ship, name, capacity };
    try {
      const result = await updateShip(updatedShip);
      onUpdate(result);
      onHide();
    } catch (error) {
      console.error('Failed to update ship:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Ship</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Ship Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter ship name"
              isInvalid={!!validationErrors.name}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Enter capacity"
              isInvalid={!!validationErrors.capacity}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.capacity}
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

export default UpdateShip;
