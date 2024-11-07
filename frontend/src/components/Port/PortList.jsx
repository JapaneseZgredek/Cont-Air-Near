import React, { useEffect, useState } from 'react';
import PortItem from './PortItem';
import AddPort from './AddPort';
import { fetchPorts } from '../../services/api';
import { Container } from 'react-bootstrap';

const PortList = () => {
    const [ports, setPorts] = useState([]);
    const [error, setError] = useState(null);

    const loadPorts = async () => {
        try {
            const data = await fetchPorts();
            setPorts(data);
        } catch (err) {
            setError('Failed to load ports');
        }
    };

    useEffect(() => {
        loadPorts();
    }, []);

    const handleAddPort = (newPort) => {
        setPorts((prevPorts) => [...prevPorts, newPort]);
    };

    const handleUpdatePort = (updatedPort) => {
        setPorts((prevPorts) =>
            prevPorts.map((port) =>
                port.id_port === updatedPort.id_port ? updatedPort : port
            )
        );
    };

    const handleDeletePort = (id) => {
        setPorts((prevPorts) => prevPorts.filter((port) => port.id_port !== id));
    };

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Port List</h2>
                <AddPort onAdd={handleAddPort} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {ports.length > 0 ? (
                ports.map((port) => (
                    <PortItem key={port.id_port} port={port} onDelete={handleDeletePort} onUpdate={handleUpdatePort}/>))
            ) : (
                <p>No ports available.</p>
            )}
        </Container>
    );
};

export default PortList;