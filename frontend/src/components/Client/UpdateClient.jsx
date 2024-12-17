import React, { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { updateClient } from "../../services/api";

const UpdateClient = ({ client, show, onHide, onUpdate }) => {
  const [name, setName] = useState(client.name);
  const [address, setAddress] = useState(client.address);
  const [telephone_number, setTelephoneNumber] = useState(client.telephone_number);
  const [email, setEmail] = useState(client.email);
  const [logon_name, setLogonName] = useState(client.logon_name);
  const [role, setRole] = useState(client.role);
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateInputs = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Name is required.";
    if (!address.trim()) errors.address = "Address is required.";
    if (!telephone_number) {
      errors.telephone_number = "Telephone number is required.";
    } else if (!/^\d{7,15}$/.test(telephone_number)) {
      errors.telephone_number = "Telephone number must be 7-15 digits.";
    }
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.email = "Invalid email format.";
    }
    if (!logon_name.trim()) errors.logon_name = "Logon name is required.";
    if (!role) errors.role = "Role selection is required.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const updatedClient = {
      ...client,
      name,
      address,
      telephone_number: telephone_number ? parseInt(telephone_number) : null,
      email,
      logon_name,
      role,
      password: password
    };

    try {
      const result = await updateClient(updatedClient);
      onUpdate(result);
      onHide();
      setValidationErrors({});
    } catch (error) {
      console.error("Failed to update client:", error);
      setValidationErrors({ server: error.response?.data?.detail || "Failed to update client" });
    } finally {
      setIsSubmitting(false);
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
            <Form.Control.Feedback type="invalid">{validationErrors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter a valid email address"
              isInvalid={!!validationErrors.email}
            />
            <Form.Control.Feedback type="invalid">{validationErrors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telephone Number</Form.Label>
            <Form.Control
              type="tel"
              value={telephone_number}
              onChange={(e) => setTelephoneNumber(e.target.value)}
              placeholder="Enter telephone number"
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
            <Form.Control.Feedback type="invalid">{validationErrors.address}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Logon Name</Form.Label>
            <Form.Control
              type="text"
              value={logon_name}
              onChange={(e) => setLogonName(e.target.value)}
              placeholder="Enter logon name"
              isInvalid={!!validationErrors.logon_name}
            />
            <Form.Control.Feedback type="invalid">{validationErrors.logon_name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              isInvalid={!!validationErrors.role}
            >
              <option value="">Select role</option>
              <option value="GUEST">Guest</option>
              <option value="CLIENT">Client</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{validationErrors.role}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </Form.Group>
          {validationErrors.server && (
            <div className="text-danger mb-3">{validationErrors.server}</div>
          )}
          <Button variant="success" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner animation="border" size="sm" /> : "Save Changes"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateClient;
