import React, { useState, useEffect, useContext } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchPorts, fetchClients } from '../../services/api';
import '../../styles/List.css';

const OrderItem = ({ order }) => {
    const [portName, setPortName] = useState('');
    const [clientName, setClientName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNames = async () => {
            try {
                const [portsResponse, clientsResponse] = await Promise.all([
                    fetchPorts(),
                    fetchClients(),
                ]);

                const foundPort = portsResponse.find(port => port.id_port === order.id_port);
                const foundClient = clientsResponse.find(client => client.id_client === order.id_client);

                setPortName(foundPort ? foundPort.name : 'Unknown Port');
                setClientName(foundClient ? foundClient.name : 'Unknown Client');
            } catch (error) {
                console.error('Error fetching port/client names:', error);
            }
        };

        fetchNames();
    }, [order.id_port, order.id_client]);

    return (
        <Card className="straight-item-card">
                <Card.Title
                    className="clickable"
                    onClick={() => navigate(`/orders/${order.id_order}`)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Order ID: {order.id_order}
                </Card.Title>
                <div className="item-texts">
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Description:</strong> {order.description || 'No description'}</p>
                    <p><strong>Port:</strong> {portName || 'Loading...'}</p>
                    <p><strong>Client:</strong> {clientName || 'Loading...'}</p>
                </div>
        </Card>
    );
};

export default OrderItem;
