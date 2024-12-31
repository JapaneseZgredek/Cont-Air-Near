import React, { useEffect, useState, useContext } from 'react';
import ShipItem from './ShipItem';
import AddShip from './AddShip';
import { fetchShips } from '../../services/api';
import { Container, Pagination, Dropdown } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';
import '../../styles/List.css';
import { RoleContext } from '../../contexts/RoleContext';

const ShipList = () => {
    const [ships, setShips] = useState([]);
    const [filteredShips, setFilteredShips] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInColumn, setSearchInColumn] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { role } = useContext(RoleContext);

    const loadShips = async () => {
        try {
            const data = await fetchShips();
            setShips(data);
            setFilteredShips(data);
        } catch (err) {
            setError('Failed to load ships');
            console.error('Error fetching ships:', err);
        }
    };

    useEffect(() => {
        loadShips();
    }, []);

    useEffect(() => {
        let filtered = [...ships];

        // Apply search filtering
        if (searchTerm) {
            filtered = filtered.filter(ship => {
                const value = searchInColumn ? ship[searchInColumn] : null;

                if (!searchInColumn) {
                    return Object.values(ship).some(val =>
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

        setFilteredShips(filtered);
    }, [ships, searchTerm, searchInColumn, sortValue]);

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

    const totalPages = Math.ceil(filteredShips.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredShips.slice(indexOfFirstItem, indexOfLastItem);

    const handleAddShip = (newShip) => {
        setShips(prevShips => [...prevShips, newShip]);
    };

    const handleDeleteShip = (id) => {
        setShips(prevShips => prevShips.filter(ship => ship.id_ship !== id));
    };

    const handleUpdateShip = (updatedShip) => {
        setShips(prevShips =>
            prevShips.map(ship =>
                ship.id_ship === updatedShip.id_ship ? updatedShip : ship
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
                <h2>Ships</h2>
                {(['EMPLOYEE', 'ADMIN'].includes(role)) && (
                    <AddShip onAdd={handleAddShip} />
                )}
            </div>
            <hr className="divider" />

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={handleSortChange}
                filterOptions={['name']}
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
                    currentItems.map(ship => (
                        <ShipItem
                            key={ship.id_ship}
                            ship={ship}
                            onDelete={handleDeleteShip}
                            onUpdate={handleUpdateShip}
                        />
                    ))
                ) : (
                    <p>No ships available.</p>
                )}
            </div>
        </Container>
    );
};

export default ShipList;
