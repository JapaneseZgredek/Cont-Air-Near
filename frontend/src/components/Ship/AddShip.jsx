import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const AddShip = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');

    const handleSubimt = (e) => {
        e.preventDefault();
        onAdd({ name, capacity })
        setShow(false);
    };

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>Add Ship</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Ship</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubimt}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ship Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter ship name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder="Enter capacity"
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