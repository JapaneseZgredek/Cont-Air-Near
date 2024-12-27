import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPortDetails, deletePort, updatePort } from '../../services/api';
import { Container, Table, Row, Col, Card, Badge, Button, Modal } from 'react-bootstrap';
import UpdatePort from './UpdatePort';
import '../../styles/panel.css';

const PortDetails = () => {
    const { id } = useParams(); // Retrieve port ID from URL
    const [port, setPort] = useState(null); // State for port details
    const [error, setError] = useState(null); // State for errors
    const [showConfirm, setShowConfirm] = useState(false); // Confirmation modal state
    const [showUpdateModal, setShowUpdateModal] = useState(false); // Update modal state
    const navigate = useNavigate(); // Navigation hook

    const loadPortDetails = async () => {
        try {
            const data = await fetchPortDetails(id); // Fetch port details
            setPort(data);
        } catch (err) {
            setError('Failed to load port details');
        }
    };

    useEffect(() => {
        loadPortDetails();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deletePort(id); // Delete port
            navigate('/ports'); // Redirect to port list after deletion
        } catch (error) {
            console.error('Failed to delete port:', error);
        }
    };

    const handleUpdate = async (updatedPort) => {
        try {
            await updatePort(updatedPort); // Update port
            setShowUpdateModal(false); // Close the update modal
            loadPortDetails(); // Reload updated port details
        } catch (error) {
            console.error('Failed to update port:', error);
        }
    };

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
                        {port.operations.map((operation) => (
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
                                onClick={() => navigate(`/orders/${order.id_order}`)} // Navigate to OrderDetails
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
                            <tr
                                key={product.id_product}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/products/${product.id_product}`)} // Navigate to ProductDetails
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
                <p>No products associated with this port.</p>
            )}

            {/* Action Buttons */}
            <div className="mt-4 d-flex justify-content-between">
                <Button variant="warning" onClick={() => setShowUpdateModal(true)}>
                    Update Port
                </Button>
                <Button variant="danger" onClick={() => setShowConfirm(true)}>
                    Delete Port
                </Button>
            </div>

            {/* Confirmation Modal for Deletion */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this port? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Update Modal */}
            <UpdatePort
                port={port}
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                onUpdate={handleUpdate}
            />
        </Container>
    );
};

export default PortDetails;
