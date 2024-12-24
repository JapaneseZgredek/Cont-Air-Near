import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductDetails } from '../../services/api';
import { Container, Table, Card, Row, Col } from 'react-bootstrap';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProductDetails = async () => {
            try {
                const data = await fetchProductDetails(id);

                // Jeśli obraz jest zakodowany w Base64, dodajemy prefix
                if (data.image) {
                    data.image = `data:image/jpeg;base64,${data.image}`; // Zakładamy format JPEG
                }

                setProduct(data);
            } catch (err) {
                setError('Failed to load product details');
            }
        };

        loadProductDetails();
    }, [id]);

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
                            {/* Port Name as Clickable Link */}
                            <p>
                                <strong>Port:</strong>{' '}
                                <span
                                    className="clickable"
                                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => navigate(`/ports/${product.port_id}`)} // Zakładamy, że portId jest w danych produktu
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
        </Container>
    );
};

export default ProductDetails;
