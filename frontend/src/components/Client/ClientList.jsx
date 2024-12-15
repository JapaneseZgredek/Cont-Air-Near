import React, { useEffect, useState } from 'react';
import ClientItem from './ClientItem';
import AddClient from './AddClient';
import { fetchClients } from '../../services/api';
import { Container, Button } from 'react-bootstrap';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);
    const [showAddClientModal, setShowAddClientModal] = useState(false);

    const loadClients = async () => {
        try {
            const data = await fetchClients();
            setClients(data);
        } catch (err) {
            setError('Failed to load clients');
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const handleAddClient = (newClient) => {
        setClients((prevClients) => [...prevClients, newClient]);
        setShowAddClientModal(false);
    };

    const handleUpdateClient = (updatedClient) => {
        setClients((prevClients) =>
            prevClients.map((client) =>
                client.id_client === updatedClient.id_client ? updatedClient : client
            )
        );
    };

    const handleDeleteClient = (id) => {
        setClients((prevClients) => prevClients.filter((client) => client.id_client !== id));
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Client List</h2>
                <Button variant="primary" onClick={() => setShowAddClientModal(true)}>
                    Add Client
                </Button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {clients.length > 0 ? (
                clients.map((client) => (
                    <ClientItem
                        key={client.id_client}
                        client={client}
                        onDelete={handleDeleteClient}
                        onUpdate={handleUpdateClient}
                    />
                ))
            ) : (
                <p>No clients available.</p>
            )}
            <AddClient
                show={showAddClientModal}
                onHide={() => setShowAddClientModal(false)}
                onAdd={handleAddClient}
            />
        </Container>
    );
};

export default ClientList;
