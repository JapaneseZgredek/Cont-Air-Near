import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { updateOrder_product } from '../../services/api';
import { fetchOrders } from '../../services/api';
import { fetchProducts } from '../../services/api';

const Order_productUpdate = ({ order_product, show, onHide, onUpdate }) => {
    const [idOrder, setIdOrder] = useState(order_product.id_order);
    const [idProduct, setIdProduct] = useState(order_product.id_product);
    const [quantity, setQuantity] = useState(order_product.quantity);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedOrder_product = {
            id_order: idOrder,
            id_product: idProduct,
            quantity: quantity
        };
        try {
            const result = await updateOrder_product(updatedOrder_product);
            onUpdate(result);
            onHide();
        } catch (error) {
            console.error('Failed to update order_product:', error);
        }
    };

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const loadOrders = async () => {
        try {
            const data = await fetchOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to load orders');
        }
    };
    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products');
        }
    };
    useEffect(() => {
        loadOrders();
        loadProducts();
    }, []);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Order</Modal.Title>
                
            </Modal.Header>
            <Modal.Body>
            <Card.Text>Order ID: {order_product.id_order} Product: {
                            products.find((product) => product.id_product === order_product.id_product)?.name || 'Unknown Product'
                        }</Card.Text>
                    {error && <p className="err-field">{"Err: "+error}</p>}
                <Form onSubmit={handleSubmit}>
                    
                {/*<Form.Group className="mb-3">
                    <Form.Label>Order</Form.Label>
                    <Form.Control 
                    as="select"
                    required
                    value={idOrder}
                    onChange={(e) => setIdOrder(e.target.value)}
                    placeholder="Select order">
                        <option value="">Select Order</option>
                	    {
                	    	orders.map((order) => (
                	    		<option key={order.id_order} value={order.id_order}>{order.id_order}</option>
                	    	))
                	    }
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Product</Form.Label>
                    <Form.Control
                    as="select"
                    required
                    value={idProduct}
                    onChange={(e) => setIdProduct(e.target.value)}
                    placeholder="Select product">
                        <option value="">Select Product</option>
                	    {
                	    	products.map((product) => (
                	    		<option key={product.id_product} value={product.id_product}>{product.name}</option>
                	    	))
                	    }
                    </Form.Control>
                </Form.Group>*/}

                <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        type="number"
                        value={quantity}
                        min="1"
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter Quantity"
                    />
                </Form.Group>

                    <Button variant="success" type="submit">Save Changes</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default Order_productUpdate;
