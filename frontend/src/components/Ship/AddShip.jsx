import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createShip, uploadShipImage } from "../../services/api";

const AddShip = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const validateInputs = () => {
        const errors = {};

        if (!name.trim()) errors.name = "Ship name is required.";
        if (!capacity.trim()) {
            errors.capacity = "Capacity is required.";
        } else if (!/^\d+$/.test(capacity) || parseInt(capacity) <= 0) {
            errors.capacity = "Capacity must be a positive number.";
        }

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
            const newShip = await createShip({ 
                name, 
                capacity: parseInt(capacity), 
                image: ""
            });
            // if image was chosen - uploading it
            if (imageFile) {
                await uploadShipImage(newShip.id_ship, imageFile);
                newShip.image = "image_added";
            }
            onAdd(newShip);
            setShow(false);
            setName('');
            setCapacity('');
            setValidationErrors({});
        } catch (err) {
            setError('Failed to create ship')
        }
    };

    // Funkcja przypisująca wybrany obrazek do zmiennej
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    //  Funkcja sprawdzająca czy wybrany obrazek jest właściwego formatu
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
            <Button variant="primary" onClick={() => setShow(true)}>Add Ship</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Ship</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p className="err-field">{"Err: "+error}</p>}
                    <Form onSubmit={handleSubimt}>
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

                        {/* Pole wyboru obrazka */}
                        <Form.Group className="mb-3">
                            <Form.Label>Ship Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Form.Group>

                        <Button varian="success" type="submit">Add Ship</Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default AddShip;