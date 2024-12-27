import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchShipDetails } from '../../services/api';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';

const ShipDetails = () => {
    const { id } = useParams();
    const [ship, setShip] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const loadShipDetails = async () => {
            try {
                const data = await fetchShipDetails(id);

                // Decode image if in Base64 format
                if (data.image) {
                    data.image = `data:image/jpeg;base64,${data.image}`;
                }

                setShip(data);
            } catch (err) {
                setError('Failed to load ship details');
            }
        };

        loadShipDetails();
    }, [id]);

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!ship) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="ship-details-container">
            <h2 className="section-name">Ship Details</h2>
            <div className="section-divider mb-4"></div>

            {/* Ship Overview */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="p-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Ship Information</Card.Title>
                            <p><strong>Name:</strong> {ship.name}</p>
                            <p><strong>Status:</strong> <Badge bg="info">{ship.status}</Badge></p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    {ship.image ? (
                        <Card className="p-3 shadow-sm">
                            <Card.Img variant="top" src={ship.image} alt={ship.name} className="img-fluid" />
                        </Card>
                    ) : (
                        <Card className="p-3 shadow-sm">
                            <Card.Body>
                                <p>No image available</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Operations Section */}
            <h4 className="section-name">Operations</h4>
            <div className="section-divider mb-3"></div>
            {ship.operations.length > 0 ? (
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
                        {ship.operations.map((operation) => (
                            <tr
                                key={operation.id_operation}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/operations/${operation.id_operation}`)} // Navigate to OperationDetails
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
                <p>No operations associated with this ship.</p>
            )}
        </Container>
    );
};

export default ShipDetails;
