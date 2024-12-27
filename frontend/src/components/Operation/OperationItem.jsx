import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchShips, fetchPorts } from '../../services/api';
import '../../styles/List.css';

const OperationItem = ({ operation }) => {
    const [shipName, setShipName] = useState('');
    const [portName, setPortName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNames = async () => {
            try {
                // Fetch ships and ports
                const shipsResponse = await fetchShips();
                const portsResponse = await fetchPorts();

                // Find the ship name using the operation id_ship
                const foundShip = shipsResponse.find(ship => ship.id_ship === operation.id_ship);
                setShipName(foundShip ? foundShip.name : 'Unknown Ship');

                // Find the port name using the operation id_port
                const foundPort = portsResponse.find(port => port.id_port === operation.id_port);
                setPortName(foundPort ? foundPort.name : 'Unknown Port');
            } catch (error) {
                console.error('Error fetching ship/port names:', error);
            }
        };

        fetchNames();
    }, [operation.id_ship, operation.id_port]);

    return (
        <Card className="straight-item-card">
            <Card.Title
                className="clickable"
                onClick={() => navigate(`/operations/${operation.id_operation}`)} // Navigate to OperationDetails
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
                {operation.name_of_operation}
            </Card.Title>

            {/* Operation Details */}
            <div className="item-texts">
                <a>Type: {operation.operation_type}</a>
                <a>Date: {new Date(operation.date_of_operation).toLocaleString()}</a>
                <a>Ship: {shipName || 'Loading...'}</a>
                <a>Port: {portName || 'Loading...'}</a>
            </div>
        </Card>
    );
};

export default OperationItem;
