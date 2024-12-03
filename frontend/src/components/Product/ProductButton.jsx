import React, { useState } from 'react';
import { Button, Modal, ModalBody, Spinner, Table } from 'react-bootstrap';
import { fetchProductsByPort } from "../../services/api";

function ProductButton({ portId, portName }) {
    if (!portId) {
        throw new Error("ProductButton requires portId");
    }

    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const openModal = async () => {
        setLoading(true);
        try {
            const productsData = await fetchProductsByPort(portId);
            setProducts(productsData);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setProducts([]);
    };

    return (
        <>
            <Button variant="info" onClick={openModal} style={{ marginRight: "10px" }}>
                Show Products
            </Button>

            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Products for Port {portName}</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : products.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.id_product}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>${product.price.toFixed(2)}</td>
                                        <td>{product.weight} kg</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No products found for this port.</p>
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

export default ProductButton;
