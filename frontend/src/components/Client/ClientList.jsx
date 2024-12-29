import React, { useEffect, useState, useContext } from 'react';
import ClientItem from './ClientItem';
import AddClient from './AddClient';
import SearchAndFilterBar from "../SearchAndFilterBar";
import { fetchClients } from '../../services/api';
import { Container, Button, Pagination, Dropdown } from 'react-bootstrap';
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInColumn, setSearchInColumn] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [displayType, setDisplayType] = useState("straight");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { role } = useContext(RoleContext);
    const filterOptions = ['name', 'address', 'telephone_number', 'email'];

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

    useEffect(() => {
        let filtered = clients;

        if (searchTerm) {
            filtered = filtered.filter(client =>
                searchInColumn
                    ? client[searchInColumn]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    : Object.values(client).some(value =>
                          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                      )
            );
        }

        if (sortValue) {
            filtered = filtered.sort((a, b) => {
                const valueA = a[sortValue] || '';
                const valueB = b[sortValue] || '';

                if (sortValue === 'email') {
                    // Ignorowanie wielkości liter w porównaniu e-maili
                    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
                }

                // Domyślne sortowanie dla innych pól
                if (valueA < valueB) return -1;
                if (valueA > valueB) return 1;
                return 0;
            });
        }

        setFilteredClients(filtered);
    }, [clients, searchTerm, searchInColumn, sortValue]);

    const handleAddClient = (newClient) => {
        setClients((prevClients) => [...prevClients, newClient]);
        setFilteredClients((prevClients) => [...prevClients, newClient]);
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Clients</h2>
                {(['ADMIN'].includes(role)) && (
                <Button variant="primary" onClick={() => setShowAddClientModal(true)}>
                    Add Client
                </Button>
                )}
            </div>
            <hr className="divider" />

            <SearchAndFilterBar
                onSearch={setSearchTerm}
                onSearchInChange={setSearchInColumn}
                onSortChange={setSortValue}
                filterOptions={filterOptions}
            />

            <div className="pagination-container">
                {totalPages > 1 && (
                  <Pagination>
                    <Pagination.First
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    />
                    <Pagination.Item>
                        {currentPage} / {totalPages}
                    </Pagination.Item>
                    <Pagination.Next
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    />
                  </Pagination>
                )}
                <Dropdown onSelect={handleItemsPerPageChange}>
                  <Dropdown.Toggle variant="success" id="dropdown-items-per-page">
                    Items per page: {itemsPerPage}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {[1, 5, 10, 25, 50].map((number) => (
                      <Dropdown.Item key={number} eventKey={number}>
                        {number}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
            </div>

            {error && <p className="err-field">{"Err: " + error}</p>}
            <div className={`${displayType}-list`}>
                {currentItems.length > 0 ? (
                    currentItems.map((client) => (
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
