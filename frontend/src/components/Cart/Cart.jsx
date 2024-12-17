import React, { useEffect, useState } from 'react';
import CartItem from './CartItem';
import { Container, Button, Form, Card } from 'react-bootstrap';
import { createOrder, createOrder_product, fetchCurrentClient, fetchPorts } from '../../services/api';

const Cart = ({ onProductRestore }) => {
    const [cartItems, setCartItems] = useState([]);
    const [ports, setPorts] = useState([]);
    const [selectedPortId, setSelectedPortId] = useState('');
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
        calculateTotals(cart);

        if (cart.length > 0) loadPorts();
    }, []);

    const loadPorts = async () => {
        try {
            const data = await fetchPorts();
            setPorts(data);
        } catch (err) {
            console.error('Failed to load ports:', err);
            setError("Failed to load ports");
        }
    };

    const calculateTotals = (cart) => {
        const priceSum = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
        const weightSum = cart.reduce((sum, item) => sum + item.weight * (item.quantity || 1), 0);
        setTotalPrice(priceSum);
        setTotalWeight(weightSum);
    };

    const handleRemoveItem = (product) => {
        const updatedCart = cartItems.filter(item => item.id_product !== product.id_product);
        setCartItems(updatedCart);
        calculateTotals(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        if (updatedCart.length === 0) {
            setPorts([]);
            setSelectedPortId('');
        }
    };

    const validateInputs = () => {
        const errors = {};
        if (!selectedPortId) errors.selectedPortId = "Port must be selected.";
        return errors;
    };

    const handleCheckout = async () => {
        const errors = validateInputs();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const clientData = await fetchCurrentClient();
        try {
            const orderPayload = {
                status: 'pending',
                id_port: parseInt(selectedPortId),
                id_client: clientData.id_client,
            };

            const orderResponse = await createOrder(orderPayload);
            const orderId = orderResponse.id_order;

            await Promise.all(cartItems.map(item =>
                createOrder_product({
                    id_order: orderId,
                    id_product: item.id_product,
                    quantity: item.quantity || 1,
                })
            ));

            localStorage.removeItem('cart');
            setCartItems([]);
            setPorts([]);
            setSelectedPortId('');
            alert('Order placed successfully!');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place the order. Please try again.');
        }
    };

    return (
        <Container>
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="text-primary">Your Cart</h2>
                        <h5 className="text-secondary">Items: {cartItems.length}</h5>
                    </div>

                    {cartItems.length > 0 && (
                        <Form.Group className="mb-3">
                            <Form.Label>Select Port for Delivery</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedPortId}
                                onChange={(e) => setSelectedPortId(e.target.value)}
                                isInvalid={!!validationErrors.selectedPortId}
                            >
                                <option value="">Select Port</option>
                                {ports.map((port) => (
                                    <option key={port.id_port} value={port.id_port}>{port.name}</option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.selectedPortId}
                            </Form.Control.Feedback>
                        </Form.Group>
                    )}

                    {cartItems.length > 0 ? (
                        <>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                                {cartItems.map((item) => (
                                    <CartItem
                                        key={item.id_product}
                                        item={item}
                                        onRemove={handleRemoveItem}
                                    />
                                ))}
                            </div>

                            <hr />
                            <div className="d-flex justify-content-between mb-3">
                                <h5>Total Price:</h5>
                                <h5 className="text-success">{totalPrice.toFixed(2)} PLN</h5>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <h5>Total Weight:</h5>
                                <h5 className="text-info">{totalWeight.toFixed(2)} kg</h5>
                            </div>
                        </>
                    ) : (
                        <p className="text-muted">Your cart is empty.</p>
                    )}

                    {cartItems.length > 0 && (
                        <div className="d-flex justify-content-end">
                            <Button variant="success" size="lg" onClick={handleCheckout}>
                                Place Order
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Cart;
