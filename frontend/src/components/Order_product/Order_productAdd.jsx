import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createOrder_product } from '../../services/api';
import { fetchOrders } from '../../services/api';
import { fetchProducts } from '../../services/api';

const Order_productAdd = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [idOrder, setIdOrder] = useState('');
    const [idProduct, setIdProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const order_productData = { 
            id_order: parseInt(idOrder),
            id_product: parseInt(idProduct),
            quantity: parseInt(quantity) 
        };
        console.log("Sending data:", order_productData); // Debugging

        try {
            const newOrder_product = await createOrder_product(order_productData);
            onAdd(newOrder_product);
            setShow(false);
            setIdOrder('');
            setIdProduct('');
            setQuantity('');
        } catch (err) {
            setError('Failed to create order_product entry, probably it is a duplicate of an product in order');
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
        <>
            <Button variant="primary" onClick={() => setShow(true)}>Add Order_product</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Order_product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
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
                        </Form.Group>

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
                        
                        <Button variant="success" type="submit">Add Order_product</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Order_productAdd;
