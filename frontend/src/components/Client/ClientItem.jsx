import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../styles/List.css';

const ClientItem = ({ client }) => {
    const navigate = useNavigate(); // Do obsługi nawigacji

    return (
        <>
            <Card className="straight-item-card">
                <Card.Title
                    className="clickable"
                    onClick={() => navigate(`/clients/${client.id_client}`)} // Nawigacja do widoku ClientDetails
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {client.name}
                </Card.Title>

                {/* Kontener dla tekstów */}
                <div className="item-texts">
                    <p>Address: {client.address}</p>
                    <p>Telephone number: {client.telephone_number || 'N/A'}</p>
                    <p>Email: {client.email}</p>
                </div>
            </Card>
        </>
    );
};

export default ClientItem;
