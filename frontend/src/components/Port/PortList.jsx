import React, { useEffect, useState, useContext } from 'react';
import PortItem from './PortItem';
import AddPort from './AddPort';
import { fetchPorts } from '../../services/api';
import { Container, Pagination, Dropdown } from 'react-bootstrap';
import '../../styles/List.css';
import SearchAndFilterBar from '../SearchAndFilterBar';
import { RoleContext } from '../../contexts/RoleContext';

const PortList = () => {
    const [ports, setPorts] = useState([]);
    const [filteredPorts, setFilteredPorts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInColumn, setSearchInColumn] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { role } = useContext(RoleContext);

    const loadPorts = async () => {
        try {
            const data = await fetchPorts();
            setPorts(data);
            setFilteredPorts(data);
        } catch (err) {
            setError('Failed to load ports');
            console.error('Error fetching ports:', err);
        }
    };

    useEffect(() => {
        loadPorts();
    }, []);

    useEffect(() => {
        let filtered = [...ports];

        // Apply search filtering
        if (searchTerm) {
            filtered = filtered.filter(port => {
                const value = searchInColumn ? port[searchInColumn] : null;

                if (!searchInColumn) {
                    return Object.values(port).some(val =>
                        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        // Apply sorting
        if (sortValue) {
            filtered.sort((a, b) => {
                const valueA = a[sortValue];
                const valueB = b[sortValue];

                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    return valueA - valueB;
                }

                return valueA?.toString().localeCompare(valueB?.toString());
            });
        }

        setFilteredPorts(filtered);
    }, [ports, searchTerm, searchInColumn, sortValue]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleSearchInChange = (column) => {
        setSearchInColumn(column);
    };

    const handleSortChange = (sortField) => {
        setSortValue(sortField);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredPorts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPorts.slice(indexOfFirstItem, indexOfLastItem);

    const handleAddPort = (newPort) => {
        setPorts(prevPorts => [...prevPorts, newPort]);
    };

    const handleDeletePort = (id) => {
        setPorts(prevPorts => prevPorts.filter(port => port.id_port !== id));
    };

    const handleUpdatePort = (updatedPort) => {
        setPorts(prevPorts =>
            prevPorts.map(port => (port.id_port === updatedPort.id_port ? updatedPort : port))
        );
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Ports</h2>
                {(['EMPLOYEE', 'ADMIN'].includes(role)) && (
                    <AddPort onAdd={handleAddPort} />
                )}
            </div>
            <hr className="divider" />

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={handleSortChange}
                filterOptions={['name', 'location', 'country']}
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
                        <Pagination.Item active>{currentPage}</Pagination.Item>
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
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
                        {[1, 5, 10, 25, 50].map(number => (
                            <Dropdown.Item key={number} eventKey={number}>
                                {number}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {error && <p className="err-field">{"Err: " + error}</p>}
            <div className="straight-list">
                {currentItems.length > 0 ? (
                    currentItems.map(port => (
                        <PortItem
                            key={port.id_port}
                            port={port}
                            onDelete={handleDeletePort}
                            onUpdate={handleUpdatePort}
                        />
                    ))
                ) : (
                    <p>No ports available.</p>
                )}
            </div>
        </Container>
    );
};

export default PortList;
