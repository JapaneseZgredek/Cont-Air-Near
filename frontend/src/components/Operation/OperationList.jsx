import React, { useEffect, useState } from 'react';
import OperationItem from './OperationItem';
import AddOperation from './AddOperation';
import { fetchOperations } from '../../services/api';
import { Container } from 'react-bootstrap';
import SearchAndFilterBar from '../SearchAndFilterBar';

const OperationList = () => {
    const [operations, setOperations] = useState([]);
    const [filteredOperations, setFilteredOperations] = useState([]);
    const [searchInColumn, setSearchInColumn] = useState('');
    const [error, setError] = useState(null);

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

    return (
        <Container>
            <div className="d-flex justify-content-between mb-3">
                <h2>Operation List</h2>
                <AddOperation onAdd={handleAddOperation} />
            </div>

            <SearchAndFilterBar
                onSearch={handleSearch}
                onSearchInChange={handleSearchInChange}
                onSortChange={() => {}}
                filterOptions={['name of operation', 'operation type', 'date of operation', 'id ship', 'id port']}
            />

            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : filteredOperations.length > 0 ? (
                filteredOperations.map((operation) => (
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
        </Container>
    );
};

export default OperationList;
