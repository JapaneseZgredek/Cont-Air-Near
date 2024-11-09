import React, { useEffect, useState } from 'react';
import ClientItem from './ClientItem';
import AddClient from './AddClient';
import { fetchProducts } from '../../services/api';
import { Container } from 'react-bootstrap';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);

    const loadClients = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/clients');
            const data = await response.json();
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
                <AddClient onAdd={handleAddClient} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {clients.length > 0 ? (
                clients.map((client) => (
                    <ClientItem key={client.id_client} client={client} onDelete={handleDeleteClient} onUpdate={handleUpdateClient}/>))
            ) : (
                <p>No clients available.</p>
            )}
        </Container>
    );
};

export default ClientList;