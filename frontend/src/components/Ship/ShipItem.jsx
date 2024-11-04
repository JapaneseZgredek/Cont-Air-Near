import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ShipItem = ({ ship }) => {
    return (
        <Card className="mb-3">
            <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                    <Card.Title>{ship.name}</Card.Title>
                    <Card.Text>Capacity: {ship.capacity}</Card.Text>
                </div>
                <div>
                    <Button variant="warning" className="me-2">Update</Button>
                    <Button variant="danger">Delete</Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ShipItem;

