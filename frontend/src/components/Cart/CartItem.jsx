import React, { useState } from 'react';
import { Card, Button, Modal, Badge } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa'; // Import ikony kosza z react-icons

const CartItem = ({ item, onRemove }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    // Function to remove product from the cart
    const handleRemove = () => {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = existingCart.filter(cartItem => cartItem.id_product !== item.id_product);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        onRemove(item); // Pass the entire item to restore it to the product list
        setShowConfirm(false);
    };

    return (
        <>
            {/* Stylizowana karta produktu */}
            <Card className="mb-3 shadow-sm border-0">
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Title className="text-primary fw-bold mb-2">
                            {item.name}
                        </Card.Title>
                        <Card.Text>
                            Price: <Badge bg="success" className="me-2">{item.price} zł</Badge>
                            Weight: <Badge bg="info">{item.weight} kg</Badge>
                        </Card.Text>
                    </div>
                    <div>
                        <Button
                            variant="outline-danger"
                            onClick={() => setShowConfirm(true)}
                            className="d-flex align-items-center"
                        >
                            <FaTrash className="me-1" /> Remove
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal potwierdzający usunięcie */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Removal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove <strong>{item.name}</strong> from your cart?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleRemove}>
                        Yes, Remove
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CartItem;
