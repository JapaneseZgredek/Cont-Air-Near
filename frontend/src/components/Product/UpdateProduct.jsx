import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateProduct } from '../../services/api';

const UpdateProduct = ({ product, show, onHide, onUpdate }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [weight, setWeight] = useState(product.weight);
  //const [idPort, setIdPort] = useState(product.id_port);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('handleSubmit wywolane');
    const updatedProduct = { 
      ...product, 
      name, 
      price, 
      weight
      //, id_port: idPort
     };
    try {
      const result = await updateProduct(updatedProduct);
      onUpdate(result);
      onHide();
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
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Weight</Form.Label>
            <Form.Control
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
            />
          </Form.Group>
          {/*<Form.Group className="mb-3">
            <Form.Label>Port ID</Form.Label>
            <Form.Control
              type="number"
              value={idPort}
              onChange={(e) => setIdPort(e.target.value)}
              placeholder="Enter port ID"
            />
          </Form.Group>*/}

          <Button variant="success" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProduct;
