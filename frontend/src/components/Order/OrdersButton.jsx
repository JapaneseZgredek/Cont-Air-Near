import React, { useState } from 'react';
import {Button, Modal, ModalBody, Spinner, Table} from 'react-bootstrap';
import {fetchOrdersByPort, fetchOrdersByClient} from "../../services/api";

function OrdersButton({portId, portName, clientId, clientName}) {
    if (!portId && !clientId) {
        throw new Error("OrdersButton requires either portId or clientId");
    }

    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading ] = useState(false);

    const openModal = async () => {
        setLoading(true);
        try {
            let ordersData;
            if (portId) {
                ordersData = await fetchOrdersByPort(portId);
            } else if (clientId) {
                ordersData = await fetchOrdersByClient(clientId);
            }
            setOrders(ordersData);
        } catch (error) {
            console.error('Failed to fetch operations:', error);
        } finally {
            setLoading(false);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setOrders([]);
    }

    return (
        <>
            <Button variant="info" onClick={openModal} style={{ marginRight: "10px" }}>
                Show Orders
            </Button>

            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Orders for {portId ? "Port" + portName : "Client" + clientName}</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : orders.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Date of Order</th>
                                    <th>Status</th>
                                    <th>Description</th>
                                    <th>Port ID</th>
                                    <th>Client ID</th>
                                </tr>
                            </thead>
                            <tbody>
                            {orders.map((op, index) =>
                                <tr key={op.id_order}>
                                    <td>{index + 1}</td>
                                    <td>{new Date(op.date_of_order).toLocaleString()}</td>
                                    <td>{op.status}</td>
                                    <td>{op.description}</td>
                                    <td>{portName ? portName : op.id_port}</td>
                                    <td>{clientName ? clientName : op.id_client}</td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No Orders found for this port.</p>
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

export default OrdersButton;