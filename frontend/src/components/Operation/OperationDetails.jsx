import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOperationDetails } from '../../services/api';
import { Container, Card, Row, Col, Badge, Button } from 'react-bootstrap';

const OperationDetails = () => {
    const { id_operation } = useParams();
    const [operation, setOperation] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadOperationDetails = async () => {
            try {
                const data = await fetchOperationDetails(id_operation);
                setOperation(data);
            } catch (err) {
                setError('Failed to load operation details');
            }
        };

        loadOperationDetails();
    }, [id_operation]);

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!operation) {
        return <p>Loading...</p>;
    }

    return (
        <Container>
            <h2>Operation Details</h2>
            <div className="section-divider mb-4"></div>

            {/* Operation Overview */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="p-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Operation Information</Card.Title>
                            <p><strong>Name:</strong> {operation.name_of_operation}</p>
                            <p><strong>Type:</strong> <Badge bg="info">{operation.operation_type}</Badge></p>
                            <p><strong>Date:</strong> {new Date(operation.date_of_operation).toLocaleString()}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    {operation.ship_name && (
                        <Card className="p-3 shadow-sm">
                            <Card.Body>
                                <Card.Title>Ship</Card.Title>
                                <p
                                    className="clickable"
                                    style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0056b3' }}
                                    onClick={() => navigate(`/ships/${operation.ship_id}`)}
                                >
                                    {operation.ship_name}
                                </p>
                            </Card.Body>
                        </Card>
                    )}
                    {operation.port_name && (
                        <Card className="p-3 shadow-sm">
                            <Card.Body>
                                <Card.Title>Port</Card.Title>
                                <p
                                    className="clickable"
                                    style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0056b3' }}
                                    onClick={() => navigate(`/ports/${operation.port_id}`)}
                                >
                                    {operation.port_name}
                                </p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Order Link */}
            {operation.order_id && (
                <Card className="p-3 shadow-sm">
                    <Card.Body>
                        <Card.Title>Related Order</Card.Title>
                        <p
                            className="clickable"
                            style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0056b3' }}
                            onClick={() => navigate(`/orders/${operation.order_id}`)}
                        >
                            Order ID: {operation.order_id}
                        </p>
                    </Card.Body>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="mt-4">
                <Button variant="primary" onClick={() => navigate(-1)}>Back</Button>
            </div>
        </Container>
    );
};

export default OperationDetails;
