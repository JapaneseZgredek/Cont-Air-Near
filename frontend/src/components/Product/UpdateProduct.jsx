import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateProduct, uploadProductImage, deleteProductImage } from '../../services/api';

const UpdateProduct = ({ product, show, onHide, onUpdate }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [weight, setWeight] = useState(product.weight);
  //const [idPort, setIdPort] = useState(product.id_port);
  const [imageFile, setImageFile] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);

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
      // if new image was chosen - uploading it
      if (imageFile) {
        await uploadProductImage(product.id_product, imageFile);
      }
      if (deleteImage) {
        await deleteProductImage(result.id_product);
      }
      onUpdate(result);
      onHide();
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleDeleteImageChange = (e) => {
    setDeleteImage(e.target.checked);
  };

  useEffect(() => {
    setImageFile(null);
    setDeleteImage(false);
  }, [product]);

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

          <Form.Group className="mb-3">
            <Form.Label>Product Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>
          
          {/*TODO dodać warunek sprawdzajacy czy już ma obrazek */}
          <Form.Check
            type="checkbox"
            label="Delete Image"
            checked={deleteImage}
            onChange={handleDeleteImageChange}
            className="mb-3"
          />
          

          <Button variant="success" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProduct;
