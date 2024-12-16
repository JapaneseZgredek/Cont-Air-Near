import React, { useEffect, useState } from 'react';
import ShipItem from './ShipItem';
import AddShip from './AddShip';
import { fetchShips } from '../../services/api';
import { Container, Pagination, Dropdown } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar'; // 🆕 Import komponentu do wyszukiwania i filtrowania
import '../../styles/List.css';

const ShipList = () => {
    const [ships, setShips] = useState([]);
    const [filteredShips, setFilteredShips] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const loadShips = async () => {
        try {
            const data = await fetchShips();
            setShips(data);
            setFilteredShips(data);
        } catch (err) {
            setError('Failed to load ships');
        }
    };

    useEffect(() => {
        loadShips();
    }, []);

    const handleAddShip = (newShip) => {
        setShips((prevShips) => [...prevShips, newShip]);
        setFilteredShips((prevShips) => [...prevShips, newShip]);
    };

    const handleUpdateShip = (updatedShip) => {
        setShips((prevShips) =>
            prevShips.map((ship) =>
                ship.id_ship === updatedShip.id_ship ? updatedShip : ship
            )
        );
        setFilteredShips((prevShips) =>
            prevShips.map((ship) =>
                ship.id_ship === updatedShip.id_ship ? updatedShip : ship
            )
        );
    };

    const handleDeleteShip = (id) => {
        setShips((prevShips) => prevShips.filter((ship) => ship.id_ship !== id));
        setFilteredShips((prevShips) => prevShips.filter((ship) => ship.id_ship !== id)); // 🆕 Usunięcie z filtrowanej listy
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredShips(ships);
        } else if (searchInColumn) {
            const filtered = ships.filter(ship =>
                ship[searchInColumn] && ship[searchInColumn].toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredShips(filtered);
        } else {
            const filtered = ships.filter(ship =>
                Object.values(ship).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredShips(filtered);
        }
    };

    const handleSearchInChange = (column) => {
        setSearchInColumn(column);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredShips.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredShips.slice(indexOfFirstItem, indexOfLastItem);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Ships</h2>
                <AddShip onAdd={handleAddShip} />
            </div>
            <hr className="divider" /> {/*linia podzialu*/}

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={() => {}}
                filterOptions={['name', 'capacity']}
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
                currentItems.map((ship) => (
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
    )
}

export default ShipList;
