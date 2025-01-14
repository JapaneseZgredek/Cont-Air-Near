import React, { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { createClient } from "../../services/api";

const AddClient = ({ show, onHide, onAdd }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [telephone_number, setTelephoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [logon_name, setLogonName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateInputs = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Name is required.";
    } else if (!/^[a-zA-Z ]{3,}$/.test(name)) {
      errors.name = 'Name must be at least 3 letters long.'; 
    }
    if (!address.trim()) {
      errors.address = "Address is required.";
    } else if (!/^[a-zA-Z0-9 .\-\/]{8,64}$/.test(address)) {
      errors.address = 'Address must be at least 8-64 characters long.';
    }
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
    if (!logon_name.trim()) {
      errors.logon_name = "Logon name is required.";
    } else if (!/^[a-zA-Z0-9]{4,}$/.test(logon_name)) {
      errors.logon_name = 'Login must be at least 4 characters long and alphanumeric.';
    }
    if (!role) errors.role = "Role selection is required.";
    if (!password.trim())  {
      errors.password = "Password is required.";
    } else if (!/^.{8,}$/.test(password)) {
      errors.password = 'Password must be at least 8 characters long.';
    }

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
    const newClient = {
      name,
      address,
      telephone_number: parseInt(telephone_number),
      email,
      logon_name,
      role,
      password,
    };

    try {
      const result = await createClient(newClient);
      if (onAdd) onAdd(result); // Call onAdd if provided
      if (onHide) onHide(); // Close modal
      setValidationErrors({});
    } catch (error) {
      console.error("Failed to add client:", error);
      setValidationErrors({ server: error.response?.data?.detail || `Failed to add client: ${error.detail}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Client</Modal.Title>
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              isInvalid={!!validationErrors.password}
            />
            <Form.Control.Feedback type="invalid">{validationErrors.password}</Form.Control.Feedback>
            <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="form-check-label" htmlFor="showPassword">
              Show Password
            </label>
            </div>
          </Form.Group>
          
          {validationErrors.server && (
            <div className="text-danger mb-3">{validationErrors.server}</div>
          )}
          <Button variant="success" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner animation="border" size="sm" /> : "Add Client"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddClient;