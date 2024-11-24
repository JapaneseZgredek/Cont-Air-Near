import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createOrder, createOrder_product } from '../../services/api';
import { fetchPorts } from '../../services/api';
import { fetchProducts } from '../../services/api';



const OrderAdd = ({ onAdd }) => {
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState('pending'); // Domyślna wartość, która jest zgodna z backendem
    const [idPort, setIdPort] = useState('');
    const [idProduct, setIdProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const orderData = {
            status,
            id_port: parseInt(idPort)};
        console.log("Sending data:", orderData); // Debugging

        try {
            const newOrder = await createOrder(orderData);
            onAdd(newOrder);
            const order_productData = {
                id_order: parseInt(newOrder.id_order),
                id_product: parseInt(idProduct),
                quantity: parseInt(quantity)};
            console.log("Sending data:", orderData); // Debugging
            await createOrder_product(order_productData);
            setShow(false);
            setStatus('pending');
            setIdPort('');
        } catch (err) {
            setError('Failed to create order');
        }
    };

    const [ports, setPorts] = useState([]);
    const [products, setProducts] = useState([]);
    const loadPorts = async () => {
        try {
            const data = await fetchPorts();
            setPorts(data);
        } catch (err) {
            setError('Failed to load ports');
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
        loadPorts();
        loadProducts();
    }, []);


    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>Add Order</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Port</Form.Label>
                            <Form.Control
                            as="select"
                            required
                            value={idPort}
                            onChange={(e) => setIdPort(e.target.value)}
                            placeholder="Select port">
                                <option value="">Select Port</option>
                			    {
                			    	ports.map((port) => (
                			    		<option key={port.id_port} value={port.id_port}>{port.name}</option>
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
                            required
                            value={quantity}
                            min="1"
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            />
                        </Form.Group>
                        <Button variant="success" type="submit">Add Order</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default OrderAdd;
