import React, { useEffect, useState } from 'react';
import ShipItem from './ShipItem';
import AddShip from './AddShip';
import { fetchShips } from '../../services/api';
import { Container } from 'react-bootstrap';

const ShipList = () => {
    const [ships, setShips] = useState([]);
    const [error, setError] = useState(null);

    const loadShips = async () => {
        try {
            const data = await fetchShips();
            setShips(data);
        } catch (err) {
            setError('Failed to load ships');
        }
    };

    useEffect(() => {
        loadShips();
    }, []);

    const handleAddShip = (newShip) => {
        setShips((prevShips) => [...prevShips, newShip]);
    };

    const handleDeleteShip = (id) => {
        setShips((prevShips) => prevShips.filter((ship) => ship.id_ship !== id));
    }

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Ship List</h2>
                <AddShip onAdd={handleAddShip} />
            </div>
            {error && <p style={{ color: 'red'}}>{error}</p>}
            {ships.length > 0 ? (
                ships.map((ship) => <ShipItem key={ship.id_ship} ship={ship} onDelete={handleDeleteShip}/>)
            ) : (
                <p>No ships available.</p>
            )}
        </Container>
    )
}

export default ShipList;