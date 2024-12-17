import React, { useState, useContext } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteClient } from '../../services/api';
import UpdateClient from "./UpdateClient";
import OrdersButton from "../Order/OrdersButton";
import GenericDetailModal from "../GenericDetailModal";
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const ClientItem = ({ client, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdatedModal, setShowUpdateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [displayType, setDisplayType] = useState("straight");
    const { role } = useContext(RoleContext);

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
        <Card className={`${displayType}-item-card`}>
                <Card.Title
                    className="clickable"
                    onClick={() => setShowDetailModal(true)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {client.name}
                </Card.Title>

                {/* Kontener dla tekstów */}
                <div className="item-texts">
                    <a>Address: {client.address}</a>
                    <a>Telephone number: {client.telephone_number}</a>
                    <a>Email: {client.email}</a>
                </div>

                {/* Kontener dla przycisków */}
                <div className="item-buttons">
                {(['ADMIN'].includes(role)) && (
                    <>
                    <OrdersButton clientId={client.id_client} clientName={client.name} />
                    <Button variant="warning" className="me-2" onClick={openUpdateModal}>Update</Button>
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
                Are you sure you want to delete this record? There is no going back
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
            </Modal.Footer>
        </Modal>

        <GenericDetailModal
            show={showDetailModal}
            onHide={() => setShowDetailModal(false)}
            title={`Client: ${client.name}`}
            details={client}
        />

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