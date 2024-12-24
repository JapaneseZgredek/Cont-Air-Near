import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchShipDetails } from '../../services/api';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';

const ShipDetails = () => {
    const { id } = useParams();
    const [ship, setShip] = useState(null);
    const [error, setError] = useState(null);

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
            <h2>Ship Details</h2>
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="p-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>{ship.name}</Card.Title>
                            <p><strong>Status:</strong> {ship.status}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    {ship.image ? (
                        <img src={ship.image} alt={ship.name} className="img-fluid" />
                    ) : (
                        <p>No image available</p>
                    )}
                </Col>
            </Row>

            <h4>Operations</h4>
            {ship.operations.length > 0 ? (
                <Table striped bordered hover>
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
                            <tr key={operation.id_operation}>
                                <td>{operation.id_operation}</td>
                                <td>{operation.name_of_operation}</td>
                                <td>{operation.operation_type}</td>
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
