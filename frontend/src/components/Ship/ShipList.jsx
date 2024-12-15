import React, { useEffect, useState } from 'react';
import ShipItem from './ShipItem';
import AddShip from './AddShip';
import { fetchShips } from '../../services/api';
import { Container } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar'; // 🆕 Import komponentu do wyszukiwania i filtrowania
import '../../styles/List.css';

const ShipList = () => {
    const [ships, setShips] = useState([]);
    const [filteredShips, setFilteredShips] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);
    const [displayType, setDisplayType] = useState("grid");

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

            {error && <p className="err-field">{"Err: "+error}</p>}
            <div className={`${displayType}-list`}>
            {filteredShips.length > 0 ? (
                filteredShips.map((ship) => (
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
