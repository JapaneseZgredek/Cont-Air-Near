import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

const CartItem = ({ item, onRemove }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    // Function to remove product from the cart
    const handleRemove = () => {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = existingCart.filter(cartItem => cartItem.id_product !== item.id_product);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        onRemove(item); // Pass the entire item instead of just the id to restore it to the product list
        setShowConfirm(false);
    };

    return (
        <>
            <Card className="mb-3">
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Title
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {item.name}
                        </Card.Title>
                        <Card.Text>Price: {item.price} zł</Card.Text>
                        <Card.Text>Weight: {item.weight} kg</Card.Text>
                    </div>
                    <div>
                        <Button variant="danger" onClick={() => setShowConfirm(true)}>Remove</Button>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Removal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove this product from the cart?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleRemove}>Remove</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CartItem;
