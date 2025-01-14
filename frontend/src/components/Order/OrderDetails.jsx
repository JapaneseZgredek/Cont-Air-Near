import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderDetails, deleteOrder } from '../../services/api';
import { Container, Table, Row, Col, Card, Badge, Button, Modal } from 'react-bootstrap';
import OrderUpdate from './OrderUpdate';
import { RoleContext } from '../../contexts/RoleContext';
import '../../styles/panel.css';

const OrderDetails = () => {
    const { id } = useParams(); // Get order ID from URL
    const [order, setOrder] = useState(null); // State for order details
    const [error, setError] = useState(null); // State for error messages
    const [showConfirm, setShowConfirm] = useState(false); // State for delete confirmation modal
    const [showUpdateModal, setShowUpdateModal] = useState(false); // State for update modal
    const navigate = useNavigate(); // Hook for navigation
        const { role } = useContext(RoleContext);

    const loadOrderDetails = async () => {
        try {
            const data = await fetchOrderDetails(id); // Fetch order details
            setOrder(data);
        } catch (err) {
            setError('Failed to load order details');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteOrder(id); // Delete the order
            navigate('/orders'); // Redirect to orders list after deletion
        } catch (err) {
            setError('Failed to delete order');
            console.error(err);
        }
    };

    const handleUpdate = async (updatedOrder) => {
        setShowUpdateModal(false); // Close the update modal
        loadOrderDetails(); // Reload order details after update
    };

    useEffect(() => {
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
                                    onClick={() => navigate(`/ports/${order.port.id_port}`)} // Navigate to port details
                                >
                                    {order.port.name}
                                </span>
                            </p>
                            {order.client && (
                                <p>
                                    <strong>Client:</strong>{' '}
                                    <span
                                        className="clickable"
                                        style={{ cursor: 'pointer', color: '#0056b3', textDecoration: 'underline' }}
                                        onClick={() => navigate(`/clients/${order.client.id_client}`)} // Navigate to client details
                                    >
                                        {order.client.name}
                                    </span>
                                </p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Operations Section */}
            <h4 className="section-name">Operations</h4>
            <div className="section-divider mb-3"></div>
            {order.operations.length > 0 ? (
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
                        {order.operations.map((operation) => (
                            <tr
                                key={operation.id_operation}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/operations/${operation.id_operation}`)} // Navigate to operation details
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
                <p>No operations associated with this order.</p>
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
                            <tr
                                key={product.id_product}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/products/${product.id_product}`)} // Navigate to product details
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
                <p>No products associated with this order.</p>
            )}

            {/* Action Buttons */}
            {(['EMPLOYEE', 'ADMIN'].includes(role)) && (
            <div className="mt-4 d-flex justify-content-between">
                <Button variant="warning" onClick={() => setShowUpdateModal(true)}>Update Order</Button>
                <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete Order</Button>
            </div>
            )}

            {/* Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Update Modal */}
            <OrderUpdate
                order={order}
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                onUpdate={handleUpdate}
            />
        </Container>
    );
};

export default OrderDetails;
