import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { deleteOperation, fetchShips, fetchPorts } from '../../services/api';
import UpdateOperation from "./UpdateOperation";
import GenericDetailModal from "../GenericDetailModal";
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const OperationItem = ({ operation, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [shipName, setShipName] = useState('');
    const [portName, setPortName] = useState('');
    const { role } = useContext(RoleContext);
    const navigate = useNavigate(); // Use navigate for routing

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
            <Card className="straight-item-card">
                <Card.Title
                    className="clickable"
                    onClick={() => navigate(`/operations/${operation.id_operation}`)} // Navigate to OperationDetails
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {operation.name_of_operation}
                </Card.Title>

                {/* Operation Details */}
                <div className="item-texts">
                    <a>Type: {operation.operation_type}</a>
                    <a>Date: {new Date(operation.date_of_operation).toLocaleString()}</a>
                    <a>Ship: {shipName || 'Loading...'}</a>
                    <a>Port: {portName || 'Loading...'}</a>
                </div>

                {/* Action Buttons */}
                {(['EMPLOYEE', 'ADMIN'].includes(role)) && (
                    <div className="item-buttons">
                        <Button variant="warning" onClick={openUpdateModal}>Update</Button>
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
