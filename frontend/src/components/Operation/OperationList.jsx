import React, { useEffect, useState, useContext } from 'react';
import OperationItem from './OperationItem';
import AddOperation from './AddOperation';
import { fetchOperations } from '../../services/api';
import { Container, Pagination, Dropdown } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const OperationList = () => {
    const [operations, setOperations] = useState([]);
    const [filteredOperations, setFilteredOperations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInColumn, setSearchInColumn] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState('straight');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { role } = useContext(RoleContext);

    const loadOperations = async () => {
        try {
            const data = await fetchOperations();
            setOperations(data);
            setFilteredOperations(data); // Ensure initial view shows all data
        } catch (err) {
            setError('Failed to load operations');
            console.error('Error fetching operations:', err);
        }
    };

    useEffect(() => {
        loadOperations();
    }, []);

    useEffect(() => {
        let filtered = [...operations];

        // Apply search filtering
        if (searchTerm) {
            filtered = filtered.filter(operation => {
                const value = searchInColumn ? operation[searchInColumn] : null;

                if (!searchInColumn) {
                    return Object.values(operation).some(val =>
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

        setFilteredOperations(filtered);
    }, [operations, searchTerm, searchInColumn, sortValue]);

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

    const totalPages = Math.ceil(filteredOperations.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOperations.slice(indexOfFirstItem, indexOfLastItem);

    const handleAddOperation = (newOperation) => {
        setOperations(prevOperations => [...prevOperations, newOperation]);
    };

    const handleDeleteOperation = (id) => {
        setOperations(prevOperations => prevOperations.filter(operation => operation.id_operation !== id));
    };

    const handleUpdateOperation = (updatedOperation) => {
        setOperations(prevOperations =>
            prevOperations.map(operation =>
                operation.id_operation === updatedOperation.id_operation ? updatedOperation : operation
            )
        );
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Operations</h2>
                {(['EMPLOYEE', 'ADMIN'].includes(role)) && (
                    <AddOperation onAdd={handleAddOperation} />
                )}
            </div>
            <hr className="divider" />

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={handleSortChange}
                filterOptions={['name of operation', 'operation type', 'date of operation']}
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
            <div className={`${displayType}-list`}>
                {currentItems.length > 0 ? (
                    currentItems.map(operation => (
                        <OperationItem
                            key={operation.id_operation}
                            operation={operation}
                            onDelete={handleDeleteOperation}
                            onUpdate={handleUpdateOperation}
                        />
                    ))
                ) : (
                    <p>No operations available.</p>
                )}
            </div>
        </Container>
    );
};

export default OperationList;
