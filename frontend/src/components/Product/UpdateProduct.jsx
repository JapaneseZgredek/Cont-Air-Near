import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateProduct, uploadProductImage } from '../../services/api';

const UpdateProduct = ({ product, show, onHide, onUpdate }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [weight, setWeight] = useState(product.weight);
  const [image, setImage] = useState(product.image ? "present" : "");
  const [imageFile, setImageFile] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [error, setError] = useState(null);
  const maxImageWidth = 512;
  const maxImageHeight = 512;
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
      weight,
      image: deleteImage?"":product.image
     };
    
    try {
      if (imageFile) {
        await checkImageDimensions(imageFile);
      }
      // if new image was chosen - uploading it
      let result = await updateProduct(updatedProduct);
      if (imageFile) {
        result.image = (await uploadProductImage(product.id_product, imageFile)).image;
      }
      setImage(deleteImage ? "" : "present");
      onUpdate(result);
      onHide();
      setValidationErrors({});
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
        {error && <p className="err-field">{"Err: "+error}</p>}
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

          {(!deleteImage) && (
          <Form.Group className="mb-3">
            <Form.Label>Product Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>
          )}
          
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
