import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPortDetails } from '../../services/api';
import { Container, Table, Row, Col, Card, Badge } from 'react-bootstrap';
import '../../styles/panel.css';

const PortDetails = () => {
    const { id } = useParams(); // Pobieranie ID z URL
    const [port, setPort] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Do obsługi nawigacji

    useEffect(() => {
        const loadPortDetails = async () => {
            try {
                const data = await fetchPortDetails(id);
                setPort(data);
            } catch (err) {
                setError('Failed to load port details');
            }
        };

        loadPortDetails();
    }, [id]);

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!port) {
        return <p>Loading...</p>;
    }

    return (
        <Container>
            <h2 className="section-name">Port Details</h2>
            <div className="section-divider mb-4"></div>

            {/* Port Overview */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="p-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Port Information</Card.Title>
                            <p><strong>Name:</strong> {port.name}</p>
                            <p><strong>Location:</strong> {port.location}</p>
                            <p><strong>Country:</strong> {port.country}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Operations Section */}
            <h4 className="section-name">Operations</h4>
            <div className="section-divider mb-3"></div>
            {port.operations.length > 0 ? (
                <ul>
                    {port.operations.map((op) => (
                        <li key={op.id_operation}>
                            <strong>{op.name}</strong>: {op.description || 'No description'}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No operations available.</p>
            )}

            {/* Orders Section */}
            <h4 className="section-name">Orders</h4>
            <div className="section-divider mb-3"></div>
            {port.orders.length > 0 ? (
                <Table striped bordered hover className="shadow-sm">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {port.orders.map((order) => (
                            <tr
                                key={order.id_order}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/orders/${order.id_order}`)} // Nawigacja do OrderDetails
                            >
                                <td>{order.id_order}</td>
                                <td>{order.description || 'No description'}</td>
                                <td><Badge bg="info">{order.status}</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No orders associated with this port.</p>
            )}

            {/* Products Section */}
            <h4 className="section-name">Products</h4>
            <div className="section-divider mb-3"></div>
            {port.products.length > 0 ? (
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
                        {port.products.map((product) => (
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
                <p>No products associated with this port.</p>
            )}
        </Container>
    );
};

export default PortDetails;
