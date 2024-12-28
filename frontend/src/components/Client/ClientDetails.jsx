import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClientDetails, deleteClient, updateClient } from '../../services/api';
import { Container, Table, Card, Row, Col, Button, Modal, Badge } from 'react-bootstrap';
import UpdateClient from "./UpdateClient";
import '../../styles/panel.css'; // Include consistent styling

const ClientDetails = () => {
    const { id } = useParams(); // Client ID from URL
    const [client, setClient] = useState(null); // Client details state
    const [error, setError] = useState(null); // Error state
    const [showConfirm, setShowConfirm] = useState(false); // Confirmation modal for deletion
    const [showUpdateModal, setShowUpdateModal] = useState(false); // Modal for client update
    const navigate = useNavigate(); // Navigation hook

    const loadClientDetails = async () => {
        try {
            const data = await fetchClientDetails(id);
            setClient(data);
        } catch (err) {
            setError('Failed to load client details');
        }
    };

    useEffect(() => {
        loadClientDetails();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteClient(id); // Delete client in the database
            navigate('/clients'); // Redirect to the client list
        } catch (error) {
            console.error('Failed to delete client:', error);
        }
    };

    const handleUpdate = async (updatedClient) => {
        try {
            await updateClient(updatedClient); // Update client in the database
            setShowUpdateModal(false); // Close the update modal
            loadClientDetails(); // Reload client details
        } catch (error) {
            console.error('Failed to update client:', error);
        }
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!client) {
        return <p>Loading...</p>;
    }

    return (
        <Container>
            <h2 className="section-name">Client Details</h2>
            <div className="section-divider mb-4"></div>

            {/* Client Overview */}
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
                            <p><strong>Role:</strong> <Badge bg="info">{client.role}</Badge></p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Associated Orders Section */}
            <h4 className="section-name">Associated Orders</h4>
            <div className="section-divider mb-3"></div>
            {client.orders.length > 0 ? (
                <Table striped bordered hover className="shadow-sm">
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
                                onClick={() => navigate(`/orders/${orderId}`)} // Navigate to order details
                            >
                                <td>{orderId}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No associated orders</p>
            )}

            {/* Action Buttons */}
            <div className="mt-4 d-flex justify-content-between">
                <Button
                    variant="warning"
                    onClick={() => setShowUpdateModal(true)}
                >
                    Update Client
                </Button>
                <Button
                    variant="danger"
                    onClick={() => setShowConfirm(true)}
                >
                    Delete Client
                </Button>
            </div>

            {/* Confirmation Modal for Deletion */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this client? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Update Modal */}
            <UpdateClient
                client={client}
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                onUpdate={handleUpdate}
            />
        </Container>
    );
};

export default ClientDetails;
