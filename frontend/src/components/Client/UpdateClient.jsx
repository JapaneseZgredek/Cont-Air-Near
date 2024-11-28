import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateClient } from '../../services/api';

const UpdateClient = ({ client, show, onHide, onUpdate }) => {
  const [name, setName] = useState(client.name);
  const [address, setAddress] = useState(client.address);
  const [telephone_number, setTelephone_number] = useState(client.telephone_number);
  const [email, setEmail] = useState(client.email);
  const [validationErrors, setValidationErros] = useState({});

  const validateInputs = () => {
      const errors = {};

      if (!name.trim()) errors.name = "Name is required.";
      if (!address.trim()) errors.address = "Address is required";
      if (!telephone_number) {
          errors.telephone_number = "Telephone number is required.";
      } else if (!/^\d{7,15}$/.test(telephone_number)) {
          errors.telephone_number = "Telephone number must be between 7 and 15 digits"
      }
      if (!email.trim()) {
          errors.email = "Email is required.";
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
          errors.email = "Invalid email format.";
      }

      return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
        setValidationErros(errors);
        return;
    }

    console.log('handleSubmit wywolane');
    const updatedClient = { 
        ...client, 
        name, 
        address, 
        telephone_number: telephone_number ? parseInt(telephone_number) : null,
        email
    };
    
    try {
        const result = await updateClient(updatedClient);
        onUpdate(result);
        onHide();
        setValidationErros({});
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
              isInvalid={!!validationErrors.name}
            />
            <Form.Control.Feedback type="invalid">
                {validationErrors.name}
            </Form.Control.Feedback>
          </Form.Group>
	<Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              isInvalid={!!validationErrors.email}
            />
            <Form.Control.Feedback type="invalid">
                {validationErrors.email}
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
          <Button variant="success" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateClient;