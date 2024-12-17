import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { updateOrder_product } from '../../services/api';
import { fetchProducts } from '../../services/api';

const Order_productUpdate = ({ order_product, show, onHide, onUpdate }) => {
    const [idOrder] = useState(order_product.id_order); // Order ID is not editable
    const [idProduct] = useState(order_product.id_product); // Product ID is not editable
    const [quantity, setQuantity] = useState(order_product.quantity || '');
    const [error, setError] = useState(null);

    // Validation function
    const validateQuantity = (value) => {
        if (!value || isNaN(value) || parseInt(value, 10) <= 0) {
            return 'Quantity must be a positive integer.';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate quantity
        const quantityError = validateQuantity(quantity);
        if (quantityError) {
            setError(quantityError);
            return;
        }

        const updatedOrder_product = {
            id_order: idOrder,
            id_product: idProduct,
            quantity: parseInt(quantity, 10),
        };

        try {
            const result = await updateOrder_product(updatedOrder_product);
            onUpdate(result);
            onHide();
        } catch (err) {
            console.error('Failed to update order_product:', err);
            setError('Failed to update order_product. Please try again later.');
        }
    };

    const [products, setProducts] = useState([]);
    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products.');
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Order_product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Card.Text>Order ID: {order_product.id_order} Product: {
                            products.find((product) => product.id_product === order_product.id_product)?.name || 'Unknown Product'
                        }</Card.Text>
                    {error && <p className="err-field">{"Err: "+error}</p>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            value={quantity}
                            min="1"
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter Quantity"
                            isInvalid={!!validateQuantity(quantity)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Quantity must be a positive integer.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default Order_productUpdate;
