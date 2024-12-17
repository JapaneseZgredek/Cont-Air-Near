import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteOrder, fetchPorts, fetchClients } from '../../services/api';
import OrderUpdate from "./OrderUpdate";
import OrdersButton from "./OrdersButton";
import GenericDetailModal from "../GenericDetailModal";
import '../../styles/List.css';

const OrderItem = ({ order, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [displayType, setDisplayType] = useState("straight");
    const [portName, setPortName] = useState('');
    const [clientName, setClientName] = useState('');
    const [error, setError] = useState('');

    // Fetch port and client names based on the order's ids
    useEffect(() => {
        const fetchNames = async () => {
            try {
                const [portsResponse, clientsResponse] = await Promise.all([
                    fetchPorts(),
                    fetchClients(),
                ]);

                const foundPort = portsResponse.find(port => port.id_port === order.id_port);
                const foundClient = clientsResponse.find(client => client.id_client === order.id_client);

                setPortName(foundPort ? foundPort.name : 'Unknown Port');
                setClientName(foundClient ? foundClient.name : 'Unknown Client');
            } catch (error) {
                setError('Error fetching port/client names');
                console.error('Error fetching port/client names:', error);
            }
        };

        fetchNames();
    }, [order.id_port, order.id_client]);

    // Handle order deletion
    const handleDelete = async () => {
        try {
            await deleteOrder(order.id_order);
            onDelete(order.id_order);
            setShowConfirm(false);
        } catch (error) {
            setError('Failed to delete order');
            console.error('Failed to delete order:', error);
        }
    };

    const openUpdateModal = () => setShowUpdateModal(true);
    const closeUpdateModal = () => setShowUpdateModal(false);

    return (
        <>
            <Card className={`${displayType}-item-card`}>
                    <Card.Title
                        className="clickable"
                        onClick={() => setShowDetailModal(true)}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Order ID: {order.id_order}
                    </Card.Title>

                    {/* Kontener dla tekstów */}
                    <div className="item-texts">
                        <a>Status: {order.status}</a>
                        <a>Description: {order.description}</a>
                        <a>Port ID: {portName || 'Loading...'}</a>
                        <a>Client ID: {clientName || 'Loading...'}</a>
                    </div>

                    {/* Kontener dla przycisków */}
                    <div className="item-buttons">
                        <Order_productButton orderId={order.id_order}/>
                        <Button variant="warning" className="me-2" onClick={openUpdateModal}>Update</Button>
                        <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>

                        <OrdersButton portId={order.id_port} portName={portName} clientId={order.id_client} clientName={clientName} />
                    </div>
            </Card>

            {/* Confirmation Modal for Deletion */}
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

            {/* Generic Detail Modal for Viewing Order Details */}
            <GenericDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                title={`Order: ${order.id_order}`}
                details={order}
            />

            {/* Order Update Modal */}
            <OrderUpdate
                order={order}
                show={showUpdateModal}
                onHide={closeUpdateModal}
                onUpdate={onUpdate}
            />

            {/* Display any error that occurs while fetching data */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
    );
};

export default OrderItem;
