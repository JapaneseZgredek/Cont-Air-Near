import React, { useEffect, useState } from 'react';
import CartItem from './CartItem';
import { Container, Button, Form } from 'react-bootstrap';
import { createOrder, createOrder_product, fetchPorts } from '../../services/api'; // Import the fetchPorts API

const Cart = ({ onProductRestore }) => {
    const [cartItems, setCartItems] = useState([]);
    const [ports, setPorts] = useState([]); // List of ports for the dropdown
    const [selectedPortId, setSelectedPortId] = useState(''); // Selected port ID
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Load cart items from localStorage on component mount
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
        if (cart.length > 0) loadPorts(); // Load the list of ports only if cart has items
    }, []);

    // Load available ports for the dropdown
    const loadPorts = async () => {
        try {
            const data = await fetchPorts();
            setPorts(data);
        } catch (err) {
            console.error('Failed to load ports:', err);
            setError("Failed to load ports");
        }
    };

    const handleRemoveItem = (product) => {
        setCartItems((prevCartItems) => prevCartItems.filter(item => item.id_product !== product.id_product));

        // Restore product back to the product list
        if (onProductRestore) {
            onProductRestore(product);
        }

        const updatedCart = cartItems.filter(item => item.id_product !== product.id_product);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        if (updatedCart.length === 0) {
            setPorts([]); // Clear ports if cart is empty
            setSelectedPortId(''); // Reset port selection
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

        try {
            const clientId = 1; // Replace with actual client ID from context/session
            const orderPayload = {
                status: 'pending',
                id_port: parseInt(selectedPortId),
                id_client: clientId
            };

            // Step 1: Create Order
            console.log("Creating Order with payload: ", orderPayload);
            const orderResponse = await createOrder(orderPayload);
            const orderId = orderResponse.id_order;

            // Step 2: Create OrderProduct entries for each product in the cart
            const orderProductPromises = cartItems.map(item => {
                const orderProductPayload = {
                    id_order: orderId,
                    id_product: item.id_product,
                    quantity: item.quantity || 1,
                };
                console.log("Creating OrderProduct with payload: ", orderProductPayload);
                return createOrder_product(orderProductPayload);
            });

            await Promise.all(orderProductPromises);

            // Clear the cart after successful checkout
            localStorage.removeItem('cart');
            setCartItems([]);
            setPorts([]); // Clear ports
            setSelectedPortId(''); // Reset the selected port
            alert('Order placed successfully!');

        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place the order. Please try again.');
        }
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Cart</h2>
            </div>

            {/* Port Dropdown: Display only if there is at least one product in the cart */}
            {cartItems.length > 0 && (
                <Form.Group className="mb-3">
                    <Form.Label>Select the port to which you want to deliver your order</Form.Label>
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
                cartItems.map((item) => (
                    <CartItem
                        key={item.id_product}
                        item={item}
                        onRemove={handleRemoveItem}
                    />
                ))
            ) : (
                <p>Your cart is empty.</p>
            )}

            {cartItems.length > 0 && (
                <div className="d-flex justify-content-end">
                    <Button variant="success" onClick={handleCheckout}>Place Order</Button>
                </div>
            )}
        </Container>
    );
};

export default Cart;
