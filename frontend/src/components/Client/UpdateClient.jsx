import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateClient } from '../../services/api';

const UpdateClient = ({ client, show, onHide, onUpdate }) => {
  const [name, setName] = useState(client.name);
  const [address, setAddress] = useState(client.address);
  const [phone_no, setPhone_no] = useState(client.phone_no);
  const [email, setEmail] = useState(client.email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('handleSubmit wywolane');
    const updatedClient = { ...client, name, address, phone_no, email};
    try {
      const result = await updateClient(updatedClient);
      onUpdate(result);
      onHide();
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </Form.Group>
	<Form.Group className="mb-3">
            <Form.Label>Phone no</Form.Label>
            <Form.Control
              type="number"
              value={phone_no}
              onChange={(e) => setPhone_no(e.target.value)}
              placeholder="Enter phone no"
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
          <Button variant="success" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateClient;