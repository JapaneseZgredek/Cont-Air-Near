import React, { useEffect, useState } from 'react';
import ClientItem from './ClientItem';
import AddClient from './AddClient';
import SearchAndFilterBar from "../SearchAndFilterBar";
import { fetchClients } from '../../services/api';
import { Container, Button, Pagination, Dropdown } from 'react-bootstrap';
import '../../styles/List.css';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);
    const [filteredClients, setFilteredClients] = useState([]);
    const filterOptions = ['name', 'address', 'telephone number', 'email'];
    const [searchInColumn, setSearchInColumn] = useState('');
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [displayType, setDisplayType] = useState("straight");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
            
            <div className='pagination-container'>
                {/* Pagination controls */}
                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    className="pagination"
                  >
                    <Pagination.First
                        className="pagination-item"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    />      
                    <Pagination.Prev
                      className="pagination-item"
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />

                    {/* Input for page number */}
                    <Pagination.Item className="pagination-item-middle" key={currentPage}>
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => {
                                const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                                handlePageChange(page);
                            }}
                            onBlur={() => handlePageChange(currentPage)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handlePageChange(currentPage);
                                }
                            }}
                            style={{ width: '50px', textAlign: 'center' }}
                        />
                      {` / ${totalPages}`}
                    </Pagination.Item>

                    <Pagination.Next
                      className="pagination-item"
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />      
                    <Pagination.Last
                        className="pagination-item"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    />
                  </Pagination>
                )}

                {/* Items per page dropdown */}
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

            {error && <p className="err-field">{"Err: "+error}</p>}
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
