import React, {useEffect, useState} from 'react';
import {Button, Modal, ModalBody, Spinner, Table} from 'react-bootstrap';
import {fetchOrders_productsByOrder, fetchOrders_productsByProduct, fetchProducts} from "../../services/api";

function Order_productsButton({orderId, productId, productName}) {
    if (!orderId && !productId) {
        throw new Error("OrdersButton requires either orderId or productId");
    }
    const [order_products, setOrder_products] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading ] = useState(false);
    const [error, setError] = useState("");

    const openModal = async () => {
        setLoading(true);
        try {
            
            let order_productsData;
            if (orderId) {
                order_productsData = await fetchOrders_productsByOrder(orderId);
                const products_data = await fetchProducts();
                setProducts(products_data);
            } else if (productId) {
                order_productsData = await fetchOrders_productsByProduct(productId);
            }
            setOrder_products(order_productsData);
        } catch (error) {
            console.error('Failed to fetch order_products:', error);
        } finally {
            setLoading(false);
            setShowModal(true);
        }
    };
    const closeModal = () => {
        setShowModal(false);
        setOrder_products([]);
    }

    return (
        <>
            <Button variant="info" onClick={openModal} style={{ marginRight: "10px" }}>
                Show Order_products
            </Button>
            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Order_products for {orderId ? "Order " + orderId : "Product " + productName}</Modal.Title>
                </Modal.Header>
                <ModalBody>
                {error && <p style={{ color: 'red' }}>{error}</p>}

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
                            {order_products.map((op, index) =>
                                <tr key={`${op.id_order}-${op.id_product}`}>
                                    <td>{index + 1}</td>
                                    <td>{op.id_order}</td>
                                    <td>{productName ? productName : products.find((product) => product.id_product === op.id_product)?.name || 'Unknown Product'}</td>
                                    <td>{op.quantity}</td>
                                </tr>
                            )}
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
};
export default Order_productsButton;