import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderDetails } from '../../services/api';
import { Container, Table, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import '../../styles/panel.css'; // Load panel styles

const OrderDetails = () => {
    const { id } = useParams(); // Get the order ID from the URL
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const loadOrderDetails = async () => {
            try {
                const data = await fetchOrderDetails(id);
                setOrder(data);
            } catch (err) {
                setError('Failed to load order details');
            }
        };

        loadOrderDetails();
    }, [id]);

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!order) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="order-details-container">
            <h2 className="section-name">Order Details</h2>
            <div className="section-divider mb-4"></div>

            {/* Order Overview */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="p-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Order Information</Card.Title>
                            <p><strong>Order ID:</strong> {order.id_order}</p>
                            <p><strong>Status:</strong> <Badge bg="info">{order.status}</Badge></p>
                            <p><strong>Description:</strong> {order.description || 'No description'}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="p-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Port & Client</Card.Title>
                            <p>
                                <strong>Port:</strong>{' '}
                                <span
                                    className="clickable"
                                    style={{ cursor: 'pointer', color: '#0056b3', textDecoration: 'underline' }}
                                    onClick={() => navigate(`/ports/${order.port.id_port}`)} // Navigate to port details
                                >
                                    {order.port.name}
                                </span>
                            </p>
                            {order.client && (
                                <p>
                                    <strong>Client:</strong>{' '}
                                    <span
                                        className="clickable"
                                        style={{ cursor: 'pointer', color: '#0056b3', textDecoration: 'underline' }}
                                        onClick={() => navigate(`/clients/${order.client.id_client}`)} // Navigate to client details
                                    >
                                        {order.client.name}
                                    </span>
                                </p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Operations Section */}
            <h4 className="section-name">Operations</h4>
            <div className="section-divider mb-3"></div>
            {order.operations.length > 0 ? (
                <Table striped bordered hover className="shadow-sm">
                    <thead>
                        <tr>
                            <th>Operation ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.operations.map((operation) => (
                            <tr
                                key={operation.id_operation}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/operations/${operation.id_operation}`)} // Navigate to operation details
                            >
                                <td>{operation.id_operation}</td>
                                <td>{operation.name_of_operation}</td>
                                <td><Badge bg="info">{operation.operation_type}</Badge></td>
                                <td>{new Date(operation.date_of_operation).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No operations associated with this order.</p>
            )}

            {/* Products Section */}
            <h4 className="section-name">Products</h4>
            <div className="section-divider mb-3"></div>
            {order.products.length > 0 ? (
                <Table striped bordered hover className="shadow-sm">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.products.map((product) => (
                            <tr
                                key={product.id_product}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/products/${product.id_product}`)} // Navigate to product details
                            >
                                <td>{product.id_product}</td>
                                <td>{product.name}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{product.weight.toFixed(2)} kg</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No products associated with this order.</p>
            )}

            {/* Action Buttons */}
            <div className="mt-4 d-flex justify-content-between">
                <Button variant="primary" onClick={() => console.log('Update order')}>
                    Update Order
                </Button>
                <Button variant="danger" onClick={() => console.log('Delete order')}>
                    Delete Order
                </Button>
            </div>
        </Container>
    );
};

export default OrderDetails;
