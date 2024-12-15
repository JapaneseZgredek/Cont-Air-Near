import React, { useEffect, useState } from 'react';
import ClientItem from './ClientItem';
import AddClient from './AddClient';
import SearchAndFilterBar from "../SearchAndFilterBar";
import { fetchClients } from '../../services/api';
import { Container, Button } from 'react-bootstrap';
import '../../styles/List.css';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);
    const [filteredClients, setFilteredClients] = useState([]);
    const filterOptions = ['name', 'address', 'telephone number', 'email'];
    const [searchInColumn, setSearchInColumn] = useState('');
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [displayType, setDisplayType] = useState("straight");

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

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredClients(clients); // 🆕 Jeśli brak frazy, przywracamy oryginalną listę
        } else if (searchInColumn) { // 🆕 Szukaj w konkretnej kolumnie
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

    const handleSearchInChange = (column) => {
        setSearchInColumn(column); // 🆕 Aktualizacja kolumny wyszukiwania
    };

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
                <h2>Clients</h2>
                <Button variant="primary" onClick={() => setShowAddClientModal(true)}>
                    Add Client
                </Button>
            </div>
            <hr className="divider" /> {/*linia podzialu*/}

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={handleSortChange}
                filterOptions={filterOptions}
            />
            
            {error && <p className="err-field">{"Err: "+error}</p>}
            <div className={`${displayType}-list`}>
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
            </div>
        </Container>
    );
};

export default ClientList;
