import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../styles/List.css';

const PortItem = ({ port }) => {
    const navigate = useNavigate();

    return (
        <Card className="straight-item-card">
            <Card.Title
                className="clickable"
                onClick={() => navigate(`/ports/${port.id_port}`)} // Navigate to PortDetails
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
                {port.name}
            </Card.Title>
            <div className="item-texts">
                <Card.Text><strong>Location:</strong> {port.location}</Card.Text>
                <Card.Text><strong>Country:</strong> {port.country}</Card.Text>
            </div>
        </Card>
    );
};

export default PortItem;
