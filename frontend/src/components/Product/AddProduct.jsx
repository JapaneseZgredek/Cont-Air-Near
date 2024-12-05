import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createProduct, uploadProductImage } from "../../services/api";

const AddProduct = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [weight, setWeight] = useState('');
    //const [idPort, setIdPort] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);

    const handleSubimt = async (e) => {
        e.preventDefault();
        try {
            const newProduct = await createProduct({
                name, 
                price: parseFloat(price), 
                weight: parseFloat(weight)
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
        } catch (err) {
            setError('Failed to create product')
        }
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
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
                            <Form.Label>ID Port</Form.Label>
                            <Form.Control
                                required
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

                        <Button varian="success" type="submit">Add Product</Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default AddProduct;