import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, Spinner, Table } from 'react-bootstrap';
import {
    fetchOrders_productsByOrder,
    fetchOrders_productsByProduct,
    fetchOrders_products,
    fetchProducts,
} from "../../services/api";

function Order_productsButton({ orderId, productId, productName }) {
    if (!orderId && !productId) {
        throw new Error("Order_productsButton requires either orderId or productId");
    }

    const [order_products, setOrder_products] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Helper function to fetch data based on type
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            if (orderId) {
                const order_productsData = await fetchOrders_productsByOrder(orderId);
                const productsData = await fetchProducts();
                setOrder_products(order_productsData);
                setProducts(productsData);
            } else if (productId) {
                const order_productsData = await fetchOrders_productsByProduct(productId);
                setOrder_products(order_productsData);
            }
        } catch (err) {
            console.error('Error fetching order_products:', err);
            setError("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const openModal = async () => {
        await fetchData();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setOrder_products([]);
    };

    // Resolve product name
    const getProductName = (idProduct) => {
        if (productName) return productName; // Passed directly as prop
        const product = products.find((p) => p.id_product === idProduct);
        return product ? product.name : 'Unknown Product';
    };

    return (
        <>
            <Button variant="info" onClick={openModal} style={{ marginRight: "10px" }}>
                Show Order_products
            </Button>

            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Order_products for {orderId ? `Order ${orderId}` : `Product ${productName}`}
                    </Modal.Title>
                </Modal.Header>

                <ModalBody>
                {error && <p className="err-field">{"Err: "+error}</p>}

                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : order_products.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order_products.map((op, index) => (
                                    <tr key={`${op.id_order}-${op.id_product}`}>
                                        <td>{index + 1}</td>
                                        <td>{op.id_order}</td>
                                        <td>{getProductName(op.id_product)}</td>
                                        <td>{op.quantity > 0 ? op.quantity : 'Invalid Quantity'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No Order_products found.</p>
                    )}
                </ModalBody>

                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Order_productsButton;
