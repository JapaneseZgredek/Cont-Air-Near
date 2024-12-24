import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClientDetails } from '../../services/api';
import { Container, Table, Card, Row, Col, Button } from 'react-bootstrap';

const ClientDetails = () => {
    const { id } = useParams(); // Pobieranie ID klienta z URL
    const [client, setClient] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Do obsługi nawigacji

    useEffect(() => {
        const loadClientDetails = async () => {
            try {
                const data = await fetchClientDetails(id);
                setClient(data);
            } catch (err) {
                setError('Failed to load client details');
            }
        };

        loadClientDetails();
    }, [id]);

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!client) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="client-details-container">
            <h2>Client Details</h2>
            <div className="section-divider mb-4"></div>

            <Row className="mb-4">
                <Col md={6}>
                    <Card className="p-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Client Information</Card.Title>
                            <p><strong>Name:</strong> {client.name}</p>
                            <p><strong>Address:</strong> {client.address}</p>
                            <p><strong>Telephone Number:</strong> {client.telephone_number || 'N/A'}</p>
                            <p><strong>Email:</strong> {client.email}</p>
                            <p><strong>Logon Name:</strong> {client.logon_name}</p>
                            <p><strong>Role:</strong> {client.role}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h4>Associated Orders</h4>
            {client.orders.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {client.orders.map((orderId) => (
                            <tr
                                key={orderId}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/orders/${orderId}`)} // Przejście do szczegółów zamówienia
                            >
                                <td>{orderId}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No associated orders</p>
            )}
        </Container>
    );
};

export default ClientDetails;
