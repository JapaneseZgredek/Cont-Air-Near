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
    const [searchInColumn, setSearchInColumn] = useState('');
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
        }
    };

    useEffect(() => {
        loadPorts();
    }, []);

    const handleAddPort = (newPort) => {
        setPorts((prevPorts) => [...prevPorts, newPort]);
        setFilteredPorts((prevPorts) => [...prevPorts, newPort]);
    };

    const handleUpdatePort = (updatedPort) => {
        setPorts((prevPorts) =>
            prevPorts.map((port) =>
                port.id_port === updatedPort.id_port ? updatedPort : port
            )
        );
        setFilteredPorts((prevPorts) =>
            prevPorts.map((port) =>
                port.id_port === updatedPort.id_port ? updatedPort : port
            )
        );
    };

    const handleDeletePort = (id) => {
        setPorts((prevPorts) => prevPorts.filter((port) => port.id_port !== id));
        setFilteredPorts((prevPorts) => prevPorts.filter((port) => port.id_port !== id));
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredPorts(ports);
        } else if (searchInColumn) {
            const filtered = ports.filter(port =>
                port[searchInColumn] && port[searchInColumn].toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPorts(filtered);
        } else {
            const filtered = ports.filter(port =>
                Object.values(port).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredPorts(filtered);
        }
    };

    const handleSearchInChange = (column) => {
        setSearchInColumn(column);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredPorts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPorts.slice(indexOfFirstItem, indexOfLastItem);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };


    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Ports</h2>
                {(['EMPLOYEE','ADMIN'].includes(role)) && (
                <AddPort onAdd={handleAddPort} />
                )}
            </div>
            <hr className="divider" /> {/*linia podzialu*/}

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={() => {}}
                filterOptions={['name', 'location', 'country']}
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
            <div className="straight-list">

            {currentItems.length > 0 ? (
                currentItems.map((port) => (
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
