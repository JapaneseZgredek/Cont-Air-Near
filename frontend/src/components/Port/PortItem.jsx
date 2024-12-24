import React, { useState, useContext } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { deletePort } from '../../services/api';
import UpdatePort from "./UpdatePort";
import OperationsButton from "../Operation/OperationsButton";
import OrdersButton from "../Order/OrdersButton";
import ProductButton from "../Product/ProductButton";
import { RoleContext } from '../../contexts/RoleContext';

const PortItem = ({ port, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const { role } = useContext(RoleContext);
    const navigate = useNavigate(); // Do obsługi nawigacji

    const handleDelete = async () => {
        try {
            await deletePort(port.id_port);
            onDelete(port.id_port);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to delete port: ', error);
        }
    };

    const openUpdateModal = () => {
        setShowUpdateModal(true);
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
    };

    return (
        <>
            <Card className="straight-item-card">
                <Card.Title
                    className="clickable"
                    onClick={() => navigate(`/ports/${port.id_port}`)} // Przejście do widoku szczegółowego
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {port.name}
                </Card.Title>
                <div className="item-texts">
                    <Card.Text><strong>Location:</strong> {port.location}</Card.Text>
                    <Card.Text><strong>Country:</strong> {port.country}</Card.Text>
                </div>
                <div className="item-buttons">
                    {(['EMPLOYEE', 'ADMIN'].includes(role)) && (
                        <>
                            <ProductButton portId={port.id_port} portName={port.name} />
                            <OperationsButton portId={port.id_port} portName={port.name} />
                            <OrdersButton portId={port.id_port} portName={port.name} />
                            <Button variant="warning" onClick={openUpdateModal}>Update</Button>
                            <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>
                        </>
                    )}
                </div>
            </Card>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this port? There is no going back.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            <UpdatePort
                port={port}
                show={showUpdateModal}
                onHide={closeUpdateModal}
                onUpdate={onUpdate}
            />
        </>
    );
};

export default PortItem;
