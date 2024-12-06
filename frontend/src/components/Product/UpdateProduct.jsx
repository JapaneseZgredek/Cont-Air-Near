import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateProduct, uploadProductImage } from '../../services/api';

const UpdateProduct = ({ product, show, onHide, onUpdate }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [weight, setWeight] = useState(product.weight);
  const [image, setImage] = useState(product.image ? "present" : "");
  //const [idPort, setIdPort] = useState(product.id_port);
  const [imageFile, setImageFile] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [error, setError] = useState(null);

  const maxImageWidth = 512;
  const maxImageHeight = 512;

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
      if (imageFile) {
        await checkImageDimensions(imageFile);
      }
      if (deleteImage) {
        updatedProduct.image="";
      }
      const result = await updateProduct(updatedProduct);
      // if new image was chosen - uploading it
      if (imageFile) {
        await uploadProductImage(product.id_product, imageFile);
      }
      setImage(deleteImage ? "" : "present");
      onUpdate(result);
      onHide();
    } catch (error) {
      setError('Failed to update product: '+ error);
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleDeleteImageChange = (e) => {
    setDeleteImage(e.target.checked);
  };

  const checkImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            return reject("\nInvalid file type. Allowed types: "+validTypes);
        }
        const img = new Image();
        img.onload = () => {
            if (img.width > maxImageWidth || img.height > maxImageHeight) {
                reject("\nImage dimensions must not exceed "+maxImageWidth+"x"+maxImageHeight+" pixels.");
            } else {
                resolve();
            }
        };
        img.onerror = () => reject("\nFailed to load image.");
        img.src = URL.createObjectURL(file);
    });
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
        {/*TODO move style to css*/}
        {error && <p style={{ color: 'red'}}>{error}</p>}
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
          
          {!(image === "" || imageFile) && (
            <Form.Check
              type="checkbox"
              label="Delete Image"
              checked={deleteImage}
              onChange={handleDeleteImageChange}
              className="mb-3"
            />
          )}
          

          <Button variant="success" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProduct;
