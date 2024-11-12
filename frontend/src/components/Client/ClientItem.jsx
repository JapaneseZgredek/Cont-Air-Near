import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteClient } from '../../services/api';
import UpdateClient from "./UpdateClient";

const ClientItem = ({ client, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdatedModal, setShowUpdateModal] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteClient(client.id_client);
            onDelete(client.id_client);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to delete client: ', error);
        }
    };

    const openUpdateModal = () => {
        setShowUpdateModal(true);
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
    }

    return (
        <>
        <Card className="mb-3">
            <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                    <Card.Title>{client.name}</Card.Title>
                    <Card.Text>Address: {client.address}</Card.Text>
                    <Card.Text>Telephone_number: {client.telephone_number}</Card.Text>
                    <Card.Text>Email: {client.email}</Card.Text>
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
                Are you sure you want to delete this record? There is no going back
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
            </Modal.Footer>
        </Modal>

        <UpdateClient
            client={client}
            show={showUpdatedModal}
            onHide={closeUpdateModal}
            onUpdate={onUpdate}
        />
        </>
    );
};

export default ClientItem;