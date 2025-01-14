import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOperationDetails, deleteOperation, updateOperation } from '../../services/api';
import { Container, Card, Row, Col, Badge, Button, Modal } from 'react-bootstrap';
import UpdateOperation from './UpdateOperation';
import { RoleContext } from '../../contexts/RoleContext';
import '../../styles/panel.css';

const OperationDetails = () => {
    const { id_operation } = useParams(); // Extract operation ID from URL
    const [operation, setOperation] = useState(null); // Store operation details
    const [error, setError] = useState(null); // Store errors
    const [showUpdateModal, setShowUpdateModal] = useState(false); // State for Update Modal
    const [showConfirm, setShowConfirm] = useState(false); // State for Delete Confirmation Modal
    const navigate = useNavigate(); // Navigation hook
    const { role } = useContext(RoleContext);

    const loadOperationDetails = async () => {
        try {
            const data = await fetchOperationDetails(id_operation); // Fetch operation details from API
            setOperation(data);
        } catch (err) {
            setError('Failed to load operation details');
        }
    };

    useEffect(() => {
        loadOperationDetails();
    }, [id_operation]);

    const handleDelete = async () => {
        try {
            await deleteOperation(id_operation); // Delete operation via API
            navigate('/operations'); // Redirect to operations list
        } catch (error) {
            console.error('Failed to delete operation:', error);
        }
    };

    const handleUpdate = async (updatedOperation) => {
        try {
            await updateOperation(updatedOperation); // Update operation via API
            setShowUpdateModal(false); // Close Update Modal
            loadOperationDetails(); // Reload updated operation details
        } catch (error) {
            console.error('Failed to update operation:', error);
        }
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!operation) {
        return <p>Loading...</p>;
    }

    return (
        <Container>
            <h2 className="section-name">Operation Details</h2>
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
                    <Card className="p-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Associated Entities</Card.Title>
                            {operation.ship_id && (
                                <p>
                                    <strong>Ship:</strong>{' '}
                                    <span
                                        className="clickable"
                                        style={{ cursor: 'pointer', color: '#0056b3', textDecoration: 'underline' }}
                                        onClick={() => navigate(`/ships/${operation.ship_id}`)}
                                    >
                                        {operation.ship_name}
                                    </span>
                                </p>
                            )}
                            {operation.port_id && (
                                <p>
                                    <strong>Port:</strong>{' '}
                                    <span
                                        className="clickable"
                                        style={{ cursor: 'pointer', color: '#0056b3', textDecoration: 'underline' }}
                                        onClick={() => navigate(`/ports/${operation.port_id}`)}
                                    >
                                        {operation.port_name}
                                    </span>
                                </p>
                            )}
                            {operation.order_id && (
                                <p>
                                    <strong>Order:</strong>{' '}
                                    <span
                                        className="clickable"
                                        style={{ cursor: 'pointer', color: '#0056b3', textDecoration: 'underline' }}
                                        onClick={() => navigate(`/orders/${operation.order_id}`)}
                                    >
                                        Order ID: {operation.order_id}
                                    </span>
                                </p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Action Buttons */}
            {(['EMPLOYEE', 'ADMIN'].includes(role)) && (
            <div className="mt-4 d-flex justify-content-between">
                <Button variant="warning" onClick={() => setShowUpdateModal(true)}>
                    Update Operation
                </Button>
                <Button variant="danger" onClick={() => setShowConfirm(true)}>
                    Delete Operation
                </Button>
            </div>
            )}

            {/* Confirmation Modal for Deletion */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this operation? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Update Modal */}
            <UpdateOperation
                operation={operation}
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                onUpdate={handleUpdate}
            />
        </Container>
    );
};

export default OperationDetails;
