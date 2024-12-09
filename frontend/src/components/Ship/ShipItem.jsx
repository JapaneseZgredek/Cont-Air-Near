import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteShip } from '../../services/api';
import UpdateShip from "./UpdateShip";
import OperationsButton from "../Operation/OperationsButton";
import GenericDetailModal from "../GenericDetailModal";

const ShipItem = ({ ship, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdatedModal, setShowUpdateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteShip(ship.id_ship);
            onDelete(ship.id_ship);
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to delete ship: ', error);
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
                    <Card.Title
                        className="clickable"
                        onClick={() => setShowDetailModal(true)}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {ship.name}
                    </Card.Title>
                    <Card.Text>Capacity: {ship.capacity}</Card.Text>
                </div>
                <div>
                    <OperationsButton shipId={ship.id_ship} shipName={ship.name} />
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

        <GenericDetailModal
            show={showDetailModal}
            onHide={() => setShowDetailModal(false)}
            title={`Ship: ${ship.name}`}
            details={ship}
        />

        <UpdateShip
            ship={ship}
            show={showUpdatedModal}
            onHide={closeUpdateModal}
            onUpdate={onUpdate}
        />
        </>
    );
};

export default ShipItem;

