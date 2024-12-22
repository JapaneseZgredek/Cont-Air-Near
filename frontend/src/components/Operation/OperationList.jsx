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
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("straight");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { role } = useContext(RoleContext);    

    const loadOperations = async () => {
        try {
            const data = await fetchOperations();
            setOperations(data);
            setFilteredOperations(data);
        } catch (err) {
            setError('Failed to load operations');
        }
    };

    useEffect(() => {
        loadOperations();
    }, []);

    const handleAddOperation = (newOperation) => {
        setOperations((prevOperations) => [...prevOperations, newOperation]);
        setFilteredOperations((prevOperations) => [...prevOperations, newOperation]);
    };

    const handleUpdateOperation = (updatedOperation) => {
        setOperations((prevOperations) =>
            prevOperations.map((operation) =>
                operation.id_operation === updatedOperation.id_operation ? updatedOperation : operation
            )
        );
        setFilteredOperations((prevOperations) =>
            prevOperations.map((operation) =>
                operation.id_operation === updatedOperation.id_operation ? updatedOperation : operation
            )
        );
    };

    const handleDeleteOperation = (id) => {
        setOperations((prevOperations) => prevOperations.filter((operation) => operation.id_operation !== id));
        setFilteredOperations((prevOperations) => prevOperations.filter((operation) => operation.id_operation !== id));
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredOperations(operations);
        } else if (searchInColumn) {
            const filtered = operations.filter(operation =>
                operation[searchInColumn] && operation[searchInColumn].toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOperations(filtered);
        } else {
            const filtered = operations.filter(operation =>
                Object.values(operation).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredOperations(filtered);
        }
    };

    const handleSearchInChange = (column) => {
        setSearchInColumn(column);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredOperations.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOperations.slice(indexOfFirstItem, indexOfLastItem);

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
            <hr className="divider" /> {/*linia podzialu*/}
            

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={() => {}}
                filterOptions={['name of operation', 'operation type', 'date of operation', 'id ship', 'id port']}
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
                currentItems.map((operation) => (
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
