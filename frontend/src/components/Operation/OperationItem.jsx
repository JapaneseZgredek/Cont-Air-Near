import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteOperation } from '../../services/api';
import UpdateOperation from "./UpdateOperation";
import GenericDetailModal from "../GenericDetailModal";

const OperationItem = ({ operation, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false); // State for delete confirmation modal
    const [showUpdateModal, setShowUpdateModal] = useState(false); // State for update modal
    const [showDetailModal, setShowDetailModal] = useState(false); // State for detail modal

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
            <Card className="mb-3">
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Title
                            className="clickable"
                            onClick={() => setShowDetailModal(true)} // Open detail modal
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {operation.name_of_operation}
                        </Card.Title>
                        <Card.Text>Type: {operation.operation_type}</Card.Text>
                        <Card.Text>Date: {new Date(operation.date_of_operation).toLocaleString()}</Card.Text>
                        <Card.Text>Ship ID: {operation.id_ship}</Card.Text>
                        <Card.Text>Port ID: {operation.id_port}</Card.Text>
                        <Card.Text>Order ID: {operation.id_order}</Card.Text> {/* New: Display Order ID */}
                    </div>
                    <div>
                        <Button variant="warning" className="me-2" onClick={openUpdateModal}>Update</Button>
                        <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this operation? There is no going back
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
