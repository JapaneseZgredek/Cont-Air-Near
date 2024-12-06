import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createProduct, uploadProductImage } from "../../services/api";

const AddProduct = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [weight, setWeight] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const validateInputs = () => {
        const errors = {};

        if (!name.trim()) errors.name = "Product Name is required.";
        if (!price.trim() || parseFloat(price) <= 0) errors.price = "Price must be a positive number.";
        if (!weight.trim() || parseFloat(weight) <= 0) errors.weight = "Weight must be a positive number.";

        return errors;
    }

    const maxImageWidth = 512;
    const maxImageHeight = 512;

    const handleSubimt = async (e) => {
        e.preventDefault();
        const errors = validateInputs();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        try {
            if (imageFile) {
                await checkImageDimensions(imageFile);
            }
            const newProduct = await createProduct({
                name, 
                price: parseFloat(price), 
                weight: parseFloat(weight),
                image: ""
                //, id_port: parseInt(idPort)
            });
              // if image was chosen - uploading it
            if (imageFile) {
                await uploadProductImage(newProduct.id_product, imageFile);
            }
            onAdd(newProduct);
            setShow(false);
            setName('');
            setPrice('');
            setWeight('');
            setImageFile(null);
            setValidationErrors({});
        } catch (err) {
            setError('Failed to create product'+err)
        }
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
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

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>Add Product</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p style={{ color: 'red'}}>{error}</p>}
                    <Form onSubmit={handleSubimt}>
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

                        <Form.Group className="mb-3">
                            <Form.Label>Product Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Form.Group>

                        <Button varian="success" type="submit">Add Product</Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default AddProduct;