import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deleteShip, fetchShipImage } from '../../services/api';
import UpdateShip from "./UpdateShip";
import OperationsButton from "../Operation/OperationsButton";
import GenericDetailModal from "../GenericDetailModal";
import '../../styles/List.css';

const ShipItem = ({ ship, onUpdate, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdatedModal, setShowUpdateModal] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [loadingImage, setLoadingImage] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [displayType, setDisplayType] = useState("grid");

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
        loadImage();
    }

    const loadImage = async () => {
        try {
              setLoadingImage(true);
              const url = await fetchShipImage(ship.id_ship);
              setImageUrl(url);
          } catch (error) {
              console.error("Failed to load ship image", error);
              setImageUrl(null);
          } finally {
              setLoadingImage(false);
          }
      };

    useEffect(() => {
        loadImage();
    }, [ship.id_ship]);

    return (
        <>
        <Card className={`${displayType}-item-card`}>
                <Card.Title
                    className="clickable"
                    onClick={() => setShowDetailModal(true)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {ship.name}
                </Card.Title>

                {/* Kontener dla tekstów */}
                <div className="item-texts">    
                    <a>Capacity: {ship.capacity}</a>
                </div>

                {/* Obrazek */}
                <div>
                        {loadingImage ? (
                            <div className="loading-message">Loading image...</div>
                        ) : imageUrl ? (
                            <img 
                                className="item-image" 
                                src={imageUrl} 
                                alt={`Ship_${ship.id_ship}`} 
                            />
                        ) : (
                            <div className="missing-image">Missing image</div>
                        )}
                    </div>

                {/* Kontener dla przycisków */}
                <div className="item-buttons">
                    <OperationsButton shipId={ship.id_ship} shipName={ship.name} />
                    <Button variant="warning" onClick={openUpdateModal}>Update</Button>
                    <Button variant="danger" onClick={() => setShowConfirm(true)}>Delete</Button>
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

