import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createProduct } from "../../services/api";

const AddProduct = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [weight, setWeight] = useState('');
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const validateInputs = () => {
        const errors = {};

        if (!name.trim()) errors.name = "Product Name is required.";
        if (!price.trim() || parseFloat(price) <= 0) errors.price = "Price must be a positive number.";
        if (!weight.trim() || parseFloat(weight) <= 0) errors.weight = "Weight must be a positive number.";

        return errors;
    }

    const handleSubimt = async (e) => {
        e.preventDefault();
        const errors = validateInputs();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        try {
            const newProduct = await createProduct({
                name, 
                price: parseFloat(price), 
                weight: parseFloat(weight)
                //, id_port: parseInt(idPort)
            });
            onAdd(newProduct);
            setShow(false);
            setName('');
            setPrice('');
            setWeight('');
            setValidationErrors({});
        } catch (err) {
            setError('Failed to create product')
        }
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
                        <Button varian="success" type="submit">Add Product</Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default AddProduct;