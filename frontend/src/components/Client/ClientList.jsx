import React, { useEffect, useState } from 'react';
import ClientItem from './ClientItem';
import AddClient from './AddClient';
import SearchAndFilterBar from "../SearchAndFilterBar";
import { fetchClients } from '../../services/api';
import { Container, Button } from 'react-bootstrap';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [error, setError] = useState(null);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const filterOptions = ['name', 'address', 'telephone_number', 'email'];

    // Load clients from the API
    const loadClients = async () => {
        try {
            const data = await fetchClients();
            setClients(data);
            setFilteredClients(data);
        } catch (err) {
            setError('Failed to load clients');
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    // Handle add client
    const handleAddClient = (newClient) => {
        setClients((prevClients) => [...prevClients, newClient]);
        setFilteredClients((prevClients) => [...prevClients, newClient]);
        setShowAddClientModal(false);
    };

    // Handle update client
    const handleUpdateClient = (updatedClient) => {
        setClients((prevClients) =>
            prevClients.map((client) =>
                client.id_client === updatedClient.id_client ? updatedClient : client
            )
        );
        setFilteredClients((prevClients) =>
            prevClients.map((client) =>
                client.id_client === updatedClient.id_client ? updatedClient : client
            )
        );
    };

    // Handle delete client
    const handleDeleteClient = (id) => {
        setClients((prevClients) => prevClients.filter((client) => client.id_client !== id));
        setFilteredClients((prevClients) => prevClients.filter((client) => client.id_client !== id));
    };

    // Handle search
    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredClients(clients);
        } else if (searchInColumn) {
            const filtered = clients.filter(client =>
                client[searchInColumn] && client[searchInColumn].toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredClients(filtered);
        } else {
            const filtered = clients.filter(client =>
                Object.values(client).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredClients(filtered);
        }
    };

    // Handle search in column change
    const handleSearchInChange = (column) => {
        setSearchInColumn(column);
    };

    // Handle sorting
    const handleSortChange = (sortField) => {
        const sorted = [...filteredClients].sort((a, b) => {
            if (a[sortField] < b[sortField]) return -1;
            if (a[sortField] > b[sortField]) return 1;
            return 0;
        });
        setFilteredClients(sorted);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Client List</h2>
                <Button variant="primary" onClick={() => setShowAddClientModal(true)}>
                    Add Client
                </Button>
            </div>

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={handleSortChange}
                filterOptions={filterOptions}
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
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
