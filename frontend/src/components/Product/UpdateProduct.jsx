import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateProduct } from '../../services/api';

const UpdateProduct = ({ product, show, onHide, onUpdate }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [weight, setWeight] = useState(product.weight);
  const [validationErrors, setValidationErrors] = useState({});

  const validateInputs = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Product name is required";
    if (!price || price <= 0) errors.price = "Price must be a positive number.";
    if (!weight || weight <= 0) errors.weight = "Weight must be a positive number.";

        return errors;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateInputs();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

    const updatedProduct = { 
      ...product, 
      name, 
      price, 
      weight
     };
    try {
      const result = await updateProduct(updatedProduct);
      onUpdate(result);
      onHide();
      setValidationErrors({});
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              isInvalid={!!validationErrors.name}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              isInvalid={!!validationErrors.price}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.price}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Weight</Form.Label>
            <Form.Control
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              isInvalid={!!validationErrors.weight}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.weight}
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

export default UpdateProduct;
