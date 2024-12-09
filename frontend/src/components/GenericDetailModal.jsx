import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const GenericDetailModal = ({ show, onHide, title, details }) => {
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {Object.entries(details).map(([key, value]) => (
                    <p key={key}>
                        <strong>{key}:</strong> {value !== null && value !== undefined ? value.toString() : 'N/A'}
                    </p>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GenericDetailModal;