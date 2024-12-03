import React, { useState } from 'react';
import { Button, Modal, ModalBody, Spinner, Table } from 'react-bootstrap';
import { fetchOrderHistoriesByOrder } from "../../services/api";

function OrderHistoryButton({ orderId, orderDescription }) {
    if (!orderId) {
        throw new Error("OrderHistoryButton requires orderId");
    }

    const [histories, setHistories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const openModal = async () => {
        setLoading(true);
        try {
            const historiesData = await fetchOrderHistoriesByOrder(orderId);
            setHistories(historiesData);
        } catch (error) {
            console.error('Failed to fetch order histories:', error);
        } finally {
            setLoading(false);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setHistories([]);
    };

    return (
        <>
            <Button variant="info" onClick={openModal} style={{ marginRight: "10px" }}>
                Show Order Histories
            </Button>

            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Order Histories for Order {orderDescription}</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : histories.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {histories.map((history, index) => (
                                    <tr key={history.id_history}>
                                        <td>{index + 1}</td>
                                        <td>{history.description}</td>
                                        <td>{new Date(history.date).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No order histories found for this order.</p>
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

export default OrderHistoryButton;
