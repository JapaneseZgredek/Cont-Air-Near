import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteOperation } from '../../services/api';
import UpdateOperation from "./UpdateOperation";
import GenericDetailModal from "../GenericDetailModal";
import { fetchShips } from '../../services/api'; // Assuming this is the correct import path
import { fetchPorts } from '../../services/api'; // Assuming this is the correct import path

const OperationItem = ({ operation, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [shipName, setShipName] = useState('');
    const [portName, setPortName] = useState('');

    useEffect(() => {
        const fetchNames = async () => {
            try {
                // Fetch ships and ports
                const shipsResponse = await fetchShips();
                const portsResponse = await fetchPorts();

                // Find the ship name using the operation id_ship
                const foundShip = shipsResponse.find(ship => ship.id_ship === operation.id_ship);
                setShipName(foundShip ? foundShip.name : 'Unknown Ship');

                // Find the port name using the operation id_port
                const foundPort = portsResponse.find(port => port.id_port === operation.id_port);
                setPortName(foundPort ? foundPort.name : 'Unknown Port');
            } catch (error) {
                console.error('Error fetching ship/port names:', error);
            }
        };

        fetchNames();
    }, [operation.id_ship, operation.id_port]);

    const handleDelete = async () => {
        try {
            await deleteOperation(operation.id_operation);
            onDelete(operation.id_operation);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to delete operation: ', error);
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
            <Card className="mb-3">
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Title
                            className="clickable"
                            onClick={() => setShowDetailModal(true)}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {operation.name_of_operation}
                        </Card.Title>
                        <Card.Text>Type: {operation.operation_type}</Card.Text>
                        <Card.Text>Date: {new Date(operation.date_of_operation).toLocaleString()}</Card.Text>
                        <Card.Text>Ship: {shipName || 'Loading...'}</Card.Text> {/* Show ship name */}
                        <Card.Text>Port: {portName || 'Loading...'}</Card.Text> {/* Show port name */}
                    </div>
                    <div>
                        <Button variant="warning" className="me-2" onClick={openUpdateModal}>Update</Button>
                        <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this operation? There is no going back.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

            <GenericDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                title={`Operation: ${operation.name_of_operation}`}
                details={operation}
            />

            <UpdateOperation
                operation={operation}
                show={showUpdateModal}
                onHide={closeUpdateModal}
                onUpdate={onUpdate}
            />
        </>
    );
};

export default OperationItem;
