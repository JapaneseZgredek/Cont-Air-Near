import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteOperation } from '../../services/api';
import UpdateOperation from "./UpdateOperation";

const OperationItem = ({ operation, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

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
                        <Card.Title>{operation.name_of_operation}</Card.Title>
                        <Card.Text>Type: {operation.operation_type}</Card.Text>
                        <Card.Text>Date: {new Date(operation.date_of_operation).toLocaleString()}</Card.Text>
                        <Card.Text>Ship ID: {operation.id_ship}</Card.Text>
                        <Card.Text>Port ID: {operation.id_port}</Card.Text>
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
                    Are you sure you want to delete this operation? There is no going back
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
                </Modal.Footer>
            </Modal>

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
