import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchShipDetails, deleteShip, updateShip } from '../../services/api';
import { Container, Row, Col, Card, Table, Badge, Button, Modal } from 'react-bootstrap';
import UpdateShip from './UpdateShip';
import { RoleContext } from '../../contexts/RoleContext';

const ShipDetails = () => {
    const { id } = useParams();
    const [ship, setShip] = useState(null);
    const [error, setError] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false); // State for update modal
    const [showConfirm, setShowConfirm] = useState(false); // State for delete confirmation modal
    const { role } = useContext(RoleContext);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const loadShipDetails = async () => {
            try {
                const data = await fetchShipDetails(id);

                setShip(data);
            } catch (err) {
                setError('Failed to load ship details');
            }
        };

        loadShipDetails();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteShip(id); // Delete ship from the database
            navigate('/ships'); // Redirect to the ships list after deletion
        } catch (error) {
            console.error('Failed to delete ship:', error);
        }
    };

    const handleUpdate = async (updatedShip) => {
        try {
            await updateShip(updatedShip); // Update ship in the database
            setShowUpdateModal(false); // Close the update modal
            const data = await fetchShipDetails(id); // Refresh details
            setShip(data);
        } catch (error) {
            console.error('Failed to update ship:', error);
        }
    };

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
                            <Card.Img variant="top" src={`data:image/jpeg;base64,${ship.image}`} alt={ship.name} className="img-fluid" />
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

            {/* Action Buttons */}
            {(['EMPLOYEE', 'ADMIN'].includes(role)) && (
            <div className="mt-4 d-flex justify-content-between">
                <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => setShowUpdateModal(true)}
                >
                    Update Ship
                </Button>
                <Button
                    variant="danger"
                    onClick={() => setShowConfirm(true)}
                >
                    Delete Ship
                </Button>
            </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this ship? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Update Modal */}
            <UpdateShip
                ship={ship}
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                onUpdate={handleUpdate}
            />
        </Container>
    );
};

export default ShipDetails;
