import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateShip, uploadShipImage } from '../../services/api';

const UpdateShip = ({ ship, show, onHide, onUpdate }) => {
  const [name, setName] = useState(ship.name);
  const [capacity, setCapacity] = useState(ship.capacity);
  const [image, setImage] = useState(ship.image ? "present" : "");
  const [imageFile, setImageFile] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [imageError, setImageError] = useState(null);  // Handle image dimension errors here

  const maxImageWidth = 512;
  const maxImageHeight = 512;

  const validateInputs = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Ship name is required";
    if (!capacity) {
      errors.capacity = "Capacity is required";
    } else if (!/^\d+$/.test(String(capacity)) || capacity <= 0) {
      errors.capacity = "Capacity must be a positive number.";
    }

    return errors;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const updatedShip = { ...ship, name, capacity };
    
    try {
      // Check image dimensions before submitting
      if (imageFile) {
        await checkImageDimensions(imageFile);
      }

      // Remove image if requested
      if (deleteImage) {
        updatedShip.image = "";
      }

      const result = await updateShip(updatedShip);

      // If a new image was chosen, upload it
      if (imageFile) {
        await uploadShipImage(ship.id_ship, imageFile);
      }

      // Update UI to reflect changes
      setImage(deleteImage ? "" : "present");
      onUpdate(result);
      onHide();
    } catch (error) {
      console.error('Failed to update ship:', error);
      setImageError(error.message || "Image dimensions must not exceed 512x512 pixels.");
    }
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageError(null);  // Reset image error message when a new file is selected
  };

  // Handle delete image checkbox change
  const handleDeleteImageChange = (e) => {
    setDeleteImage(e.target.checked);
  };

  // Image validation function
  const checkImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        return reject("Invalid file type. Allowed types: jpeg, png.");
      }
      
      const img = new Image();
      img.onload = () => {
        if (img.width > maxImageWidth || img.height > maxImageHeight) {
          reject(`Image dimensions must not exceed ${maxImageWidth}x${maxImageHeight} pixels.`);
        } else {
          resolve();
        }
      };
      img.onerror = () => reject("Failed to load image.");
      img.src = URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    setImageFile(null);
    setDeleteImage(false);
    setImageError(null);  // Reset image error when the ship data changes
  }, [ship]);

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
              isInvalid={!!validationErrors.name}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Enter capacity"
              isInvalid={!!validationErrors.capacity}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.capacity}
            </Form.Control.Feedback>
          </Form.Group>

          {!deleteImage && (
            <Form.Group className="mb-3">
              <Form.Label>Ship Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
          )}

          {/* Display image validation errors */}
          {imageError && (
            <div className="text-danger mb-3">
              <small>{imageError}</small>
            </div>
          )}

          {/* Only show delete checkbox if there is an existing image */}
          {!image && !imageFile && (
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

export default UpdateShip;
