import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductDetails, deleteProduct, updateProduct } from '../../services/api';
import { Container, Table, Card, Row, Col, Button, Modal } from 'react-bootstrap';
import UpdateProduct from './UpdateProduct';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const loadProductDetails = async () => {
        try {
            const data = await fetchProductDetails(id);

            // If the product has a base64 image, prefix it for rendering
            if (data.image) {
                data.image = `data:image/jpeg;base64,${data.image}`;
            }

            setProduct(data);
        } catch (err) {
            setError('Failed to load product details');
        }
    };

    useEffect(() => {
        loadProductDetails();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteProduct(id);
            navigate('/products'); // Redirect to product list after deletion
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const handleUpdate = async (updatedProduct) => {
        try {
            await updateProduct(updatedProduct);
            setShowUpdateModal(false); // Close modal
            loadProductDetails(); // Reload updated product details
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="product-details-container">
            <h2>Product Details</h2>
            <div className="section-divider mb-4"></div>

            <Row className="mb-4">
                <Col md={6}>
                    <Card className="p-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                            <p><strong>Weight:</strong> {product.weight.toFixed(2)} kg</p>
                            <p>
                                <strong>Port:</strong>{' '}
                                <span
                                    className="clickable"
                                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => navigate(`/ports/${product.port_id}`)}
                                >
                                    {product.port}
                                </span>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="img-fluid" />
                    ) : (
                        <p>No image available</p>
                    )}
                </Col>
            </Row>

            {/* Associated Orders */}
            <h4>Associated Orders</h4>
            {product.orders.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.orders.map((orderId) => (
                            <tr
                                key={orderId}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/orders/${orderId}`)}
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
                <Button variant="warning" onClick={() => setShowUpdateModal(true)}>
                    Update Product
                </Button>
                <Button variant="danger" onClick={() => setShowConfirm(true)}>
                    Delete Product
                </Button>
            </div>

            {/* Confirmation Modal for Deletion */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this product? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Update Modal */}
            <UpdateProduct
                product={product}
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                onUpdate={handleUpdate}
            />
        </Container>
    );
};

export default ProductDetails;
