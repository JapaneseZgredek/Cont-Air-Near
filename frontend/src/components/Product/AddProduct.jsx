import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createProduct, fetchPorts } from "../../services/api"; // Importujemy funkcje API

const AddProduct = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [weight, setWeight] = useState('');
    const [idPort, setIdPort] = useState('');
    const [ports, setPorts] = useState([]);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Walidacja pól wejściowych
    const validateInputs = () => {
        const errors = {};
        if (!name.trim()) errors.name = "Product Name is required.";
        if (!price || isNaN(price) || parseFloat(price) <= 0) errors.price = "Price must be a positive number.";
        if (!weight || isNaN(weight) || parseFloat(weight) <= 0) errors.weight = "Weight must be a positive number.";
        if (!idPort) errors.idPort = "Port must be selected.";
        return errors;
    };

    // Funkcja obsługująca dodanie nowego produktu
    const handleSubmit = async (e) => {
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
                weight: parseFloat(weight),
                id_port: parseInt(idPort),
            });
            onAdd(newProduct);
            resetForm();
            setShow(false);
        } catch (err) {
            setError('Failed to create product');
        }
    };

    // Funkcja resetująca formularz
    const resetForm = () => {
        setName('');
        setPrice('');
        setWeight('');
        setIdPort('');
        setValidationErrors({});
    };

    // Funkcja ładująca dostępne porty z API
    const loadPorts = async () => {
        try {
            const data = await fetchPorts();
            setPorts(data);
        } catch (err) {
            setError("Failed to load ports");
        }
    };

    useEffect(() => {
        loadPorts();
    }, []);

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>Add Product</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        {/* Pole dla nazwy produktu */}
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

                        {/* Pole dla ceny produktu */}
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Enter product price"
                                isInvalid={!!validationErrors.price}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.price}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Pole dla wagi produktu */}
                        <Form.Group className="mb-3">
                            <Form.Label>Weight</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="Enter product weight"
                                isInvalid={!!validationErrors.weight}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.weight}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Pole wyboru portu */}
                        <Form.Group className="mb-3">
                            <Form.Label>Port</Form.Label>
                            <Form.Control
                                as="select"
                                required
                                value={idPort}
                                onChange={(e) => setIdPort(e.target.value)}
                                isInvalid={!!validationErrors.idPort}
                            >
                                <option value="">Select Port</option>
                                {ports.map((port) => (
                                    <option key={port.id_port} value={port.id_port}>{port.name}</option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.idPort}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="success" type="submit">Add Product</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddProduct;
