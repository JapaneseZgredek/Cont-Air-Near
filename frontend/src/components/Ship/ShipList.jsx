import React, { useEffect, useState } from 'react';
import ShipItem from './ShipItem';
import AddShip from './AddShip';
import { fetchShips } from '../../services/api';
import { Button, Container } from 'react-bootstrap';

const ShipList = () => {
    const [ships, setShips] = useState([]);

    useEffect(() => {
        const loadShips = async () => {
            const data = await fetchShips();
            setShips(data);
        };
        loadShips();
    }, []);

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Ship List</h2>
                <AddShip onAdd={(newShip) => setShips([...ships, newShip])} />
            </div>
            {ships.length > 0 ? (
                ships.map((ship) => <ShipItem key={ship.id_ship} ship={ship} />)
            ) : (
                <p>No ships available.</p>
            )}
        </Container>
    )
}

export default ShipList;