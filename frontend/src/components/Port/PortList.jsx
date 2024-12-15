import React, { useEffect, useState } from 'react';
import PortItem from './PortItem';
import AddPort from './AddPort';
import { fetchPorts } from '../../services/api';
import { Container } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';

const PortList = () => {
    const [ports, setPorts] = useState([]);
    const [filteredPorts, setFilteredPorts] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);

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

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Port List</h2>
                <AddPort onAdd={handleAddPort} />
            </div>

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={() => {}}
                filterOptions={['name', 'location', 'country']}
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {filteredPorts.length > 0 ? (
                filteredPorts.map((port) => (
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
        </Container>
    );
};

export default PortList;
