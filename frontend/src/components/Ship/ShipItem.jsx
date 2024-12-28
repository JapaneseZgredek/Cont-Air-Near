import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchShipImage } from '../../services/api';
import '../../styles/List.css';

const ShipItem = ({ ship }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loadingImage, setLoadingImage] = useState(true);
    const navigate = useNavigate();

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
        <Card className="grid-item-card">
            <Card.Title
                className="clickable"
                onClick={() => navigate(`/ships/${ship.id_ship}`)} // Navigate to ShipDetails
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
                {ship.name}
            </Card.Title>

            {/* Ship Details */}
            <div className="item-texts">
                <a>Status: {ship.status}</a>
            </div>

            {/* Image */}
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
        </Card>
    );
};

export default ShipItem;
