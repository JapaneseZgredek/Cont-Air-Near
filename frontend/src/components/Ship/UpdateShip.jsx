import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateShip } from '../../services/api';

const UpdateShip = ({ ship, show, onHide, onUpdate }) => {
  const [name, setName] = useState(ship.name);
  const [capacity, setCapacity] = useState(ship.capacity);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('handleSubmit wywolane');
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
          <Button variant="success" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateShip;
