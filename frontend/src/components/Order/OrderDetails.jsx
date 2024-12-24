import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderDetails } from '../../services/api';
import { Container, Table, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import '../../styles/panel.css'; // Wczytanie stylów z panel.css

const OrderDetails = () => {
    const { id } = useParams(); // Pobieranie ID z URL
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Do obsługi nawigacji

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
                                    onClick={() => navigate(`/ports/${order.port.id_port}`)} // Przejście do szczegółów portu
                                >
                                    {order.port.name}
                                </span>
                            </p>
                            {order.client && <p><strong>Client:</strong> {order.client.name}</p>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Operations Section */}
            <h4 className="section-name">Operations</h4>
            <div className="section-divider mb-3"></div>
            {order.operations.length > 0 ? (
                <ul>
                    {order.operations.map((op) => (
                        <li key={op.id_operation}>
                            <strong>{op.name}</strong>: {op.description || 'No description'}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No operations available.</p>
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
                            <tr key={product.id_product}>
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
