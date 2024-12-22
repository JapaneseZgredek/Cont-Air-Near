import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteOperation } from '../../services/api';
import UpdateOperation from "./UpdateOperation";
import GenericDetailModal from "../GenericDetailModal";
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';
import { fetchShips } from '../../services/api'; // Assuming this is the correct import path
import { fetchPorts } from '../../services/api'; // Assuming this is the correct import path


const OperationItem = ({ operation, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [displayType, setDisplayType] = useState("straight");
    const { role } = useContext(RoleContext);    
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

    // Handle delete operation
    const handleDelete = async () => {
        try {
            await deleteOperation(operation.id_operation); // Call API to delete operation
            onDelete(operation.id_operation); // Trigger onDelete callback
            setShowConfirm(false); // Close confirmation modal
        } catch (error) {
            console.error('Failed to delete operation: ', error);
        }
    };

    // Open update modal
    const openUpdateModal = () => {
        setShowUpdateModal(true);
    };

    // Close update modal
    const closeUpdateModal = () => {
        setShowUpdateModal(false);
    };

    return (
        <>

            <Card className={`${displayType}-item-card`}>
                    <Card.Title
                        className="clickable"
                        onClick={() => setShowDetailModal(true)}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {operation.name_of_operation}
                    </Card.Title>

                    {/* Kontener dla tekstów */}
                    <div className="item-texts">
                        <a>Type: {operation.operation_type}</a>
                        <a>Date: {new Date(operation.date_of_operation).toLocaleString()}</a>
                        <a>Ship ID: {shipName || 'Loading...'}</a>
                        <a>Port ID: {portName || 'Loading...'}</a>
                        <a>Order ID: {operation.id_order || 'Loading...'}</a>
                    </div>
                    
                    {/* Kontener dla przycisków */}
                    {(['EMPLOYEE', 'ADMIN'].includes(role)) && (
                    <div className="item-buttons">
                        <Button variant="warning" className="me-2" onClick={openUpdateModal}>Update</Button>
                        <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>
                    </div>
                    )}
            </Card>

            {/* Confirmation Modal */}
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

            {/* Detail Modal for Operation Information */}
            <GenericDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                title={`Operation: ${operation.name_of_operation}`}
                details={{
                    Name: operation.name_of_operation,
                    Type: operation.operation_type,
                    Date: new Date(operation.date_of_operation).toLocaleString(),
                    'Ship ID': operation.id_ship,
                    'Port ID': operation.id_port,
                    'Order ID': operation.id_order, // New: Include Order ID in the details
                }}
            />

            {/* Update Operation Modal */}
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
